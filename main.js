document.addEventListener('DOMContentLoaded', () => {

    const app = new AppController(new AppModel(), new AppView());

    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['app.html', 'profile.html'];

    const user = JSON.parse(localStorage.getItem('currentUser'));

    // 🔐 захист сторінок
    if (protectedPages.includes(currentPage) && !user) {
        window.location.href = 'login.html';
    }

    // 🚪 logout
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
});
