document.addEventListener('DOMContentLoaded', () => {

    const model = new AppModel();
    const view = new AppView();
    const controller = new AppController(model, view);

    const user = model.currentUser;

    const protectedPages = ['app.html', 'profile.html'];
    const page = window.location.pathname.split('/').pop();

    //  захист сторінок
    if (protectedPages.includes(page) && !user) {
        window.location.href = 'login.html';
        return;
    }

    if (document.getElementById('hero-action')) {
        controller.initIndex();
    }
});
