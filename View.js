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

        if (this.loginForm) {
            this.loginForm.addEventListener('submit', e => {
                e.preventDefault();

                handlers.login(
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
            });
        }

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

        if (this.postsContainer) {
            this.postsContainer.addEventListener('click', e => {

                if (e.target.classList.contains('delete-btn')) {
                    handlers.deletePost(Number(e.target.dataset.id));
                }

                if (e.target.classList.contains('like-btn')) {
                    handlers.likePost(Number(e.target.dataset.id));
                }
            });

            this.postsContainer.addEventListener('submit', e => {
                if (e.target.classList.contains('comment-form')) {
                    e.preventDefault();

                    const id = Number(e.target.dataset.id);
                    const text = e.target.querySelector('input').value;

                    handlers.addComment(id, text);
                    e.target.reset();
                }
            });
        }
    }

    displayPosts(posts, currentUserEmail) {
    if (!this.postsContainer) return;

    this.postsContainer.innerHTML = posts.map(post => {
        const isLiked = post.likes.includes(currentUserEmail);

        return `
        <article class="bg-white p-6 rounded-lg shadow-sm border mb-6">

            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">${post.title}</h2>
                <span class="text-sm text-gray-500">✍ ${post.author}</span>
            </div>

            <p class="mt-3">${post.body}</p>

            <button class="like-btn mt-3" data-id="${post.id}">
                ${isLiked ? '❤️' : '🤍'} ${post.likes.length}
            </button>

            <button class="delete-btn text-red-500 ml-3" data-id="${post.id}">
                Видалити
            </button>

            <!-- COMMENTS -->
            <div class="mt-4">
                ${post.comments.map(c => `
                    <div class="text-sm border-t pt-2 mt-2">
                        <b>${c.author}:</b> ${c.text}
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

    displayUserProfile(user, count) {
        if (!this.profileName) return;

        this.profileName.textContent = user.name;

        document.getElementById('profile-table-name').textContent = user.name;
        document.getElementById('profile-table-email').textContent = user.email;
        document.getElementById('profile-posts-count').textContent = count;
    }
}
