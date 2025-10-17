WebSocket Chat Application
📖 Overview

This project is a real-time chat application built using Node.js, Express, and WebSocket (ws). It allows multiple clients to connect, send, and receive messages instantly — all without refreshing the page. The project demonstrates how WebSocket enables bidirectional communication between server and client, unlike traditional HTTP requests.

⚙️ Technologies Used

Node.js

Express.js

WebSocket (ws package)

HTML, CSS, JavaScript (Frontend)

🧠 How It Works
Backend Explanation (server.js)
const express = require("express");
// Imports Express — a minimal Node.js web framework to handle HTTP requests and serve static files (our frontend).

const http = require("http");
// We need Node’s built-in HTTP module to create a server.
// WebSocket runs on top of HTTP during its initial handshake.

const WebSocket = require("ws");
// Imports the ws library, the most popular WebSocket server package for Node.js.

const app = express();
// Creates an Express app instance.

const server = http.createServer(app);
// Creates an HTTP server that Express will handle.

const wss = new WebSocket.Server({ server });
// Creates a WebSocket server (wss) attached to the same HTTP server.
// So both HTTP (for web pages) and WS (for real-time messages) share the same port.

app.use(express.static("public"));
// Tells Express to serve any static files (HTML, JS, CSS) from the /public folder.

wss.on("connection", (socket) => {
  console.log("New user connected");
  
  socket.on("message", (data) => {
    console.log("Received:", data);
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  socket.on("close", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));

Frontend Explanation (public/script.js)
const socket = new WebSocket("ws://localhost:3000");
// Creates a new WebSocket connection to your backend.
// ws:// → means “WebSocket protocol.”
// localhost:3000 → the same port your server is running on.

socket.onopen = () => {
  console.log("Connected to server");
};
// Triggered when connection is established.

socket.onmessage = (event) => {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = event.data;
  document.getElementById("messages").appendChild(msgDiv);
};
// Triggered when server sends data. We display it in the chat box.

function sendMessage() {
  const input = document.getElementById("input");
  socket.send(input.value);
  input.value = "";
}
// Sends a text message to the server (which then broadcasts it).

🚀 How to Run

Clone the repository

git clone https://github.com/YOUR_USERNAME/websocket-chat.git


Install dependencies

npm install


Run the server

node server.js


Open your browser at

http://localhost:3000


Open the same URL in another tab to start chatting between two users.

💡 Key Concept

WebSocket provides a persistent connection for full-duplex communication between client and server.

Unlike HTTP, it doesn’t require repeated requests — making it ideal for chat apps, gaming, or real-time dashboards.
