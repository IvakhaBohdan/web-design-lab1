document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація додатку
    const app = new AppController(new AppModel(), new AppView());
    
    // Перевірка авторизації для захищених сторінок
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['app.html', 'profile.html'];
    const user = localStorage.getItem('currentUser');

    if (protectedPages.includes(currentPage) && !user) {
        window.location.href = 'login.html';
    }

    // Обробка кнопки "Вихід"
    const logoutLinks = document.querySelectorAll('a');
    logoutLinks.forEach(link => {
        if (link.textContent.trim() === 'Вихід') {
            link.addEventListener('click', (e) => {
                localStorage.removeItem('currentUser');
                // Після виходу повертаємо на сторінку входу
                window.location.href = 'login.html';
            });
        }
    });
});
