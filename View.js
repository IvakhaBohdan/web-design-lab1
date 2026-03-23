class AppView {
    constructor() {
        this.postForm = document.getElementById('post-form');
        this.postsContainer = document.getElementById('posts-container');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');

        this.profileName = document.getElementById('profile-name');
        this.editBtn = document.getElementById('edit-profile-btn');
        this.modal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.closeModal = document.getElementById('close-modal');
    }

    bindEvents(handlers) {

        // 🔐 LOGIN
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', e => {
                e.preventDefault();

                handlers.login(
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
            });
        }

        // 📝 REGISTER
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', e => {
                e.preventDefault();

                handlers.register({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    gender: document.getElementById('gender').value,
                    dob: document.getElementById('dob').value
                });
            });
        }

        // 📝 POSTS
        if (this.postForm) {
            this.postForm.addEventListener('submit', e => {
                e.preventDefault();

                handlers.addPost(
                    document.getElementById('post-title').value,
                    document.getElementById('post-body').value
                );
            });
        }

        // 💬 POSTS + COMMENTS
        if (this.postsContainer) {

            // КЛІКИ
            this.postsContainer.addEventListener('click', e => {

                // ❌ Видалити пост
                if (e.target.closest('.delete-btn')) {
                    handlers.deletePost(Number(btn.dataset.id));
                }

                // ❤️ Лайк
                if (e.target.classList.contains('like-btn')) {
                    handlers.likePost(Number(e.target.dataset.id));
                }

                // 🗑 Видалити коментар
                if (e.target.classList.contains('delete-comment')) {
                    const postId = Number(e.target.dataset.post);
                    const index = Number(e.target.dataset.index);

                    handlers.deleteComment(postId, index);
                }
            });

            // 💬 ДОДАТИ КОМЕНТАР
            this.postsContainer.addEventListener('submit', e => {
                if (e.target.classList.contains('comment-form')) {
                    e.preventDefault();

                    const postId = Number(e.target.dataset.id);
                    const input = e.target.querySelector('input');

                    if (input.value.trim() !== '') {
                        handlers.addComment(postId, input.value.trim());
                        input.value = '';
                    }
                }
            });
        }

        // ✏️ PROFILE EDIT (якщо є)
        if (this.editBtn) {
            this.editBtn.onclick = () => this.modal.classList.remove('hidden');
            this.closeModal.onclick = () => this.modal.classList.add('hidden');

            this.editForm.onsubmit = e => {
                e.preventDefault();

                handlers.updateProfile({
                    name: document.getElementById('edit-name').value,
                    gender: document.getElementById('edit-gender').value,
                    dob: document.getElementById('edit-dob').value
                });

                this.modal.classList.add('hidden');
            };
        }
    }

    displayPosts(posts, currentUserName) {
        if (!this.postsContainer) return;

        this.postsContainer.innerHTML = posts.map(post => {

            const likes = post.likes || [];
            const comments = post.comments || [];

            const isLiked = likes.includes(currentUserName);

            return `
            <article class="bg-white p-6 rounded-lg shadow-sm border mb-6">

                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">${post.title}</h2>
                    <span class="text-sm text-gray-500">✍ ${post.author}</span>
                </div>

                <p class="mt-3">${post.body}</p>

                <button class="like-btn mt-3" data-id="${post.id}">
                    ${isLiked ? '❤️' : '🤍'} ${likes.length}
                </button>

                ${post.author === currentUserName ? `
                    <button class="delete-btn text-red-500 ml-3" data-id="${post.id}">
                        Видалити
                    </button>
                    ` : ''}

                <!-- COMMENTS -->
                <div class="mt-4">
                    ${comments.map((c, i) => `
                        <div class="text-sm border-t pt-2 mt-2 flex justify-between items-center">
                            <span><b>${c.author}:</b> ${c.text}</span>

                            ${
                                c.author === currentUserName ||
                                post.author === currentUserName
                                ? `<button class="delete-comment text-red-500 text-xs" 
                                        data-post="${post.id}" 
                                        data-index="${i}">
                                        ✖
                                   </button>`
                                : ''
                            }
                        </div>
                    `).join('')}
                </div>

                <!-- ADD COMMENT -->
                <form class="comment-form mt-3" data-id="${post.id}">
                    <input type="text" placeholder="Написати коментар..."
                           class="border p-2 w-full rounded" required>
                </form>

            </article>
            `;
        }).join('');
    }

    // 👤 PROFILE
    displayUserProfile(user, count) {
        if (!this.profileName || !user) return;

        this.profileName.textContent = user.name;

        document.getElementById('profile-table-name').textContent = user.name;
        document.getElementById('profile-table-email').textContent = user.email;
        document.getElementById('profile-posts-count').textContent = count;
    }

hidePostForm() {
    const formContainer = document.getElementById('post-form-container');
    const titleInput = document.getElementById('post-title');
    const bodyInput = document.getElementById('post-body');

    // очистка
    if (titleInput) titleInput.value = '';
    if (bodyInput) bodyInput.value = '';

    // ховаємо
    if (formContainer) {
        formContainer.classList.add('hidden');
    }
}
    
}
