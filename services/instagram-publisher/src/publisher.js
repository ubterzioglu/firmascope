const GRAPH_API_BASE_URL = "https://graph.facebook.com";

export class InstagramPublishError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "InstagramPublishError";
    this.statusCode = options.statusCode || 500;
    this.stage = options.stage || "unknown";
    this.metaResponses = options.metaResponses || {};
    this.containerId = options.containerId || null;
    this.publishId = options.publishId || null;
  }
}

function assertConfig(config) {
  if (!config?.igUserId || !config?.igAccessToken) {
    throw new InstagramPublishError("Instagram publishing is not configured on the server", {
      statusCode: 500,
      stage: "configuration",
    });
  }
}

function buildFormBody(params) {
  const form = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      form.set(key, String(value));
    }
  }

  return form;
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function callGraphApi(fetchImpl, url, body, stage) {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: buildFormBody(body),
  });

  const json = await parseJsonResponse(response);

  if (!response.ok || json.error) {
    throw new InstagramPublishError(`Meta ${stage.replaceAll("_", " ")} failed`, {
      statusCode: 502,
      stage,
      metaResponses: { [stage]: json },
    });
  }

  return json;
}

async function getGraphJson(fetchImpl, url, stage) {
  const response = await fetchImpl(url, { method: "GET" });
  const json = await parseJsonResponse(response);

  if (!response.ok || json.error) {
    throw new InstagramPublishError(`Meta ${stage.replaceAll("_", " ")} failed`, {
      statusCode: 502,
      stage,
      metaResponses: { [stage]: json },
    });
  }

  return json;
}

function getCreatePayload({ mediaType, mediaUrl, caption, accessToken }) {
  if (mediaType === "IMAGE") {
    return {
      image_url: mediaUrl,
      caption,
      access_token: accessToken,
    };
  }

  return {
    media_type: "REELS",
    video_url: mediaUrl,
    caption,
    access_token: accessToken,
  };
}

async function waitForReelContainer({
  containerId,
  config,
  fetchImpl,
  sleep,
  metaResponses,
}) {
  const pollResponses = [];

  for (let attempt = 1; attempt <= config.reelStatusMaxAttempts; attempt += 1) {
    const statusUrl = new URL(
      `${GRAPH_API_BASE_URL}/${config.graphApiVersion}/${containerId}`
    );
    statusUrl.searchParams.set("fields", "status_code");
    statusUrl.searchParams.set("access_token", config.igAccessToken);

    const pollResponse = await getGraphJson(fetchImpl, statusUrl.toString(), "status_poll");
    pollResponses.push(pollResponse);

    if (pollResponse.status_code === "FINISHED") {
      metaResponses.poll = pollResponses;
      return;
    }

    if (pollResponse.status_code === "ERROR" || pollResponse.status_code === "EXPIRED") {
      metaResponses.poll = pollResponses;
      throw new InstagramPublishError(
        `Reel container processing failed with status ${pollResponse.status_code}`,
        {
          statusCode: 502,
          stage: "status_poll",
          containerId,
          metaResponses,
        }
      );
    }

    if (attempt < config.reelStatusMaxAttempts) {
      await sleep(config.reelStatusPollIntervalMs);
    }
  }

  metaResponses.poll = pollResponses;

  throw new InstagramPublishError(
    "Timed out while waiting for the reel container to finish processing",
    {
      statusCode: 504,
      stage: "status_poll",
      containerId,
      metaResponses,
    }
  );
}

export async function publishContentToInstagram({
  mediaType,
  mediaUrl,
  caption = "",
  config,
  fetchImpl = fetch,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}) {
  assertConfig(config);

  const metaResponses = {};
  const createUrl = `${GRAPH_API_BASE_URL}/${config.graphApiVersion}/${config.igUserId}/media`;
  const createResponse = await callGraphApi(
    fetchImpl,
    createUrl,
    getCreatePayload({
      mediaType,
      mediaUrl,
      caption,
      accessToken: config.igAccessToken,
    }),
    "container_create"
  );

  metaResponses.create = createResponse;
  const containerId = createResponse.id;

  if (!containerId) {
    throw new InstagramPublishError("Meta did not return a container id", {
      statusCode: 502,
      stage: "container_create",
      metaResponses,
    });
  }

  if (mediaType === "REEL") {
    await waitForReelContainer({
      containerId,
      config,
      fetchImpl,
      sleep,
      metaResponses,
    });
  }

  const publishUrl = `${GRAPH_API_BASE_URL}/${config.graphApiVersion}/${config.igUserId}/media_publish`;
  const publishResponse = await callGraphApi(
    fetchImpl,
    publishUrl,
    {
      creation_id: containerId,
      access_token: config.igAccessToken,
    },
    "publish"
  );

  metaResponses.publish = publishResponse;

  return {
    ok: true,
    mediaType,
    containerId,
    publishId: publishResponse.id || null,
    status: "published",
    metaResponses,
  };
}
