import { WebSocketServer } from "ws";

const PORT = 3002;

// 🔓 FULL ACCESS WebSocket server
const wss = new WebSocketServer({
  port: PORT,
  verifyClient: (info, done) => done(true)
});

console.log(`✅ WebSocket Server running on ws://0.0.0.0:${PORT}`);

wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log("🔌 Client connected:", ip);

  // Welcome message (optional)
  ws.send("HELLO FROM NODE (BROADCAST SERVER)");

  ws.on("message", (data) => {
    const msg = data.toString();
    console.log("📩 From client:", msg);

    // 🔥 BROADCAST TO ALL CONNECTED CLIENTS
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected:", ip);
  });

  ws.on("error", (err) => {
    console.error("⚠️ WebSocket error:", err.message);
  });
});
