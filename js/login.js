document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    // Send the login request to the backend API
    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);

                // Redirect based on role
                if (data.role === 'LIBRARIAN') {
                    console.log(data.role)
                    window.location.href = 'librarian.html';
                    // Redirect to the Librarian dashboard
                } else if (data.role === 'MEMBER') {
                    window.location.href = 'member-board.html'; 
                } else {
                    alert('Unknown role. Please contact support.');
                }
            } else {
                alert('Invalid login');
            }
        })
        .catch(error => console.error('Error:', error));
});
