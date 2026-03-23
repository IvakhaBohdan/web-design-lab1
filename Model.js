class AppModel {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    addPost(title, body) {
        const post = {
            id: Date.now(),
            title,
            body,
            author: this.currentUser ? this.currentUser.name : 'Гість',
            date: new Date().toLocaleDateString('uk-UA'),
            likes: [], // Список ID або імен користувачів, що лайкнули
            comments: []
        };
        this.posts.unshift(post);
        this._save('posts', this.posts);
    }

    // Функція 5: Лайки
    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !this.currentUser) return;

        const index = post.likes.indexOf(this.currentUser.email);
        if (index === -1) post.likes.push(this.currentUser.email);
        else post.likes.splice(index, 1);

        this._save('posts', this.posts);
    }

    // Функція 1: Коментарі
    addComment(postId, text) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !this.currentUser) return;

        post.comments.push({
            id: Date.now(),
            author: this.currentUser.name,
            text: text,
            date: new Date().toLocaleDateString('uk-UA')
        });
        this._save('posts', this.posts);
    }

    // Функція 2: Редагування профілю
    updateUser(newData) {
        if (!this.currentUser) return;
        
        // Оновлюємо в списку всіх користувачів
        this.users = this.users.map(u => u.email === this.currentUser.email ? { ...u, ...newData } : u);
        this.currentUser = { ...this.currentUser, ...newData };
        
        this._save('users', this.users);
        this._save('currentUser', this.currentUser);
    }

    deletePost(id) {
        this.posts = this.posts.filter(p => p.id !== id);
        this._save('posts', this.posts);
    }

    registerUser(userData) {
        if (this.users.find(u => u.email === userData.email)) return { success: false };
        this.users.push(userData);
        this._save('users', this.users);
        return { success: true };
    }

    loginUser(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this._save('currentUser', user);
            return true;
        }
        return false;
    }

    _save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        if (this.onDataChanged) this.onDataChanged(this.posts);
    }

    bindDataChanged(callback) { this.onDataChanged = callback; }
}