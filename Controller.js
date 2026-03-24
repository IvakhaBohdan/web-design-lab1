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
                    this.view.showAlert('Користувач вже існує');
                }
            },

            login: ({ email, password }) => {
                if (this.model.loginUser(email, password)) {
                    window.location.href = 'app.html';
                } else {
                    this.view.showAlert('Невірний email або пароль');
                }
            },

            logout: () => {
                this.model.logoutUser();
                window.location.href = 'login.html';
            },

            initIndex() {
                const user = this.model.currentUser;
                this.view.renderIndex(user);
            },

            addPost: (title, body) => {
                this.model.addPost(title, body);
                this.view.hidePostForm();
            },

            togglePostForm: () => {
                this.view.togglePostForm();
            },

            hidePostForm: () => {
                this.view.hidePostForm();
            },

            deletePost: (id) => {
                this.model.deletePost(id);
            },

            likePost: (id) => {
                this.model.toggleLike(id);
            },

            addComment: (postId, text) => {
                this.model.addComment(postId, text);
            },

            deleteComment: (postId, index) => {
                this.model.deleteComment(postId, index);
            },

            updateProfile: (data) => {
                this.model.updateUser(data);
            },

            updateAvatar: (base64) => {
                this.model.updateAvatar(base64);
            },

            editPost: (id, text) => {
                this.model.editPost(id, text);
            },

            editComment: (postId, index, text) => {
                this.model.editComment(postId, index, text);
            },

            startEditPost: (id) => {
                const newText = this.view.showPrompt('Новий текст поста:');
                if (newText) {
                    this.model.editPost(id, newText);
                }
            },

            startEditComment: (postId, index) => {
                const newText = this.view.showPrompt('Новий коментар:');
                if (newText) {
                    this.model.editComment(postId, index, newText);
                }
            }
        });
    }

    updateView() {
        const user = this.model.currentUser;

        if (!user) return;

        const postsForView = this.model.posts.map(post => {

            const isLiked = post.likes?.includes(user.email);

            return {
                ...post,

                likesCount: post.likes?.length || 0,
                isLiked: isLiked,

                canEdit: post.author === user.email,
                canDelete: post.author === user.email,

                comments: (post.comments || []).map(c => ({
                    ...c,
                    canEdit: c.author === user.email,
                    canDelete:
                        c.author === user.email ||
                        post.author === user.email
                }))
            };
        });

        if (this.view.postsContainer) {
            this.view.displayPosts(postsForView);
        }

        if (this.view.profileName) {
            const stats = this.model.getUserStats();
            this.view.displayUserProfile(user, stats);
        }
    }
}
