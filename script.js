document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('https://contactform-eo4i.onrender.com/submit-form', { // Use correct backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            const responseMessage = document.getElementById('responseMessage');
            responseMessage.textContent = 'Message sent successfully!';
            responseMessage.style.color = '#4caf50';
            responseMessage.style.opacity = 1;

            // Clear the form after submission
            document.getElementById('contactForm').reset();

            // Hide success message after 10 seconds
            setTimeout(() => {
                responseMessage.style.opacity = 0;
            }, 10000);
        } else {
            throw new Error(data.message || 'Something went wrong');
        }
    } catch (error) {
        console.error('Error:', error);

        // Show error message
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.textContent = 'Something went wrong. Please try again.';
        responseMessage.style.color = '#ff4d4d';
        responseMessage.style.opacity = 1;

        // Hide error message after 10 seconds
        setTimeout(() => {
            responseMessage.style.opacity = 0;
        }, 10000);
    }
});
