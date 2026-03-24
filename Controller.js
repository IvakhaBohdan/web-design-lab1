class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Реєстрація оновлення інтерфейсу при зміні даних у моделі
        this.model.bindDataChanged(() => this.updateView());

        // Первинне відображення даних
        this.updateView();

        // Прив'язка дій користувача з View до методів Model
        this.view.bindEvents({

            // Обробка реєстрації нового користувача
            register: (userData) => {
                const res = this.model.registerUser(userData);

                if (res.success) {
                    this.model.loginUser(userData.email, userData.password);
                    window.location.href = 'profile.html';
                } else {
                    this.view.showAlert('Користувач вже існує');
                }
            },

            // Обробка входу в систему
            login: ({ email, password }) => {
                if (this.model.loginUser(email, password)) {
                    window.location.href = 'app.html';
                } else {
                    this.view.showAlert('Невірний email або пароль');
                }
            },

            // Обробка виходу з акаунта
            logout: () => {
                this.model.logoutUser();
                window.location.href = 'login.html';
            },

            // Ініціалізація відображення головної сторінки
            initIndex() {
                const user = this.model.currentUser;
                this.view.renderIndex(user);
            },

            // Додавання нового поста
            addPost: (title, body) => {
                this.model.addPost(title, body);
                this.view.hidePostForm();
            },

            // Керування видимістю форми створення поста
            togglePostForm: () => {
                this.view.togglePostForm();
            },

            // Приховування форми створення поста
            hidePostForm: () => {
                this.view.hidePostForm();
            },

            // Видалення поста через модель
            deletePost: (id) => {
                this.model.deletePost(id);
            },

            // Обробка лайка поста
            likePost: (id) => {
                this.model.toggleLike(id);
            },

            // Додавання коментаря до поста
            addComment: (postId, text) => {
                this.model.addComment(postId, text);
            },

            // Видалення коментаря через модель
            deleteComment: (postId, index) => {
                this.model.deleteComment(postId, index);
            },

            // Оновлення текстових даних профілю
            updateProfile: (data) => {
                this.model.updateUser(data);
            },

            // Оновлення зображення аватара
            updateAvatar: (base64) => {
                this.model.updateAvatar(base64);
            },

            // Пряме редагування поста
            editPost: (id, text) => {
                this.model.editPost(id, text);
            },

            // Пряме редагування коментаря
            editComment: (postId, index, text) => {
                this.model.editComment(postId, index, text);
            },

            // Запуск діалогу для редагування поста
            startEditPost: (id) => {
                const newText = this.view.showPrompt('Новий текст поста:');
                if (newText) {
                    this.model.editPost(id, newText);
                }
            },

            // Запуск діалогу для редагування коментаря
            startEditComment: (postId, index) => {
                const newText = this.view.showPrompt('Новий коментар:');
                if (newText) {
                    this.model.editComment(postId, index, newText);
                }
            }
        });
    }

    // Головний метод оновлення інтерфейсу: підготовка даних та виклик рендерінгу
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

        // Виклик відображення постів, якщо контейнер присутній на сторінці
        if (this.view.postsContainer) {
            this.view.displayPosts(postsForView);
        }

        // Виклик відображення профілю та статистики
        if (this.view.profileName) {
            const stats = this.model.getUserStats();
            this.view.displayUserProfile(user, stats);
        }
    }
}
