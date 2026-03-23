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
                    this.model.loginUser(userData.email, userData.password);
                    window.location.href = 'profile.html';
                } else {
                    alert('Користувач вже існує');
                }
            },

            login: (email, password) => {
                if (this.model.loginUser(email, password)) {
                    window.location.href = 'app.html';
                } else {
                    alert('Невірний email або пароль');
                }
            },

            addPost: (title, body) => {
                this.model.addPost(title, body);
            },

            deletePost: (id) => {
                this.model.deletePost(id);
            },

            likePost: (id) => {
                this.model.toggleLike(id);
            },

            addComment: (postId, text) => {
                this.model.addComment(postId, text);
                this.updateView();
            },

            deleteComment(postId, index) {
                const post = this.posts.find(p => p.id === postId);
                if (!post) return;

                const comment = post.comments[index];

                if (
                    comment.author === this.currentUser.name ||
                    post.author === this.currentUser.name
                ) {
                post.comments.splice(index, 1);
                this.saveData();
                    }
                }

            updateProfile: (data) => {
                this.model.updateUser(data);
                this.updateView();
            }
        });
    }

    updateView() {
        const user = this.model.currentUser;

        if (this.view.postsContainer) {
            this.view.displayPosts(
                this.model.posts,
                user ? user.email : null
            );
        }

        if (user && this.view.profileName) {
            const count = this.model.posts.filter(
                p => p.author === user.name
            ).length;

            this.view.displayUserProfile(user, count);
        }
    }
}
