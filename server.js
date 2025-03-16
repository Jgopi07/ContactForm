const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's assigned port

// ✅ Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup to allow cross-origin requests
app.use(cors());

// ✅ Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname)));

// ✅ Endpoint to receive form data
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    // ✅ Validate input data
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

    // ✅ Read existing data from 'data.json'
    fs.readFile('data.json', 'utf8', (err, data) => {
        let jsonData = [];
        if (!err && data) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return res.status(500).json({ success: false, message: 'Error reading data.' });
            }
        }

        // ✅ Add new data
        jsonData.push(newData);

        // ✅ Write updated data to 'data.json'
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error saving data:', err);
                return res.status(500).json({ success: false, message: 'Failed to save data!' });
            }
            console.log('✅ New form submission:', newData);
            res.json({ success: true, message: 'Message sent successfully!' });
        });
    });
});

// ✅ Root route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Route to retrieve submitted data (Optional - For testing)
app.get('/get-data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ success: false, message: 'Failed to read data!' });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ success: false, message: 'Error processing data!' });
        }
    });
});

// ✅ Start server with dynamic port
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
