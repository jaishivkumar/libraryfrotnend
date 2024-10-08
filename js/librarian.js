document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('add-book-form');
    const editBookForm = document.getElementById('edit-book-form');
    const booksTableBody = document.getElementById('books-list');
    const logoutButton = document.getElementById('logout');
    let selectedBookId = null;  // Used for tracking the book being edited

    // Function to get the token
    const getToken = () => localStorage.getItem('token');

    // Add a new book
    addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const token = getToken(); // Retrieve the token


        try {
            const response = await fetch('http://localhost:3000/api/books/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add token to headers
                },
                body: JSON.stringify({ title, author }),
            });
            const result = await response.json();
            alert(result.message);
            addBookForm.reset();
            loadBooks(); // Refresh the book list
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Error adding book');
        }
    });

    // Load all books into the table
    const loadBooks = async () => {
        const token = getToken(); // Retrieve the token
        try {
            const response = await fetch('http://localhost:3000/api/books/viewbooks', {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to headers
                }
            });
            const books = await response.json();
            console.log(books);
            booksTableBody.innerHTML = books?.map(book => `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                  
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="showEditModal(${book.id}, '${book.title}', '${book.author}', '${book.genre}', ${book.published_year})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching books:', error);
            alert('Error fetching books');
        }
    };

    // Show the Edit Book Modal
    window.showEditModal = (id, title, author) => {
        selectedBookId = id;
        document.getElementById('edit-title').value = title;
        document.getElementById('edit-author').value = author;
        $('#editBookModal').modal('show'); // Show the modal using Bootstrap
    };

    // Edit book submission
    editBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-title').value;
        const author = document.getElementById('edit-author').value;

        const token = getToken(); // Retrieve the token

        try {
            const response = await fetch(`http://localhost:3000/api/books/update/${selectedBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add token to headers
                },
                body: JSON.stringify({ title, author }),
            });
            const result = await response.json();
            alert(result.message);
            $('#editBookModal').modal('hide'); // Hide the modal
            loadBooks(); // Refresh the book list
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Error updating book');
        }
    });

    // Delete a book with confirmation
    window.deleteBook = (id) => {
        if (confirm('Are you sure you want to delete this book?')) {
            const token = getToken(); // Retrieve the token
            fetch(`http://localhost:3000/api/books/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to headers
                }
            }).then(response => response.json())
                .then(result => {
                    alert(result.message);
                    loadBooks(); // Refresh the book list
                })
                .catch(error => {
                    console.error('Error deleting book:', error);
                    alert('Error deleting book');
                });
        }
    };

    // Logout button
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = './login.html';
    });


    loadBooks();
});
