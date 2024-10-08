// Function to handle adding a member
document.getElementById('add-member-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const token = localStorage.getItem('token'); // Retrieve token

    fetch('http://localhost:3000/api/members/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.message || 'Member added successfully!');
            fetchMembers();
            document.getElementById('add-member-form').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add member. Please try again.');
        });
});



// Function to fetch and display members
function fetchMembers() {
    const token = localStorage.getItem('token'); // Retrieve token

    fetch('http://localhost:3000/api/members/list', {
        headers: {
            'Authorization': `Bearer ${token}` // Add token here
        }
    })
        .then(response => response.json())
        .then(data => {
            const membersList = document.getElementById('members-list');
            membersList.innerHTML = ''; // Clear previous list

            if (data.length > 0) {
                data.forEach(member => {
                    membersList.innerHTML += `
                    <tr>
                        <td>${member.id}</td>
                        <td>${member.username}</td>
                        <td>${member.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="viewHistory(${member.id})">View History</button>
                             <button class="btn btn-sm btn-warning" onclick="openEditModal(${member.id}, '${member.username}', '${member.status}')">Edit</button>
                       
                            <button class="btn btn-sm btn-danger" onclick="deleteMember(${member.id})">Delete</button>
                        </td>
                    </tr>
                `;
                });
            } else {
                membersList.innerHTML = '<tr><td colspan="4">No members found.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to retrieve members. Please try again.');
        });
}

// Automatically fetch members when the page loads
document.addEventListener('DOMContentLoaded', fetchMembers);



// Function to open the edit modal and populate fields
function openEditModal(memberId, username, status) {
    document.getElementById('editMemberId').value = memberId;
    document.getElementById('editUsername').value = username;
    document.getElementById('editStatus').value = status;

    // Show the modal using Bootstrap's JavaScript API
    const editModal = new bootstrap.Modal(document.getElementById('editMemberModal'));
    editModal.show();
}

// Function to handle updating member details
document.getElementById('editMemberForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting normally

    const memberId = document.getElementById('editMemberId').value;
    const username = document.getElementById('editUsername').value;
    const password = document.getElementById('editPassword').value;
    const status = document.getElementById('editStatus').value;

    const token = localStorage.getItem('token');
    const updateData = {
        username: username,
        status: status
    };

    // Only add password if it has been updated
    if (password) {
        updateData.password = password;
    }

    fetch(`http://localhost:3000/api/members/update/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Member updated successfully');
            fetchMembers(); // Refresh members list
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editMemberModal'));
            editModal.hide(); // Hide the modal
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update member.');
        });
});


// Function to handle deleting a member
function deleteMember(memberId) {
    if (!confirm('Are you sure you want to delete this member?')) return;

    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/members/delete/${memberId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            alert('Member deleted successfully');
            fetchMembers();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete member.');
        });
}

// Function to handle viewing a member's history
function viewHistory(memberId) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/members/history/${memberId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(history => {
            let historyMessage = 'History:\n';
            history.forEach(entry => {
                historyMessage += `Book: ${entry.book_id}, Borrowed: ${new Date(entry.borrow_date).toLocaleDateString()}, Returned: ${entry.return_date ? new Date(entry.return_date).toLocaleDateString() : 'Not returned yet'}\n`;
            });
            alert(historyMessage);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to retrieve member history.');
        });
}




// Function to handle borrowing a book
document.getElementById('borrow-book-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const bookId = document.getElementById('borrow-book-id').value;
    const token = localStorage.getItem('authToken'); // Retrieve token

    fetch(`http://localhost:3000/api/borrow/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add token here
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.message || 'Book borrowed successfully!');
            document.getElementById('borrow-book-form').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to borrow book. Please try again.');
        });
});

// Function to handle returning a book
document.getElementById('return-book-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const bookId = document.getElementById('return-book-id').value;
    const token = localStorage.getItem('authToken'); // Retrieve token

    fetch(`http://localhost:3000/api/return/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add token here
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.message || 'Book returned successfully!');
            document.getElementById('return-book-form').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to return book. Please try again.');
        });
});

// Function to handle viewing borrowing history
document.getElementById('view-history')?.addEventListener('click', function () {
    const token = localStorage.getItem('authToken'); // Retrieve token

    fetch('http://localhost:3000/api/history', {
        headers: {
            'Authorization': `Bearer ${token}` // Add token here
        }
    })
        .then(response => response.json())
        .then(data => {
            const historyList = document.getElementById('history-list');
            historyList.innerHTML = ''; // Clear previous history
            if (data.length > 0) {
                data.forEach(entry => {
                    historyList.innerHTML += `<div class="border p-2">Book ID: ${entry.bookId}, Action: ${entry.action}, Date: ${entry.date}</div>`;
                });
            } else {
                historyList.innerHTML = '<p>No borrowing history found.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to retrieve borrowing history. Please try again.');
        });
});

// Function to handle account deletion
document.getElementById('delete-account')?.addEventListener('click', function () {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const token = localStorage.getItem('authToken'); // Retrieve token

        fetch('http://localhost:3000/api/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add token here
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert(data.message || 'Account deleted successfully!');
             
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete account. Please try again.');
            });
    }

  
});

const logoutButton = document.getElementById('logout');
console.log(logoutButton) // Make sure the ID matches the button in your HTML
logoutButton.addEventListener('click', () => {
    console.log('hi')
    localStorage.removeItem('token'); 
    window.location.href = 'login.html'; // Redirect to login page after logout
});