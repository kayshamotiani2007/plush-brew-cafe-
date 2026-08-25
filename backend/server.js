import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import path from "path";
import { Server as SocketIOServer } from "socket.io";
import { ensureUsersTable } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import { setSocketServer } from "./services/realtime.js";

dotenv.config({ path: new URL("./.env", import.meta.url) });

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" },
});

setSocketServer(io);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", businessRoutes);
app.use("/api/community", communityRoutes);

io.on("connection", (socket) => {
  socket.emit("connected", { ok: true });
});

ensureUsersTable()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Plush Brew backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize MySQL tables:", error);
    process.exit(1);
  });
