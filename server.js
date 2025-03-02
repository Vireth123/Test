const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/save", (req, res) => {
  let message = req.body.message;
  fs.appendFileSync("./data/messages.txt", message + "\n");
  res.send({ status: "ok" });
});

app.get("/messages", (req, res) => {
  let messages = fs.readFileSync("./data/messages.txt", "utf-8").split("\n").filter(m => m);
  res.json(messages);
});

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
