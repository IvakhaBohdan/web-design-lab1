class AppModel {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.onDataChanged = null;
    }

    _save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        if (this.onDataChanged) this.onDataChanged();
    }

    bindDataChanged(callback) { this.onDataChanged = callback; }

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

    updateUser(newData) {
        if (!this.currentUser) return;
        this.users = this.users.map(u => u.email === this.currentUser.email ? { ...u, ...newData } : u);
        this.currentUser = { ...this.currentUser, ...newData };
        this._save('users', this.users);
        this._save('currentUser', this.currentUser);
    }

    addPost(title, body) {
        const post = {
            id: Date.now(),
            title, body,
            author: this.currentUser ? this.currentUser.name : 'Гість',
            authorEmail: this.currentUser ? this.currentUser.email : null,
            date: new Date().toLocaleDateString('uk-UA'),
            likes: [],
            comments: []
        };
        this.posts.unshift(post);
        this._save('posts', this.posts);
    }

    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !this.currentUser) return;
        const index = post.likes.indexOf(this.currentUser.email);
        index === -1 ? post.likes.push(this.currentUser.email) : post.likes.splice(index, 1);
        this._save('posts', this.posts);
    }

    addComment(postId, text) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !this.currentUser) return;
        post.comments.push({
            author: this.currentUser.name,
            text,
            date: new Date().toLocaleDateString('uk-UA')
        });
        this._save('posts', this.posts);
    }
}
