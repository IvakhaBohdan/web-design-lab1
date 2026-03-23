class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindDataChanged(() => this.updateView());
        this.view.bindEvents({
            register: (data) => this.model.registerUser(data).success ? window.location.href='login.html' : alert('Email зайнятий'),
            login: (e, p) => this.model.loginUser(e, p) ? window.location.href='app.html' : alert('Помилка входу'),
            addPost: (t, b) => this.model.addPost(t, b),
            likePost: (id) => this.model.toggleLike(id),
            updateProfile: (data) => this.model.updateUser(data)
        });

        this.updateView();
    }

    updateView() {
        const user = this.model.currentUser;
        const userEmail = user ? user.email : null;
        
        this.view.displayPosts(this.model.posts, userEmail);
        
        if (user) {
            const myPostsCount = this.model.posts.filter(p => p.authorEmail === user.email).length;
            this.view.displayUserProfile(user, myPostsCount);
        }
    }
}
