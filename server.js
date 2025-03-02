const express = require("express");
const fs = require("fs");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New user connected");

  let messages = fs.readFileSync("./data/messages.txt", "utf-8").split("\n").filter(m => m);
  messages.forEach((msg) => socket.emit("message", msg));

  socket.on("message", (msg) => {
    fs.appendFileSync("./data/messages.txt", msg + "\n");
    io.emit("message", msg);
  });
});

server.listen(PORT, () => console.log(`Chat live at http://localhost:${PORT}`));
