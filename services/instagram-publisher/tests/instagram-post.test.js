import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const defaultConfig = {
  openClawApiToken: "secret-token",
};

function createPublisher(overrides = {}) {
  return vi.fn(async ({ mediaType }) => ({
    ok: true,
    mediaType,
    containerId: "container-123",
    publishId: "publish-456",
    status: "published",
    metaResponses: {
      create: { id: "container-123" },
      publish: { id: "publish-456" },
    },
    ...overrides,
  }));
}

function createPersistence() {
  return {
    createLog: vi.fn(async () => "log-123"),
    updateLog: vi.fn(async () => undefined),
  };
}

async function startApp(options = {}) {
  vi.resetModules();
  const { createApp } = await import("../src/app.js");
  const app = createApp({
    config: { ...defaultConfig, ...(options.config || {}) },
    publishContent: options.publishContent || createPublisher(),
    persistence: options.persistence || createPersistence(),
    logger: options.logger || { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
  });

  const server = app.listen(0);
  const { port } = server.address();

  return {
    app,
    server,
    port,
    publishContent: options.publishContent,
    persistence: options.persistence,
  };
}

async function postJson(port, body, headers = {}) {
  return fetch(`http://127.0.0.1:${port}/instagram/post`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer secret-token",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

async function closeServer(server) {
  if (typeof server.closeAllConnections === "function") {
    server.closeAllConnections();
  }

  await new Promise((resolve) => server.close(resolve));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /instagram/post", () => {
  it("returns 401 when bearer token is missing", async () => {
    const { server, port } = await startApp();

    const response = await fetch(`http://127.0.0.1:${port}/instagram/post`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        media_type: "IMAGE",
        media_url: "https://cdn.example.com/post.jpg",
      }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Unauthorized",
    });

    await closeServer(server);
  });

  it("returns 400 when media payload is invalid", async () => {
    const persistence = createPersistence();
    const { server, port } = await startApp({ persistence });

    const response = await postJson(port, {
      media_type: "CAROUSEL",
      media_url: "not-a-url",
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Invalid request body",
      details: {
        media_type: "media_type must be IMAGE or REEL",
        media_url: "media_url must be a valid public https URL",
      },
    });
    expect(persistence.createLog).not.toHaveBeenCalled();

    await closeServer(server);
  });

  it("publishes an image post and records logs", async () => {
    const publishContent = createPublisher();
    const persistence = createPersistence();
    const { server, port } = await startApp({ publishContent, persistence });

    const response = await postJson(port, {
      media_type: "IMAGE",
      media_url: "https://cdn.example.com/post.jpg",
      caption: "Launch day",
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      media_type: "IMAGE",
      container_id: "container-123",
      publish_id: "publish-456",
      status: "published",
    });
    expect(publishContent).toHaveBeenCalledWith({
      mediaType: "IMAGE",
      mediaUrl: "https://cdn.example.com/post.jpg",
      caption: "Launch day",
    });
    expect(persistence.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "instagram",
        request_media_type: "IMAGE",
        request_media_url: "https://cdn.example.com/post.jpg",
        caption: "Launch day",
        status: "received",
      })
    );
    expect(persistence.updateLog).toHaveBeenLastCalledWith(
      "log-123",
      expect.objectContaining({
        status: "published",
        container_id: "container-123",
        publish_id: "publish-456",
      })
    );

    await closeServer(server);
  });

  it("publishes a reel after polling completes", async () => {
    const publishContent = createPublisher({
      mediaType: "REEL",
      containerId: "reel-container",
      publishId: "reel-publish",
      metaResponses: {
        create: { id: "reel-container" },
        poll: [{ status_code: "IN_PROGRESS" }, { status_code: "FINISHED" }],
        publish: { id: "reel-publish" },
      },
    });
    const persistence = createPersistence();
    const { server, port } = await startApp({ publishContent, persistence });

    const response = await postJson(port, {
      media_type: "REEL",
      media_url: "https://cdn.example.com/reel.mp4",
      caption: "New reel",
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      media_type: "REEL",
      container_id: "reel-container",
      publish_id: "reel-publish",
      status: "published",
    });
    expect(publishContent).toHaveBeenCalledWith({
      mediaType: "REEL",
      mediaUrl: "https://cdn.example.com/reel.mp4",
      caption: "New reel",
    });

    await closeServer(server);
  });

  it("returns 504 when reel polling times out and logs the failure", async () => {
    const persistence = createPersistence();
    const publishContent = vi.fn(async () => {
      const error = new Error("Timed out while waiting for the reel container to finish processing");
      error.statusCode = 504;
      error.stage = "status_poll";
      error.metaResponses = {
        create: { id: "container-timeout" },
        poll: [{ status_code: "IN_PROGRESS" }],
      };
      error.containerId = "container-timeout";
      throw error;
    });

    const { server, port } = await startApp({ publishContent, persistence });
    const response = await postJson(port, {
      media_type: "REEL",
      media_url: "https://cdn.example.com/reel.mp4",
    });

    expect(response.status).toBe(504);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Timed out while waiting for the reel container to finish processing",
      stage: "status_poll",
    });
    expect(persistence.updateLog).toHaveBeenLastCalledWith(
      "log-123",
      expect.objectContaining({
        status: "failed",
        container_id: "container-timeout",
        error_message: "Timed out while waiting for the reel container to finish processing",
      })
    );

    await closeServer(server);
  });

  it("returns 502 when Meta rejects container creation", async () => {
    const publishContent = vi.fn(async () => {
      const error = new Error("Meta container creation failed");
      error.statusCode = 502;
      error.stage = "container_create";
      error.metaResponses = {
        create: {
          error: {
            message: "Invalid image URL",
          },
        },
      };
      throw error;
    });

    const { server, port } = await startApp({ publishContent });
    const response = await postJson(port, {
      media_type: "IMAGE",
      media_url: "https://cdn.example.com/post.jpg",
    });

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Meta container creation failed",
      stage: "container_create",
    });

    await closeServer(server);
  });

  it("still returns success when log persistence fails", async () => {
    const persistence = {
      createLog: vi.fn(async () => {
        throw new Error("db offline");
      }),
      updateLog: vi.fn(async () => {
        throw new Error("db offline");
      }),
    };

    const { server, port } = await startApp({ persistence });
    const response = await postJson(port, {
      media_type: "IMAGE",
      media_url: "https://cdn.example.com/post.jpg",
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      media_type: "IMAGE",
      container_id: "container-123",
      publish_id: "publish-456",
      status: "published",
    });

    await closeServer(server);
  });
});
