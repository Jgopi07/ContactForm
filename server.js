const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's assigned port

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname)));

// Endpoint to receive form data
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

    // Read existing data
    fs.readFile('data.json', 'utf8', (err, data) => {
        let jsonData = [];
        if (!err) {
            jsonData = JSON.parse(data);
        }

        jsonData.push(newData);

        // Write updated data to file
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to save data!' });
            }
            res.json({ success: true, message: 'Message sent successfully!' });
        });
    });
});

// ✅ Root route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Start server with dynamic port
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
