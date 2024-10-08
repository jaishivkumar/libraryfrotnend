document.addEventListener('DOMContentLoaded', () => {
    fetchAvailableBooks();
    fetchBorrowHistory();
    document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);
});

// Function to fetch and display available books
function fetchAvailableBooks() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/api/books/available', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(book => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                    listItem.innerHTML = `
                        ${book.title} by ${book.author}
                        <button class="btn btn-primary btn-sm" onclick="borrowBook(${book.id})">Borrow</button>
                    `;
                    bookList.appendChild(listItem);
                });
            } else {
                bookList.innerHTML = '<li class="list-group-item">No books available at the moment.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching available books:', error);
            alert('Error fetching books. Please try again.');
        });
}

// Function to borrow a book
function borrowBook(bookId) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/api/books/borrow/${bookId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            alert('Book borrowed successfully!');
            fetchAvailableBooks(); // Refresh available books list
            fetchBorrowHistory();  // Refresh borrow history
        })
        .catch(error => {
            console.error('Error borrowing book:', error);
            alert('Failed to borrow the book.');
        });
}

// Function to fetch and display borrow history
function fetchBorrowHistory() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/api/members/history', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(entry => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                    const isReturned = entry.return_date !== null;
                    const returnButton = isReturned
                        ? `<span class="badge bg-success">Returned on: ${new Date(entry.return_date).toLocaleDateString()}</span>`
                        : `<button class="btn btn-success btn-sm" onclick="returnBook(${entry.book_id})" id="return-btn-${entry.book_id}">Return</button>`;

                    listItem.innerHTML = `
                        ${entry.book_title} by ${entry.book_author} 
                        (Borrowed on: ${new Date(entry.borrow_date).toLocaleDateString()})
                        ${returnButton}
                    `;

                    historyList.appendChild(listItem);
                });
            } else {
                historyList.innerHTML = '<li class="list-group-item">No borrow history found.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching borrow history:', error);
            alert('Error fetching history. Please try again.');
        });
}

// Function to return a borrowed book
function returnBook(bookId) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/api/books/return/${bookId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            alert('Book returned successfully!');
            // After returning, fetch available books to update the status
            fetchAvailableBooks(); // Refresh available books list
            fetchBorrowHistory();  // Refresh borrow history
        })
        .catch(error => {
            console.error('Error returning book:', error);
            alert('Failed to return the book.');
        });
}

// Function to delete the member's account
function deleteAccount() {
    const token = localStorage.getItem('token');

    if (confirm('Are you sure you want to delete your account? This action is irreversible.')) {
        fetch('http://localhost:3000/api/members/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                alert('Your account has been deleted.');
                localStorage.removeItem('token');
                window.location.href = 'login.html'; // Redirect to login page after deletion
            })
            .catch(error => {
                console.error('Error deleting account:', error);
                alert('Failed to delete account.');
            });
}


}
const logoutButton = document.getElementById('logout');
console.log(logoutButton) // Make sure the ID matches the button in your HTML
logoutButton.addEventListener('click', () => {
    console.log('hi')
    localStorage.removeItem('token'); 
    window.location.href = 'login.html'; // Redirect to login page after logout
});