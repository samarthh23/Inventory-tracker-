// Authentication helper functions
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

function getAuthHeaders() {
    return {
        'Authorization': 'authenticated'
    };
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<p class="loading">Loading...</p>';
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<p class="error">${message}</p>`;
    }
}