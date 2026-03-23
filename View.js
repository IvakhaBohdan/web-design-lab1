class AppView {
    constructor() {
        this.postForm = document.getElementById('post-form');
        this.postsContainer = document.getElementById('posts-container');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        
        // Профіль та Модалка
        this.profileName = document.getElementById('profile-name');
        this.editBtn = document.getElementById('edit-profile-btn');
        this.modal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.closeModal = document.getElementById('close-modal');
    }

    displayPosts(posts, currentUserEmail) {
    if (!this.postsContainer) return;
    
    this.postsContainer.innerHTML = posts.map(post => {
        const isLiked = post.likes && post.likes.includes(currentUserEmail);
        
        // Рендеримо коментарі у вашому стилі з аватарами
        const commentsHtml = post.comments.map(c => `
            <div class="bg-gray-50 p-3 rounded flex items-start space-x-3 mb-3">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.author)}&background=random&color=fff&size=32" 
                     class="w-8 h-8 rounded-full shadow-sm">
                <div>
                    <p class="text-sm font-bold text-gray-800">${c.author} 
                        <span class="text-xs text-gray-500 font-normal ml-2">${c.date}</span>
                    </p>
                    <p class="text-gray-600 text-sm mt-1">${c.text}</p>
                </div>
            </div>
        `).join('');

        return `
        <article class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-bold text-gray-900">${post.title}</h2>
                <div class="space-x-2">
                    <button class="like-btn text-sm ${isLiked ? 'text-red-600' : 'text-gray-400'} hover:underline" data-id="${post.id}">
                        ${isLiked ? '❤️ Вже подобається' : '🤍 Лайк'} (${post.likes ? post.likes.length : 0})
                    </button>
                    <button class="delete-btn text-sm text-red-500 hover:underline" data-id="${post.id}">Видалити</button>
                </div>
            </div>
            <p class="text-gray-700 mb-4 leading-relaxed">${post.body}</p>
            
            <hr class="my-4 border-gray-100">

            <div class="mt-4">
                <h3 class="text-lg font-semibold mb-3">Відгуки (${post.comments.length})</h3>
                
                <div class="space-y-2 mb-4">
                    ${commentsHtml || '<p class="text-gray-400 text-sm">Поки немає коментарів...</p>'}
                </div>

                <form class="comment-form flex gap-2" data-id="${post.id}">
                    <input type="text" placeholder="Залишити коментар..." 
                           class="flex-grow px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" required>
                    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-indigo-700 transition">
                        Ок
                    </button>
                </form>
            </div>
        </article>`;
    }).join('');
}

    displayUserProfile(user, count) {
        if (!this.profileName || !user) return;
        this.profileName.textContent = user.name;
        document.getElementById('profile-table-name').textContent = user.name;
        document.getElementById('profile-table-email').textContent = user.email;
        document.getElementById('profile-posts-count').textContent = count;
        
        const genders = { male: 'Чоловіча', female: 'Жіноча', other: 'Інше' };
        document.getElementById('profile-table-gender').textContent = genders[user.gender] || 'Не вказано';
        document.getElementById('profile-table-dob').textContent = new Date(user.dob).toLocaleDateString('uk-UA');
    }

   bindEvents(handlers) {
        // 1. Обробка форми реєстрації
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', e => {
                e.preventDefault(); // Зупиняємо перезавантаження сторінки
                handlers.register({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    gender: document.getElementById('gender').value,
                    dob: document.getElementById('dob').value
                });
            });
        }

        // 2. Обробка форми входу
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', e => {
                e.preventDefault();
                handlers.login(
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
            });
        }

        // 3. Обробка форми створення поста
        if (this.postForm) {
            this.postForm.addEventListener('submit', e => {
                e.preventDefault();
                handlers.addPost(
                    document.getElementById('post-title').value,
                    document.getElementById('post-body').value
                );
                // Очищаємо і ховаємо форму після публікації
                this.postForm.reset();
                document.getElementById('post-form-container').classList.add('hidden');
            });
        }

        this.commonEvents(handlers);
        
        // 4. Обробка модального вікна профілю
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

    commonEvents(handlers) {
        if (!this.postsContainer) return;
        this.postsContainer.onclick = e => {
            const id = parseInt(e.target.closest('[data-id]')?.dataset.id);
            if (e.target.classList.contains('delete-btn')) handlers.deletePost(id);
            if (e.target.closest('.like-btn')) handlers.likePost(id);
        };

        this.postsContainer.addEventListener('submit', e => {
            if (e.target.classList.contains('comment-form')) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                const input = e.target.querySelector('input');
                handlers.addComment(id, input.value);
                input.value = '';
            }
        });
    }
}
