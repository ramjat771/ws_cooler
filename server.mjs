import { WebSocketServer } from "ws";

const PORT = 3002;

// 🔓 FULL ACCESS WebSocket server
const wss = new WebSocketServer({
  port: PORT,
  verifyClient: (info, done) => {
    // ✅ Allow EVERYTHING (no CORS, no origin check)
    done(true);
  }
});

console.log(`✅ WebSocket Server running on ws://0.0.0.0:${PORT}`);

wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;
  const origin = req.headers.origin || "NO_ORIGIN";

  console.log("🔌 Client connected");
  console.log("   IP:", ip);
  console.log("   Origin:", origin);

  // Welcome message
  ws.send("HELLO FROM NODE (FULL ACCESS)");

  ws.on("message", (data) => {
    const msg = data.toString();
    console.log("📩 Message:", msg);

    // Echo back
    ws.send(`ECHO: ${msg}`);
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("⚠️ WebSocket error:", err.message);
  });
});
