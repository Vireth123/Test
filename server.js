const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

const JSON_BIN_API = "https://api.jsonbin.io/v3/b/"; // Free storage
const BIN_ID = "67c49e06e41b4d34e49f8514"; // Your Bin ID
const SECRET_KEY = "YOUR_API_KEY"; // Your API key

app.use(express.static("public"));

// New route to show messages
app.get("/messages", async (req, res) => {
  try {
    // Get the messages from JSON Bin
    let { data } = await axios.get(`${JSON_BIN_API}${BIN_ID}`, {
      headers: { "X-Master-Key": SECRET_KEY },
    });

    // Generate a simple HTML page to display the messages
    let messagesHtml = `
    <head>
    <link rel="stylesheet" type="text/css" href="/style.css">
  </head>
  <h1>Chat Messages</h1><ul>`;

    
    // Send the HTML response
    res.send(messagesHtml);
  } catch (error) {
    res.status(500).send("Error retrieving messages.");
  }
});

io.on("connection", async (socket) => {
  console.log("User connected");

  let { data } = await axios.get(`${JSON_BIN_API}${BIN_ID}`, {
    headers: { "X-Master-Key": SECRET_KEY },
  });

  // Send stored messages to the new user
  data.record.forEach((msg) => socket.emit("message", msg));

  socket.on("message", async (msg) => {
    // Push new message to the JSON Bin
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
