const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML files)
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read users from the JSON file
const readUsersFromFile = () => {
  const data = fs.readFileSync('users.json', 'utf8');
  return JSON.parse(data || '[]');
};

// Helper function to save users to the JSON file
const saveUsersToFile = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Route to handle registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Read existing users
  const users = readUsersFromFile();

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send('Username already exists!');
  }

  // Add the new user to the list
  users.push({ username, password });

  // Save the updated users to the file
  saveUsersToFile(users);

  res.send('Registration successful!');
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read existing users
  const users = readUsersFromFile();

  // Find the user
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).send('Invalid credentials!');
  }

  res.send('Login successful!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
