import express from "express";

import { getConfig } from "./config.js";
import { publishContentToInstagram } from "./publisher.js";
import * as supabasePersistence from "./supabase.js";

function getBearerToken(headerValue) {
  if (!headerValue?.startsWith("Bearer ")) {
    return "";
  }

  return headerValue.slice("Bearer ".length).trim();
}

function isPublicHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateRequest(body) {
  const errors = {};

  if (body.media_type !== "IMAGE" && body.media_type !== "REEL") {
    errors.media_type = "media_type must be IMAGE or REEL";
  }

  if (!isPublicHttpsUrl(body.media_url)) {
    errors.media_url = "media_url must be a valid public https URL";
  }

  if (body.caption !== undefined && typeof body.caption !== "string") {
    errors.caption = "caption must be a string";
  }

  return errors;
}

async function safeCreateLog(persistence, payload, logger) {
  try {
    return await persistence.createLog(payload);
  } catch (error) {
    logger.error("Failed to create instagram publish log", error);
    return null;
  }
}

async function safeUpdateLog(persistence, id, payload, logger) {
  if (!id) {
    return;
  }

  try {
    await persistence.updateLog(id, payload);
  } catch (error) {
    logger.error("Failed to update instagram publish log", error);
  }
}

function toResponseError(error) {
  return {
    statusCode: error.statusCode || 500,
    body: {
      ok: false,
      error: error.message || "Unexpected server error",
      ...(error.stage ? { stage: error.stage } : {}),
    },
  };
}

export function createApp({
  config = getConfig(),
  publishContent = (payload) => publishContentToInstagram({ ...payload, config }),
  persistence = supabasePersistence,
  logger = console,
} = {}) {
  const app = express();

  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/instagram/post", async (req, res) => {
    const token = getBearerToken(req.headers.authorization);

    if (!config.openClawApiToken || token !== config.openClawApiToken) {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized",
      });
    }

    const validationErrors = validateRequest(req.body || {});
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        ok: false,
        error: "Invalid request body",
        details: validationErrors,
      });
    }

    const requestPayload = {
      media_type: req.body.media_type,
      media_url: req.body.media_url,
      caption: req.body.caption ?? "",
    };

    const logId = await safeCreateLog(
      persistence,
      {
        source: "instagram",
        request_media_type: requestPayload.media_type,
        request_media_url: requestPayload.media_url,
        caption: requestPayload.caption,
        status: "received",
        request_payload: requestPayload,
        meta_responses: {},
        error_message: null,
      },
      logger
    );

    try {
      const result = await publishContent({
        mediaType: requestPayload.media_type,
        mediaUrl: requestPayload.media_url,
        caption: requestPayload.caption,
      });

      await safeUpdateLog(
        persistence,
        logId,
        {
          status: "published",
          container_id: result.containerId,
          publish_id: result.publishId,
          meta_responses: result.metaResponses,
          error_message: null,
        },
        logger
      );

      return res.status(200).json({
        ok: true,
        media_type: result.mediaType,
        container_id: result.containerId,
        publish_id: result.publishId,
        status: result.status,
      });
    } catch (error) {
      await safeUpdateLog(
        persistence,
        logId,
        {
          status: "failed",
          container_id: error.containerId || null,
          publish_id: error.publishId || null,
          meta_responses: error.metaResponses || {},
          error_message: error.message || "Unexpected server error",
        },
        logger
      );

      const responseError = toResponseError(error);
      return res.status(responseError.statusCode).json(responseError.body);
    }
  });

  return app;
}
