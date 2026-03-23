class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindDataChanged(() => this.updateView());
        this.updateView();

        this.view.bindEvents({
            addPost: (t, b) => this.model.addPost(t, b),
            deletePost: (id) => this.model.deletePost(id),
            likePost: (id) => this.model.toggleLike(id),
            addComment: (id, text) => this.model.addComment(id, text),
            updateProfile: (data) => this.model.updateUser(data),
            
            register: (userData) => {
                const res = this.model.registerUser(userData);
                if (res.success) {
                    // Автоматично логінимо після реєстрації
                    this.model.loginUser(userData.email, userData.password);
                    window.location.href = 'profile.html'; // Йдемо в профіль
                } else {
                    alert('Такий Email вже є!');
                }
            },
            
            login: (email, password) => {
                if (this.model.loginUser(email, password)) {
                    window.location.href = 'app.html'; // Йдемо на блог
                } else {
                    alert('Невірні дані!');
                }
            }
        });
    }

    updateView() {
        const email = this.model.currentUser ? this.model.currentUser.email : null;
        this.view.displayPosts(this.model.posts, email);
        if (this.model.currentUser) {
            const count = this.model.posts.filter(p => p.author === this.model.currentUser.name).length;
            this.view.displayUserProfile(this.model.currentUser, count);
        }
    }
}
