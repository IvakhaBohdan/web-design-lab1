class AppView {
    constructor() {
        this.postForm = document.getElementById('post-form');
        this.postsContainer = document.getElementById('posts-container');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');

        // Профіль
        this.profileName = document.getElementById('profile-name');
        this.editBtn = document.getElementById('edit-profile-btn');
        this.modal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.closeModal = document.getElementById('close-modal');
    }

    // ================= POSTS =================
    displayPosts(posts, currentUserEmail) {
        if (!this.postsContainer) return;

        this.postsContainer.innerHTML = posts.map(post => {
            const isLiked = post.likes && post.likes.includes(currentUserEmail);

            return `
            <article class="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 class="text-xl font-bold">${post.title}</h2>
                <p class="text-gray-700">${post.body}</p>

                <button class="like-btn" data-id="${post.id}">
                    ${isLiked ? '❤️' : '🤍'} (${post.likes.length})
                </button>

                <button class="delete-btn text-red-500" data-id="${post.id}">
                    Видалити
                </button>
            </article>`;
        }).join('');
    }

    // ================= PROFILE =================
    displayUserProfile(user, count) {
        if (!this.profileName || !user) return;

        this.profileName.textContent = user.name;

        document.getElementById('profile-table-name').textContent = user.name;
        document.getElementById('profile-table-email').textContent = user.email;

        document.getElementById('profile-posts-count').textContent = count;

        const genders = { male: 'Чоловіча', female: 'Жіноча', other: 'Інше' };

        document.getElementById('profile-table-gender').textContent =
            genders[user.gender] || 'Не вказано';

        document.getElementById('profile-table-dob').textContent =
            user.dob ? new Date(user.dob).toLocaleDateString('uk-UA') : 'Не вказано';
    }

    // ================= EVENTS =================
    bindEvents(handlers) {

        // 🔐 LOGIN
        if (this.loginForm) {
            this.loginForm.onsubmit = (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                handlers.login(email, password);
            };
        }

        // 📝 REGISTER
        if (this.registerForm) {
            this.registerForm.onsubmit = (e) => {
                e.preventDefault();

                const userData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    gender: document.getElementById('gender').value,
                    dob: document.getElementById('dob').value
                };

                handlers.register(userData);
            };
        }

        // ✏️ EDIT PROFILE
        if (this.editBtn) {
            this.editBtn.onclick = () => this.modal.classList.remove('hidden');
            this.closeModal.onclick = () => this.modal.classList.add('hidden');

            this.editForm.onsubmit = (e) => {
                e.preventDefault();

                handlers.updateProfile({
                    name: document.getElementById('edit-name').value,
                    gender: document.getElementById('edit-gender').value,
                    dob: document.getElementById('edit-dob').value
                });

                this.modal.classList.add('hidden');
            };
        }

        this.commonEvents(handlers);
    }

    commonEvents(handlers) {
        if (!this.postsContainer) return;

        this.postsContainer.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);

            if (e.target.classList.contains('delete-btn')) {
                handlers.deletePost(id);
            }

            if (e.target.classList.contains('like-btn')) {
                handlers.likePost(id);
            }
        };
    }
}
