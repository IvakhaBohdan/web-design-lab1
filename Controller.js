class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // 🔄 підписка на зміни даних
        this.model.bindDataChanged(() => this.updateView());

        // перший рендер
        this.updateView();

        //  обробники подій
        this.view.bindEvents({

            //  REGISTER
            register: (userData) => {
                const res = this.model.registerUser(userData);

                if (res.success) {
                    this.model.loginUser(userData.email, userData.password);
                    window.location.href = 'profile.html';
                } else {
                    alert('Користувач вже існує');
                }
            },

            //  LOGIN
            login: (email, password) => {
                if (this.model.loginUser(email, password)) {
                    window.location.href = 'app.html';
                } else {
                    alert('Невірний email або пароль');
                }
            },

            logout: () => {
                this.model.logoutUser();
                window.location.href = 'login.html';
            },

            //  ДОДАТИ ПОСТ
            addPost: (title, body) => {
            this.model.addPost(title, body);
                setTimeout(() => {
                this.view.hidePostForm();
                }, 0);
                },

            togglePostForm: () => {
                this.view.togglePostForm();
                },

            hidePostForm: () => {
                this.view.hidePostForm();
            }

            //  ВИДАЛИТИ ПОСТ
            deletePost: (id) => {
                this.model.deletePost(id);
            },

            //  ЛАЙК
            likePost: (id) => {
                this.model.toggleLike(id);
            },

            //  ДОДАТИ КОМЕНТАР
            addComment: (postId, text) => {
                this.model.addComment(postId, text);
                this.updateView(); // одразу оновлюємо
            },

            //  ВИДАЛИТИ КОМЕНТАР
            deleteComment: (postId, index) => {
                this.model.deleteComment(postId, index);
                this.updateView();
            },

            //  ОНОВИТИ ПРОФІЛЬ
            updateProfile: (data) => {
                this.model.updateUser(data);
                this.updateView();
            }
        });
    }

    //  ОНОВЛЕННЯ UI
    updateView() {
        const user = this.model.currentUser;

        if (!user) return;

        //  Пости
        if (this.view.postsContainer) {
            this.view.displayPosts(this.model.posts, user.name);
        }

        //  Профіль
        if (this.view.profileName) {
            const count = this.model.posts.filter(
                p => p.author === user.name
            ).length;

            this.view.displayUserProfile(user, count);
        }
    }
}
