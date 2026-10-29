
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Please log in to continue");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof payload.sub !== "string") {
      throw new ApiError(401, "Invalid authentication token");
    }

    req.userId = payload.sub;
    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(401, "Invalid or expired token")
    );
  }
}
