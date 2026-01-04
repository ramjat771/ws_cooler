// ws/wsServer.mjs
import { WebSocketServer } from "ws";
import { parse } from "url";

const MAX_PAYLOAD = 5 * 1024; // 5KB (ESP safe)

export function attachWSServer(server) {
  const wss = new WebSocketServer({ server });

  console.log("✅ RAW WebSocket attached");

  function safeSend(ws, obj) {
    try {
      if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(obj));
      }
    } catch (e) {
      console.error("❌ safeSend error:", e.message);
    }
  }

  wss.on("connection", (ws, req) => {
    try {
      const { query } = parse(req.url || "", true);

      const username =
        typeof query.username === "string" && query.username.trim()
          ? query.username.trim()
          : `guest_${Date.now()}`;

      ws.username = username;

      console.log("🔌 WS Connected:", username);

      safeSend(ws, {
        type: "welcome",
        username,
      });

      ws.on("message", (data) => {
        try {
          if (!data || data.length === 0) return;

          if (data.length > MAX_PAYLOAD) {
            safeSend(ws, {
              type: "error",
              reason: "PAYLOAD_TOO_LARGE",
            });
            return;
          }

          let payload;
          try {
            payload = JSON.parse(data.toString());
          } catch {
            console.warn("⚠️ Invalid JSON from", username);
            return;
          }

          if (!payload || typeof payload !== "object") return;

          const target = payload.target;
          if (typeof target !== "string") return;

          let delivered = false;

          for (const client of wss.clients) {
            if (
              client.readyState === client.OPEN &&
              client.username === target
            ) {
              safeSend(client, payload);
              delivered = true;
              break;
            }
          }

          if (delivered) {
            safeSend(ws, {
              type: "ack",
              target,
            });
          }

        } catch (err) {
          console.error("🔥 message crash prevented:", err.message);
        }
      });

      ws.on("close", () => {
        console.log("❌ WS Disconnected:", username);
      });

      ws.on("error", (err) => {
        console.error("⚠️ WS Error:", username, err.message);
        try { ws.close(); } catch {}
      });

    } catch (err) {
      console.error("🔥 Connection crash prevented:", err.message);
      try { ws.close(); } catch {}
    }
  });
}
