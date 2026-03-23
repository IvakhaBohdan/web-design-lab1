class AppView {
    constructor() {
        this.postForm = document.getElementById('post-form');
        this.postsContainer = document.getElementById('posts-container');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        
        // Елементи профілю
        this.profileName = document.getElementById('profile-name');
        this.editBtn = document.getElementById('edit-profile-btn');
        this.modal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.closeModal = document.getElementById('close-modal');
    }

    displayUserProfile(user, postsCount) {
        if (!this.profileName) return;
        
        this.profileName.textContent = user.name;
        const fields = {
            'profile-table-name': user.name,
            'profile-table-email': user.email,
            'profile-table-gender': user.gender === 'male' ? 'Чоловіча' : 'Жіноча',
            'profile-table-dob': user.dob,
            'profile-posts-count': postsCount
        };

        for (const [id, value] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        }

        const avatar = document.querySelector('img[alt="Фото профілю"]');
        if (avatar) avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&size=128`;
    }

    displayPosts(posts, currentUserEmail) {
        if (!this.postsContainer) return;
        this.postsContainer.innerHTML = posts.map(post => `
            <div class="bg-white p-6 rounded-lg shadow mb-4" data-id="${post.id}">
                <h3 class="text-xl font-bold">${post.title}</h3>
                <p class="text-gray-600 mb-4">${post.body}</p>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>Автор: ${post.author}</span>
                    <button class="like-btn ${post.likes.includes(currentUserEmail) ? 'text-red-500' : ''}">
                        ❤ ${post.likes.length}
                    </button>
                </div>
            </div>
        `).join('');
    }

    bindEvents(handlers) {
        if (this.registerForm) {
            this.registerForm.onsubmit = e => {
                e.preventDefault();
                handlers.register({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    gender: document.getElementById('gender').value,
                    dob: document.getElementById('dob').value
                });
            };
        }

        if (this.loginForm) {
            this.loginForm.onsubmit = e => {
                e.preventDefault();
                handlers.login(document.getElementById('email').value, document.getElementById('password').value);
            };
        }

        if (this.postForm) {
            this.postForm.onsubmit = e => {
                e.preventDefault();
                handlers.addPost(document.getElementById('post-title').value, document.getElementById('post-body').value);
                e.target.reset();
            };
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
    }
}
