const form = document.getElementById('contactForm');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ✅ Get form values
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
    };

    // ✅ Client-side validation
    if (!formData.name || !formData.email || !formData.message) {
        showMessage('All fields are required!', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Invalid email format!', 'error');
        return;
    }

    try {
        // ✅ Send form data to backend
        const res = await fetch('http://localhost:3000/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
            showMessage('Message sent successfully!', 'success');
            form.reset(); // ✅ Reset form after submission
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Something went wrong. Please try again.', 'error');
    }
});

// ✅ Function to display success message
function showMessage(message, type) {
    responseMessage.textContent = message;
    responseMessage.style.color = type === 'success' ? '#4caf50' : '#ff4d4d';
    responseMessage.style.opacity = '1';

    // ✅ Disappear after 10 seconds
    setTimeout(() => {
        responseMessage.style.opacity = '0';
        responseMessage.textContent = '';
    }, 10000);
}
