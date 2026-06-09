import { randomUUID } from "node:crypto";

export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function requestContext(req, res, next) {
  req.requestId = req.get("x-request-id") || randomUUID();
  res.set("x-request-id", req.requestId);
  next();
}

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    code: "NOT_FOUND",
    message: "The requested endpoint does not exist.",
    requestId: req.requestId,
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  const isServerError = status >= 500;

  if (isServerError) {
    console.error(`[${req.requestId}] ${req.method} ${req.originalUrl}`, error);
  }

  res.status(status).json({
    success: false,
    code: error.code || (isServerError ? "INTERNAL_SERVER_ERROR" : "REQUEST_FAILED"),
    message: isServerError ? "Something went wrong. Please try again." : error.message,
    requestId: req.requestId,
  });
}
