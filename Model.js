class AppModel {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.onDataChanged = () => {};
    }

    _save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        this.onDataChanged();
    }

    bindDataChanged(callback) {
        this.onDataChanged = callback;
    }

    registerUser(userData) {
        if (this.users.find(u => u.email === userData.email)) {
            return { success: false };
        }

        this.users.push({
            ...userData,
            avatar: null,
            createdAt: Date.now()
        });

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

    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.onDataChanged();
    }

    updateUser(newData) {
        if (!this.currentUser) return;

        const oldEmail = this.currentUser.email;

        this.users = this.users.map(u =>
            u.email === oldEmail ? { ...u, ...newData } : u
        );

        this.currentUser = { ...this.currentUser, ...newData };

        if (newData.name) {
            this.posts = this.posts.map(post => {

                if (post.author === oldEmail) {
                    post.authorName = newData.name;
                }

                post.comments = post.comments.map(c => {
                    if (c.author === oldEmail) {
                        return { ...c, authorName: newData.name };
                    }
                    return c;
                });

                return post;
            });

            this._save('posts', this.posts);
        }

        this._save('users', this.users);
        this._save('currentUser', this.currentUser);
    }

    addPost(title, body) {
        if (!this.currentUser) return;

        const post = {
            id: Date.now(),
            title,
            body,
            author: this.currentUser.email,
            authorName: this.currentUser.name,
            authorAvatar: this.currentUser.avatar,
            createdAt: Date.now(),
            likes: [],
            comments: [],
        };

        this.posts.push(post);
        this._save('posts', this.posts);
    }

    toggleLike(postId) {
        if (!this.currentUser) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const index = post.likes.indexOf(this.currentUser.email);

        if (index === -1) {
            post.likes.push(this.currentUser.email);
        } else {
            post.likes.splice(index, 1);
        }

        this._save('posts', this.posts);
    }

    addComment(postId, text) {
        if (!this.currentUser) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        post.comments.push({
            author: this.currentUser.email,
            authorName: this.currentUser.name,
            authorAvatar: this.currentUser.avatar,
            text,
            createdAt: Date.now()
        });

        this._save('posts', this.posts);
    }

    deletePost(postId) {
        if (!this.currentUser) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post || post.author !== this.currentUser.email) return;

        this.posts = this.posts.filter(p => p.id !== postId);
        this._save('posts', this.posts);
    }

    deleteComment(postId, index) {
        if (!this.currentUser) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const comment = post.comments[index];

        if (!comment) return;

        if (
            comment.author === this.currentUser.email ||
            post.author === this.currentUser.email
        ) {
            post.comments.splice(index, 1);
            this._save('posts', this.posts);
        }
    }

    editPost(postId, newText) {
        if (!this.currentUser) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post || post.author !== this.currentUser.email) return;

        post.body = newText;
        post.updatedAt = Date.now();
        this._save('posts', this.posts);
    }

    editComment(postId, index, newText) {
        if (!this.currentUser) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const comment = post.comments[index];
        if (!comment || comment.author !== this.currentUser.email) return;

        comment.text = newText;
        comment.updatedAt = Date.now();
        this._save('posts', this.posts);
    }

    getUserStats() {
        if (!this.currentUser) {
            return { posts: 0, likes: 0, comments: 0 };
        }

        const email = this.currentUser.email;

        const postsCount = this.posts.filter(p => p.author === email).length;

        const commentsCount = this.posts.reduce((sum, p) => {
            return sum + (p.comments?.filter(c => c.author === email).length || 0);
        }, 0);

        const likesCount = this.posts.reduce((sum, p) => {
            return sum + (p.likes?.includes(email) ? 1 : 0);
        }, 0);

        return {
            posts: postsCount,
            likes: likesCount,
            comments: commentsCount
        };
    }

    updateAvatar(base64) {
        if (!this.currentUser) return;

        this.currentUser.avatar = base64;

        this.users = this.users.map(u =>
            u.email === this.currentUser.email
                ? { ...u, avatar: base64 }
                : u
        );

        this.posts = this.posts.map(post => {

            if (post.author === this.currentUser.email) {
                post.authorAvatar = base64;
            }

            post.comments = post.comments.map(c => {
                if (c.author === this.currentUser.email) {
                    return { ...c, authorAvatar: base64 };
                }
                return c;
            });

            return post;
        });

        this._save('users', this.users);
        this._save('posts', this.posts);
        this._save('currentUser', this.currentUser);
    }
}
