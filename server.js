const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

const JSON_BIN_API = "https://api.jsonbin.io/v3/b/";
const BIN_ID = "67c49e06e41b4d34e49f8514"; // Replace with your actual Bin ID
const SECRET_KEY = "YOUR_API_KEY"; // Replace with your actual API Key

app.use(express.static("public"));

io.on("connection", async (socket) => {
    console.log("User connected");

    // Get existing messages from JSON Bin and send to new user
    let { data } = await axios.get(`${JSON_BIN_API}${BIN_ID}`, {
        headers: { "X-Master-Key": SECRET_KEY },
    });

    data.record.forEach((msg) => socket.emit("message", msg));

    // Listen for new messages from users
    socket.on("message", async (msg) => {
        data.record.push(msg);

        // Save the new message to JSON Bin
        await axios.put(`${JSON_BIN_API}${BIN_ID}`, { record: data.record }, {
            headers: { "X-Master-Key": SECRET_KEY },
        });

        // Broadcast the message to all connected clients
        io.emit("message", msg);
    });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
