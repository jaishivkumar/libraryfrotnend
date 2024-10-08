const signupForm = document.getElementById('signup-form');
const loginButton = document.getElementById('login-button');

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const userData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            if (response.ok) {
                alert('Signup successful! You can now log in.');
                loginButton.style.display = 'block'; // Show the login button
            } else {
                // Handle errors returned by the server
                alert(`Signup failed: ${data.message}`);
            }
        } else {
            // Handle non-JSON response
            const text = await response.text();
            console.log('Signup response:', text);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during signup. Please try again.');
    }
});

// Add click event to the login button
loginButton.addEventListener('click', () => {
    window.location.href = 'login.html';
});
