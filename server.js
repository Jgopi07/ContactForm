const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const dataFile = 'data.json';

// ✅ Load existing data
let formData = [];
if (fs.existsSync(dataFile)) {
    const fileData = fs.readFileSync(dataFile, 'utf-8');
    try {
        formData = JSON.parse(fileData);
    } catch (error) {
        console.error('Error reading data file:', error);
    }
}

// ✅ Endpoint to receive and save form data
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // ✅ Create new entry with timestamp
    const newEntry = {
        id: uuidv4(),
        name,
        email,
        message,
        dateTime: new Date().toLocaleString() // ✅ Add current date and time
    };

    formData.push(newEntry);

    try {
        // ✅ Write updated data to file
        fs.writeFileSync(dataFile, JSON.stringify(formData, null, 2));

        console.log('\n✅ New Data Received:');
        console.table([newEntry]); // ✅ Show new data in table format

        console.log('\n✅ Updated Data List:');
        console.table(formData); // ✅ Show all data in table format

        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error writing data:', error);
        res.status(500).json({ success: false, message: 'Failed to save data.' });
    }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
