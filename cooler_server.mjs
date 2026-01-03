import { WebSocketServer } from "ws";
import { parse } from "url";

const PORT = 3002;

const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WS running on ws://0.0.0.0:${PORT}`);

wss.on("connection", (ws, req) => {
  // 🔥 Parse query params
  const { query } = parse(req.url, true);
  const username = query.username || "unknown";

  ws.username = username;

  console.log("🔌 Connected:", username);

  ws.send(JSON.stringify({
    type: "welcome",
    user: "server",
    message: `Hello ${username}`
  }));

  ws.on("message", (data) => {
    console.log(`📩 ${username}:`, data.toString());

    // broadcast
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          from: username,
          message: data.toString()
        }));
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Disconnected:", username);
  });
});
