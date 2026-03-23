class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Підписка на оновлення даних
        this.model.bindDataChanged(() => this.updateView());
        
        // Первинне відображення
        this.updateView();

        // Налаштування подій
        this.view.bindEvents({
            addPost: (t, b) => this.model.addPost(t, b),
            deletePost: (id) => this.model.deletePost(id),
            likePost: (id) => this.model.toggleLike(id),
            addComment: (id, text) => this.model.addComment(id, text),
            updateProfile: (data) => this.model.updateUser(data),
            
            // ЛОГІКА РЕЄСТРАЦІЇ
            register: (userData) => {
                const result = this.model.registerUser(userData);
                if (result.success) {
                    alert('Реєстрація успішна!');
                    // Після реєстрації автоматично логінимо і йдемо в профіль
                    this.model.loginUser(userData.email, userData.password);
                    window.location.href = 'profile.html'; 
                } else {
                    alert('Користувач з таким Email вже існує');
                }
            },

            // ЛОГІКА ВХОДУ
            login: (email, password) => {
                if (this.model.loginUser(email, password)) {
                    // Після успішного входу переходимо на головну сторінку блогу
                    window.location.href = 'app.html';
                } else {
                    alert('Невірний email або пароль');
                }
            }
        });
    }

    updateView() {
        const currentUser = this.model.currentUser;
        const email = currentUser ? currentUser.email : null;
        
        // Оновлюємо пости
        this.view.displayPosts(this.model.posts, email);
        
        // Оновлюємо дані в профілі, якщо ми на сторінці профілю
        if (currentUser) {
            const userPostsCount = this.model.posts.filter(p => p.author === currentUser.name).length;
            this.view.displayUserProfile(currentUser, userPostsCount);
        }
    }
}
