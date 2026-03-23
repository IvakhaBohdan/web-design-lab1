document.addEventListener('DOMContentLoaded', () => {
    const app = new AppController(new AppModel(), new AppView());
    
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['app.html', 'profile.html'];
    const isAuth = !!localStorage.getItem('currentUser');

    if (protectedPages.includes(currentPage) && !isAuth) {
        window.location.href = 'login.html';
    }

    // Логіка виходу
    const logoutLinks = document.querySelectorAll('a');
    logoutLinks.forEach(link => {
        if (link.textContent.trim() === 'Вихід') {
            link.onclick = () => localStorage.removeItem('currentUser');
        }
    });
});