document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        if (!formData.name || !formData.email || !formData.message) {
            displayMessage('Please fill in all fields.', '#ff4d4d'); // Red color for errors
            return;
        }

        try {
            // Send data to backend
            const response = await fetch('https://contactform-eo4i.onrender.com/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage('Message sent successfully!', '#4caf50'); // Green color for success

                // Reset the form
                form.reset();
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Something went wrong. Please try again.', '#ff4d4d');
        }
    });

    // Function to display success/error message
    function displayMessage(message, color) {
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.textContent = message;
        responseMessage.style.color = color;
        responseMessage.style.opacity = 1;

        // Hide message after 10 seconds
        setTimeout(() => {
            responseMessage.style.opacity = 0;
        }, 10000);
    }
});
