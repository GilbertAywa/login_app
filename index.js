const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// Load users from JSON file
const loadUsers = () => {
    const data = fs.readFileSync(path.join(__dirname, 'database', 'users.json'));
    return JSON.parse(data);
};

// Save users to JSON file
const saveUsers = (users) => {
    fs.writeFileSync(path.join(__dirname, 'database', 'users.json'), JSON.stringify(users, null, 2));
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    // Check if user already exists
    if (users.find(user => user.username === username)) {
        return res.send('<h1 style="color: orange; text-align: center";>User already exists. Please <a href="/">login.</a><h1>');
    }

    // Add new user
    users.push({ username, password });
    saveUsers(users);
    res.send('<h1 style="color: #00ff00; text-align: center;">Registration successful! Please Please <a href="/">login.</a></h1>');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    // Check for valid user
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return res.sendFile(path.join(__dirname, 'views', 'home.html'));
    } else {
        return res.send('<h1 style="color: red; text-align: center;">Invalid username or password.</h1>');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});