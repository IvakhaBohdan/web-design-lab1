class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindDataChanged(() => this.updateView());
        this.updateView();

        this.view.bindEvents({
            // Знайдіть у Controller.js блок register:
        register: (userData) => {
            const result = this.model.registerUser(userData);
            if (result.success) {
                alert('Реєстрація успішна! Тепер увійдіть.');
                window.location.href = 'login.html';
            } else {
                alert('Цей Email вже зареєстровано!');
            }    
            },
            login: (email, password) => {
                if (this.model.loginUser(email, password)) {
                    window.location.href = 'profile.html'; // Перехід на профіль після логіну
                } else {
                    alert('Невірний пароль або email');
                }
            },
            addPost: (t, b) => this.model.addPost(t, b),
            deletePost: (id) => this.model.deletePost(id),
            updateProfile: (data) => this.model.updateUser(data),
            likePost: (id) => this.model.toggleLike(id),      // Додано обробку лайків
            addComment: (id, text) => this.model.addComment(id, text) // Додано обробку коментарів
        });
    }
}
