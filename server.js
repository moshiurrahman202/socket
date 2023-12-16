// const http = require("http");
// const { Server } = require("socket.io");

// const server = http.createServer();
// const io = new Server(server);

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("message", (msg) => {
//     console.log(`Message: ${msg}`);

//     io.emit("message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const server = http.createServer((req, res) => {
  // Serve the Socket.IO client library
  if (req.url.includes("/socket.io/")) {
    const filePath = path.join(__dirname, req.url);
    fs.createReadStream(filePath).pipe(res);
    console.log(path.__dirname);
  } else {
    // Serve your HTML file
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, "utf-8", (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  }
});

const io = new Server(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages
  socket.on("message", (msg) => {
    console.log(`Message: ${msg}`);

    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  // Handle disconnection event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
