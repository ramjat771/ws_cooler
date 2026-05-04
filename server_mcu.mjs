import http from "http";
import app from "./app.mjs";
import { PORT } from "./config/env.mjs";
import { mongoConnection } from "./config/db.mjs";
import { attachWSServer } from "./ws/wsServer.mjs";
async function startServer() {
  // Create HTTP server
  const server = http.createServer(app);
  // 🔥 Attach RAW WebSocket to same server
  attachWSServer(server);
  server.listen(PORT, async () => {
    await mongoConnection();
    console.log(`🚀 HTTP Server: http://localhost:${PORT}`);
    console.log(`🔌 RAW WS: ws://localhost:${PORT}/?username=device1`);
  });
}

// 🫀 Global safety
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED PROMISE:", reason);
});

startServer();
