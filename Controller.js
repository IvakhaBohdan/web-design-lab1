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
            register: (d) => this.model.registerUser(d).success ? window.location.href='login.html' : alert('Помилка'),
            login: (e, p) => this.model.loginUser(e, p) ? window.location.href='app.html' : alert('Невірно')
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