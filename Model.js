class AppModel {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.onDataChanged = () => {};
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

        if (!user) return false;

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        return true;
    }

    updateUser(newData) {
        if (!this.currentUser) return;
        this.users = this.users.map(u => u.email === this.currentUser.email ? { ...u, ...newData } : u);
        this.currentUser = { ...this.currentUser, ...newData };
        this._save('users', this.users);
        this._save('currentUser', this.currentUser);
    }

    saveData() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('posts', JSON.stringify(this.posts));

        this.onDataChanged(); 
    }

    addPost(title, body) {
            const post = {
                id: Date.now(),
                title,
                body,
                author: this.currentUser.name, // 👈 автор
                likes: [],
            comments: [] // 👈 важливо
            };

            this.posts.push(post);
            this.saveData();
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

    if (!post) return;

    post.comments.push({
        author: this.currentUser.name,
        text
    });
    this.saveData();
}
    deleteComment(postId, index) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments[index];

    if (
        comment.author === this.currentUser.name ||
        post.author === this.currentUser.name
    ) {
        post.comments.splice(index, 1);
        this.saveData();
    }
}
}
