import { WebSocketServer } from "ws";
import { parse } from "url";

const PORT = 3002;
const MAX_PAYLOAD = 5 * 1024; // 5KB (ESP safe)

const wss = new WebSocketServer({
  port: PORT,
  clientTracking: true
});

console.log(`✅ WS running on ws://0.0.0.0:${PORT}`);

// --------------------------------------------------
// 🔒 SAFE SEND (never crashes)
// --------------------------------------------------
function safeSend(ws, obj) {
  try {
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(obj));
    }
  } catch (e) {
    console.error("❌ safeSend error:", e.message);
  }
}

// --------------------------------------------------
// 🔌 CONNECTION
// --------------------------------------------------
wss.on("connection", (ws, req) => {
  try {
    const { query } = parse(req.url || "", true);
    const username =
      typeof query.username === "string" && query.username.trim()
        ? query.username.trim()
        : `guest_${Date.now()}`;

    ws.username = username;
    ws.isAlive = true;

    console.log("🔌 Connected:", username);

    safeSend(ws, {
      type: "welcome",
      username
    });

    // --------------------------------------------------
    // 📩 MESSAGE (ANYTHING FROM ESP)
    // --------------------------------------------------
    ws.on("message", (data) => {
      try {
        // ❌ binary / empty / undefined
        if (!data || data.length === 0) return;

        // ❌ too large
        if (data.length > MAX_PAYLOAD) {
          safeSend(ws, {
            type: "error",
            reason: "PAYLOAD_TOO_LARGE"
          });
          return;
        }

        let payload;

        // ❌ not JSON → ignore silently
        try {
          payload = JSON.parse(data.toString());
        } catch {
          console.warn("⚠️ Invalid JSON from", ws.username);
          return;
        }

        // ❌ not object
        if (typeof payload !== "object" || payload === null) return;

        const target = payload.target;

        // ❌ no target → ignore
        if (typeof target !== "string") return;

        let delivered = false;

        for (const client of wss.clients) {
          try {
            if (
              client.readyState === client.OPEN &&
              client.username === target
            ) {
              safeSend(client, payload);
              delivered = true;
              break;
            }
          } catch (e) {
            console.error("⚠️ Client loop error:", e.message);
          }
        }

        if (delivered) {
          safeSend(ws, {
            type: "ack",
            target
          });
        }

      } catch (err) {
        console.error("🔥 message handler crash prevented:", err.message);
      }
    });

    // --------------------------------------------------
    // ❌ SOCKET ERROR
    // --------------------------------------------------
    ws.on("error", (err) => {
      console.error("⚠️ Socket error:", username, err.message);
      try { ws.close(); } catch {}
    });

    // --------------------------------------------------
    // ❌ DISCONNECT
    // --------------------------------------------------
    ws.on("close", () => {
      console.log("❌ Disconnected:", username);
    });

  } catch (err) {
    console.error("🔥 Connection crash prevented:", err.message);
    try { ws.close(); } catch {}
  }
});

// --------------------------------------------------
// 🫀 GLOBAL SAFETY NET (VERY IMPORTANT)
// --------------------------------------------------
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION (SERVER STILL RUNNING):", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED PROMISE (SERVER STILL RUNNING):", reason);
});
