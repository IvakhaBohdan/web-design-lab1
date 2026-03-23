class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindDataChanged(() => this.updateView());
        this.updateView();

        this.view.bindEvents({
            register: (userData) => {
                const res = this.model.registerUser(userData);
                if (res.success) {
                    // Зберігаємо як поточного і йдемо в профіль
                    this.model.loginUser(userData.email, userData.password);
                    window.location.href = 'profile.html';
                } else {
                    alert('Помилка реєстрації або користувач вже існує');
                }
            },
            login: (email, password) => {
                if (this.model.loginUser(email, password)) {
                    window.location.href = 'app.html';
                } else {
                    alert('Невірний пароль або email');
                }
            },
            addPost: (t, b) => this.model.addPost(t, b),
            deletePost: (id) => this.model.deletePost(id),
            updateProfile: (data) => this.model.updateUser(data)
        });
    }

    updateView() {
        const user = this.model.currentUser;
        if (this.view.postsContainer) {
            this.view.displayPosts(this.model.posts, user ? user.email : null);
        }
        if (user && this.view.profileName) {
            const count = this.model.posts.filter(p => p.author === user.name).length;
            this.view.displayUserProfile(user, count);
        }
    }
}
