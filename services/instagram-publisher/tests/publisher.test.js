import { describe, expect, it, vi } from "vitest";

import { InstagramPublishError, publishContentToInstagram } from "../src/publisher.js";

function createFetchResponse(body, ok = true) {
  return {
    ok,
    async json() {
      return body;
    },
  };
}

describe("publishContentToInstagram", () => {
  it("publishes an image", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(createFetchResponse({ id: "container-1" }))
      .mockResolvedValueOnce(createFetchResponse({ id: "publish-1" }));

    const result = await publishContentToInstagram({
      mediaType: "IMAGE",
      mediaUrl: "https://cdn.example.com/post.jpg",
      caption: "Hello",
      config: {
        igUserId: "1789",
        igAccessToken: "token",
        graphApiVersion: "v19.0",
      },
      fetchImpl,
    });

    expect(result).toEqual({
      ok: true,
      mediaType: "IMAGE",
      containerId: "container-1",
      publishId: "publish-1",
      status: "published",
      metaResponses: {
        create: { id: "container-1" },
        publish: { id: "publish-1" },
      },
    });
    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      "https://graph.facebook.com/v19.0/1789/media",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("publishes a reel after polling status", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(createFetchResponse({ id: "container-2" }))
      .mockResolvedValueOnce(createFetchResponse({ status_code: "IN_PROGRESS" }))
      .mockResolvedValueOnce(createFetchResponse({ status_code: "FINISHED" }))
      .mockResolvedValueOnce(createFetchResponse({ id: "publish-2" }));

    const result = await publishContentToInstagram({
      mediaType: "REEL",
      mediaUrl: "https://cdn.example.com/reel.mp4",
      caption: "Reel",
      config: {
        igUserId: "1789",
        igAccessToken: "token",
        graphApiVersion: "v19.0",
        reelStatusPollIntervalMs: 1,
        reelStatusMaxAttempts: 3,
      },
      fetchImpl,
      sleep: async () => undefined,
    });

    expect(result.publishId).toBe("publish-2");
    expect(result.metaResponses.poll).toEqual([
      { status_code: "IN_PROGRESS" },
      { status_code: "FINISHED" },
    ]);
  });

  it("throws 504 when a reel never becomes ready", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(createFetchResponse({ id: "container-timeout" }))
      .mockResolvedValue(createFetchResponse({ status_code: "IN_PROGRESS" }));

    await expect(
      publishContentToInstagram({
        mediaType: "REEL",
        mediaUrl: "https://cdn.example.com/reel.mp4",
        config: {
          igUserId: "1789",
          igAccessToken: "token",
          graphApiVersion: "v19.0",
          reelStatusPollIntervalMs: 1,
          reelStatusMaxAttempts: 2,
        },
        fetchImpl,
        sleep: async () => undefined,
      })
    ).rejects.toMatchObject({
      statusCode: 504,
      stage: "status_poll",
      containerId: "container-timeout",
    });
  });

  it("throws 502 when Meta returns an API error", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(
      createFetchResponse(
        {
          error: {
            message: "Invalid URL",
          },
        },
        false
      )
    );

    await expect(
      publishContentToInstagram({
        mediaType: "IMAGE",
        mediaUrl: "https://cdn.example.com/post.jpg",
        config: {
          igUserId: "1789",
          igAccessToken: "token",
          graphApiVersion: "v19.0",
        },
        fetchImpl,
      })
    ).rejects.toBeInstanceOf(InstagramPublishError);
  });
});
