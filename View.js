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

    formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);

        return date.toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);

        return date.toLocaleDateString('uk-UA');
    }

    bindEvents(handlers) {

        if (this.loginForm) {
            this.loginForm.addEventListener('submit', e => {
                e.preventDefault();
                handlers.login({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                });
            });
        }

        document.addEventListener('click', e => {
            const btn = e.target.closest('#logout-btn');
            if (btn) {
                e.preventDefault();
                handlers.logout();
            }
        });

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

        if (this.postForm) {
            this.postForm.addEventListener('submit', e => {
                e.preventDefault();
                handlers.addPost(
                    document.getElementById('post-title').value,
                    document.getElementById('post-body').value
                );
            });
        }

        document.getElementById('show-form-btn')?.addEventListener('click', handlers.togglePostForm);
        document.getElementById('cancel-post-btn')?.addEventListener('click', handlers.hidePostForm);

        if (this.postsContainer) {
            this.postsContainer.addEventListener('click', e => {

                const deleteBtn = e.target.closest('.delete-btn');
                const likeBtn = e.target.closest('.like-btn');
                const deleteCommentBtn = e.target.closest('.delete-comment');
                const editPostBtn = e.target.closest('.edit-post');
                const editCommentBtn = e.target.closest('.edit-comment');

                if (deleteBtn) {
                    handlers.deletePost(Number(deleteBtn.dataset.id));
                    return;
                }

                if (likeBtn) {
                    handlers.likePost(Number(likeBtn.dataset.id));
                    return;
                }

                if (deleteCommentBtn) {
                    handlers.deleteComment(
                        Number(deleteCommentBtn.dataset.post),
                        Number(deleteCommentBtn.dataset.index)
                    );
                    return;
                }

                if (editPostBtn) {
                    handlers.startEditPost(Number(editPostBtn.dataset.id));
                }

                if (editCommentBtn) {
                    handlers.startEditComment(
                        Number(editCommentBtn.dataset.post),
                        Number(editCommentBtn.dataset.index)
                    );
                }
            });

            this.postsContainer.addEventListener('submit', e => {
                if (e.target.classList.contains('comment-form')) {
                    e.preventDefault();

                    const postId = Number(e.target.dataset.id);
                    const input = e.target.querySelector('input');

                    if (input.value.trim()) {
                        handlers.addComment(postId, input.value.trim());
                        input.value = '';
                    }
                }
            });
        }

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

        const avatarInput = document.getElementById('avatar-upload');
        if (avatarInput) {
            avatarInput.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    handlers.updateAvatar(reader.result);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // ✅ ТЕПЕР БЕЗ currentUser
    displayPosts(posts) {
        if (!this.postsContainer) return;

        this.postsContainer.innerHTML = posts.map(post => {

            return `
            <article class="bg-white p-6 rounded-lg shadow-sm border mb-6">

                <div class="flex items-center gap-2">
                    <img src="${post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}`}" 
                         class="w-8 h-8 rounded-full">
                    <span class="text-sm text-gray-500">
                        ✍ ${post.authorName} · ${this.formatDate(post.createdAt)} ${this.formatTime(post.createdAt)}
                        ${post.updatedAt ? ' (ред. ' + this.formatTime(post.updatedAt) + ')' : ''}
                    </span>
                </div>

                <h2 class="text-xl font-bold">${post.title}</h2>
                <p class="text-gray-700 mt-2">${post.body}</p>

                <button class="like-btn mt-3" data-id="${post.id}">
                    ${post.isLiked ? '❤️' : '🤍'} ${post.likesCount}
                </button>

                ${post.canDelete ? `
                    <button class="delete-btn ml-3 text-red-500" data-id="${post.id}">Видалити</button>
                ` : ''}

                ${post.canEdit ? `
                    <button class="edit-post ml-2 text-blue-500" data-id="${post.id}">Редагувати</button>
                ` : ''}

                <div class="mt-4">
                    ${post.comments.map((c, i) => `
                        <div class="flex justify-between items-center mt-2 border-t pt-2">

                            <div class="flex items-center gap-2">
                                <img src="${c.authorAvatar || `https://ui-avatars.com/api/?name=${c.authorName}`}" 
                                     class="w-6 h-6 rounded-full">

                                <div>
                                    <span><b>${c.authorName}:</b> ${c.text}</span>

                                    <div class="text-xs text-gray-400">
                                        ${this.formatDate(c.createdAt)} ${this.formatTime(c.createdAt)}
                                        ${c.updatedAt ? ' (ред. ' + this.formatTime(c.updatedAt) + ')' : ''}
                                    </div>
                                </div>
                            </div>

                            <div>
                                ${c.canEdit ? `
                                    <button class="edit-comment text-blue-500 text-xs mr-2"
                                            data-post="${post.id}" data-index="${i}">✏</button>
                                ` : ''}

                                ${c.canDelete ? `
                                    <button class="delete-comment text-red-500 text-xs"
                                            data-post="${post.id}" data-index="${i}">✖</button>
                                ` : ''}
                            </div>

                        </div>
                    `).join('')}
                </div>

                <form class="comment-form mt-3" data-id="${post.id}">
                    <input type="text" placeholder="Коментар..."
                           class="border p-2 w-full rounded" required>
                </form>

            </article>
            `;
        }).join('');
    }

    displayUserProfile(user, stats) {
        if (!this.profileName || !user) return;

        this.profileName.textContent = user.name;

        document.getElementById('profile-table-name').textContent = user.name;
        document.getElementById('profile-table-email').textContent = user.email;
        document.getElementById('profile-table-gender').textContent = user.gender || '-';
        document.getElementById('profile-table-dob').textContent = user.dob || '-';

        document.getElementById('profile-posts-count').textContent = stats.posts;
        document.getElementById('profile-comments-count').textContent = stats.comments;
        document.getElementById('profile-likes-count').textContent = stats.likes;

        const avatar = document.getElementById('profile-avatar');
        if (avatar) {
            avatar.src = user.avatar || `https://ui-avatars.com/api/?name=${user.name}`;
        }
    }

    hidePostForm() {
        document.getElementById('post-form-container')?.classList.add('hidden');
        document.getElementById('post-title').value = '';
        document.getElementById('post-body').value = '';
    }

    togglePostForm() {
        document.getElementById('post-form-container')?.classList.toggle('hidden');
    }
}
