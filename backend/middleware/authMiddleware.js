import jwt from "jsonwebtoken";
import pool, { isDbReady } from "../config/db.js";

const JWT_SECRET = String(process.env.JWT_SECRET || "plush-brew-local-secret");
process.env.JWT_SECRET = JWT_SECRET;

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token is required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (isDbReady) {
      const [rows] = await pool.query(
        "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
        [decoded.id]
      );

      if (!rows.length) {
        return res.status(401).json({ message: "User session is no longer valid." });
      }

      req.user = rows[0];
      return next();
    }

    req.user = {
      id: decoded.id,
      name: decoded.name || decoded.email?.split("@")[0] || "User",
      email: decoded.email,
      role: decoded.role || "user",
      created_at: decoded.created_at || new Date().toISOString(),
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}
