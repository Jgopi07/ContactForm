const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Setup
const cors = require('cors');
app.use(cors());

// ✅ Serve the HTML file first
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Serve static files (CSS, JS, etc.) after the HTML file
app.use(express.static(path.join(__dirname)));

// ✅ Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Endpoint to receive form data
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    const newData = {
        id: uuidv4(),
        name,
        email,
        message,
        date: new Date().toLocaleString()
    };

    fs.readFile('data.json', 'utf8', (err, data) => {
        let jsonData = [];
        if (!err && data) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).json({ success: false, message: 'Error reading data.' });
            }
        }

        jsonData.push(newData);

        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to save data!' });
            }
            res.json({ success: true, message: 'Message sent successfully!' });
        });
    });
});

// ✅ Route to get submitted data (optional)
app.get('/get-data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to read data!' });
        }
        res.json(JSON.parse(data));
    });
});

// ✅ Catch-all route to handle other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
