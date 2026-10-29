
export function notFound(req, res) {
  res.status(404).json({ message: "API route not found" });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.statusCode || 500;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    message: status >= 500 ? "Internal server error" : error.message,
  });
}
