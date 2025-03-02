const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

const JSON_BIN_API = "https://api.jsonbin.io/v3/b/"; // Free storage
const BIN_ID = "67c49e06e41b4d34e49f8514 "; // I'll tell you how to get this 👇
const SECRET_KEY = "$2a$10$i7tVoPiLHzjO3bT3En4JZOunPf75qkN3qsv4CxtOBKHOHwzR92R1m";

app.use(express.static("public"));

io.on("connection", async (socket) => {
  console.log("User connected");

  let { data } = await axios.get(`${JSON_BIN_API}${BIN_ID}`, {
    headers: { "X-Master-Key": SECRET_KEY },
  });

  data.record.forEach((msg) => socket.emit("message", msg));

  socket.on("message", async (msg) => {
    data.record.push(msg);
    await axios.put(`${JSON_BIN_API}${BIN_ID}`, { record: data.record }, {
      headers: { "X-Master-Key": SECRET_KEY },
    });
    io.emit("message", msg);
  });
});

server.listen(PORT, () =>
  console.log(`Chat live at http://localhost:${PORT}`)
);
