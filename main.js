document.addEventListener('DOMContentLoaded', () => {

    const model = new AppModel();
    const view = new AppView();
    new AppController(model, view);

    const user = JSON.parse(localStorage.getItem('currentUser'));

    const protectedPages = ['app.html', 'profile.html'];
    const page = window.location.pathname.split('/').pop();

    if (protectedPages.includes(page) && !user) {
        window.location.href = 'login.html';
    }
});
