// ws/wsServer.mjs
import { WebSocketServer } from "ws";
import { parse } from "url";

const MAX_PAYLOAD = 5 * 1024;       // 5KB (ESP safe)
const HEARTBEAT_INTERVAL = 30000;   // 30 sec

export function attachWSServer(server) {
  const wss = new WebSocketServer({ server });

  console.log("✅ RAW WebSocket attached");

  // -------------------------------
  // SAFE SEND
  // -------------------------------
  function safeSend(ws, obj) {
    try {
      if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(obj));
        return true;
      }
    } catch (e) {
      console.error("❌ send failed:", ws?.username, e.message);
    }
    return false;
  }

  // -------------------------------
  // CHECK TARGET ONLINE
  // -------------------------------
  function isTargetOnline(target) {
    for (const client of wss.clients) {
      if (
        client.readyState === client.OPEN &&
        client.username === target
      ) {
        return true;
      }
    }
    return false;
  }

  // -------------------------------
  // HEARTBEAT (ANTI-ZOMBIE)
  // -------------------------------
  function heartbeat() {
    this.isAlive = true;
  }

  const hbTimer = setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.isAlive === false) {
        console.log("💀 Dead WS killed:", ws.username);
        try { ws.terminate(); } catch {}
        continue;
      }

      ws.isAlive = false;
      try { ws.ping(); } catch {}
    }
  }, HEARTBEAT_INTERVAL);

  wss.on("close", () => clearInterval(hbTimer));

  // -------------------------------
  // CONNECTION
  // -------------------------------
  wss.on("connection", (ws, req) => {
    try {
      const { query } = parse(req.url || "", true);

      const username =
        typeof query.username === "string" && query.username.trim()
          ? query.username.trim()
          : `guest_${Date.now()}`;

      // kill old connection with same username
      for (const client of wss.clients) {
        if (client.username === username && client !== ws) {
          try { client.terminate(); } catch {}
        }
      }

      ws.username = username;
      ws.isAlive = true;

      ws.on("pong", heartbeat);

      console.log("🔌 WS Connected:", username);

      safeSend(ws, {
        type: "welcome",
        username,
        ts: Date.now(),
      });

      // -------------------------------
      // MESSAGE
      // -------------------------------
      ws.on("message", (data) => {
        console.log("meessgae fond ", data)
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

          // keep-alive json ping
          if (payload.type === "ping") {
            safeSend(ws, { type: "pong", ts: Date.now() });
            return;
          }

          const target = payload.target;
          if (typeof target !== "string") return;

          // -------------------------------
          // TARGET OFFLINE
          // -------------------------------
          if (!isTargetOnline(target)) {
            safeSend(ws, {
              type: "nack",
              reason: "TARGET_OFFLINE",
              target,
              ts: Date.now(),
            });
            return;
          }

          // -------------------------------
          // DELIVER MESSAGE
          // -------------------------------
          for (const client of wss.clients) {
            if (
              client.readyState === client.OPEN &&
              client.username === target
            ) {
              const ok = safeSend(client, payload);
              if (!ok) {
                try { client.terminate(); } catch {}
              }
              break;
            }
          }

          // ACK sender
          safeSend(ws, {
            type: "ack",
            target,
            ts: Date.now(),
          });

        } catch (err) {
          console.error("🔥 message crash prevented:", err.message);
        }
      });

      // -------------------------------
      // CLOSE / ERROR
      // -------------------------------
      ws.on("close", () => {
        console.log("❌ WS Disconnected:", username);
      });

      ws.on("error", (err) => {
        console.error("⚠️ WS Error:", username, err.message);
        try { ws.terminate(); } catch {}
      });

    } catch (err) {
      console.error("🔥 Connection crash prevented:", err.message);
      try { ws.close(); } catch {}
    }
  });
}
