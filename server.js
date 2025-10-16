const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

/**
 * Helper function to broadcast message to all connected clients
 */
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data)); // send JSON to everyone
    }
  });
}

wss.on("connection", (socket) => {
  console.log("✅ New client connected");

  // store username on socket instance
  socket.username = null;

  // when client sends message
  socket.on("message", (data) => {
    const message = data.toString();
    const parsed = JSON.parse(message);

    // if it's a "join" event
    if (parsed.type === "join") {
      socket.username = parsed.username;
      console.log(`👋 ${socket.username} joined`);
      broadcast({
        type: "system",
        text: `${socket.username} joined the chat`,
      });
      return;
    }

    // if it's a chat message
    if (parsed.type === "chat") {
      console.log(`💬 ${socket.username}: ${parsed.text}`);
      broadcast({
        type: "chat",
        username: socket.username,
        text: parsed.text,
      });
      return;
    }
  });

  // when client disconnects
  socket.on("close", () => {
    if (socket.username) {
      console.log(`❌ ${socket.username} left`);
      broadcast({
        type: "system",
        text: `${socket.username} left the chat`,
      });
    }
  });
});

server.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
