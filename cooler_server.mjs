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

  // ✅ Welcome
  ws.send(JSON.stringify({
    type: "welcome",
    status: "ok",
    message: `Hello ${username}`
  }));

  ws.on("message", (data) => {
    let payload;

    try {
      payload = JSON.parse(data.toString());
    } catch (err) {
      ws.send(JSON.stringify({
        type: "error",
        reason: "INVALID_JSON",
        message: "Invalid JSON format"
      }));
      return;
    }

    console.log(`📩 From ${username}:`, payload);

    const targetUser = payload.target;

    // ❌ TARGET MISSING
    if (!targetUser) {
      ws.send(JSON.stringify({
        type: "error",
        reason: "TARGET_MISSING",
        message: "target field is required"
      }));
      return;
    }

    let sent = false;

    // 🎯 SEND ONLY TO TARGET USER
    wss.clients.forEach((client) => {
      if (
        client.readyState === client.OPEN &&
        client.username === targetUser
      ) {
        client.send(JSON.stringify(payload));
        sent = true;
      }
    });

    // ❌ TARGET NOT ONLINE
    if (!sent) {
      ws.send(JSON.stringify({
        type: "error",
        reason: "TARGET_OFFLINE",
        target: targetUser,
        message: `User ${targetUser} is not connected`
      }));
      console.log(`⚠️ Target user not connected: ${targetUser}`);
      return;
    }

    // ✅ SUCCESS ACK (optional but recommended)
    ws.send(JSON.stringify({
      type: "ack",
      status: "sent",
      target: targetUser
    }));
  });

  ws.on("close", () => {
    console.log("❌ Disconnected:", username);
  });
});
