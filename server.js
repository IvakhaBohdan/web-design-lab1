const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); 

const db = new sqlite3.Database('./blog.db');

// Створення таблиць 
db.serialize(() => {
    // Таблиця користувачів 
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, email TEXT UNIQUE, password TEXT, gender TEXT, dob TEXT, bio TEXT, avatar TEXT
    )`);

    // Таблиця постів з полями для часу та редагування
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, body TEXT, authorEmail TEXT, authorName TEXT, 
        date INTEGER, edited INTEGER DEFAULT 0, editDate INTEGER
    )`);

    // Таблиця коментарів з полями для часу та редагування
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        postId INTEGER, authorEmail TEXT, authorName TEXT, text TEXT, 
        date INTEGER, edited INTEGER DEFAULT 0, editDate INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS likes (
        postId INTEGER, userEmail TEXT, UNIQUE(postId, userEmail)
    )`);
});

// АВТОРШАЦІЯ 
app.post('/api/register', (req, res) => {
    const { name, email, password, gender, dob } = req.body;
    db.run(`INSERT INTO users (name, email, password, gender, dob) VALUES (?, ?, ?, ?, ?)`, 
    [name, email, password, gender, dob], function(err) {
        if (err) return res.status(400).json({ error: "Email вже існує" });
        res.json({ id: this.lastID, success: true });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
        if (user) res.json(user);
        else res.status(401).json({ error: "Невірні дані" });
    });
});

// ПОСТИ 
app.get('/api/posts', (req, res) => {
    db.all(`SELECT * FROM posts ORDER BY date DESC`, [], async (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        const enrichedPosts = await Promise.all(posts.map(async (post) => {
            const comments = await new Promise(resolve => db.all(`SELECT * FROM comments WHERE postId = ?`, [post.id], (e, r) => resolve(r || [])));
            const likes = await new Promise(resolve => db.all(`SELECT userEmail FROM likes WHERE postId = ?`, [post.id], (e, r) => resolve((r || []).map(l => l.userEmail))));
            return { ...post, comments, likes };
        }));
        res.json(enrichedPosts);
    });
});

app.post('/api/posts', (req, res) => {
    const { title, body, authorEmail, authorName } = req.body;
    db.run(`INSERT INTO posts (title, body, authorEmail, authorName, date) VALUES (?, ?, ?, ?, ?)`,
    [title, body, authorEmail, authorName, Date.now()], function() {
        res.json({ id: this.lastID, success: true });
    });
});

app.put('/api/posts/:id', (req, res) => {
    const { title, body, editDate } = req.body;
    db.run(`UPDATE posts SET title = ?, body = ?, edited = 1, editDate = ? WHERE id = ?`, 
    [title, body, editDate, req.params.id], () => res.json({success: true}));
});

app.delete('/api/posts/:id', (req, res) => {
    db.run(`DELETE FROM posts WHERE id = ?`, [req.params.id], () => {
        db.run(`DELETE FROM comments WHERE postId = ?`, [req.params.id]);
        db.run(`DELETE FROM likes WHERE postId = ?`, [req.params.id]);
        res.json({success: true});
    });
});

// КОМЕНТАРІ
app.post('/api/comments', (req, res) => {
    const { postId, authorEmail, authorName, text } = req.body;
    db.run(`INSERT INTO comments (postId, authorEmail, authorName, text, date) VALUES (?, ?, ?, ?, ?)`,
    [postId, authorEmail, authorName, text, Date.now()], () => res.json({ success: true }));
});

app.put('/api/comments/:id', (req, res) => {
    const { text, editDate } = req.body;
    db.run(`UPDATE comments SET text = ?, edited = 1, editDate = ? WHERE id = ?`, 
    [text, editDate, req.params.id], () => res.json({ success: true }));
});

app.delete('/api/comments/:id', (req, res) => {
    db.run(`DELETE FROM comments WHERE id = ?`, [req.params.id], () => res.json({success: true}));
});

// ЛАЙКИ
app.post('/api/like', (req, res) => {
    const { postId, userEmail } = req.body;
    db.get(`SELECT * FROM likes WHERE postId = ? AND userEmail = ?`, [postId, userEmail], (err, row) => {
        if (row) {
            db.run(`DELETE FROM likes WHERE postId = ? AND userEmail = ?`, [postId, userEmail], () => {
                res.json({ success: true, action: 'unliked' });
            });
        } else {
            db.run(`INSERT INTO likes (postId, userEmail) VALUES (?, ?)`, [postId, userEmail], () => {
                res.json({ success: true, action: 'liked' });
            });
        }
    });
});

// ПРОФІЛЬ
app.put('/api/user/update', (req, res) => {
    const { name, gender, dob, bio, email } = req.body;
    
    db.serialize(() => {
        db.run(`UPDATE users SET name = ?, gender = ?, dob = ?, bio = ? WHERE email = ?`, 
            [name, gender, dob, bio, email]);

        db.run(`UPDATE posts SET authorName = ? WHERE authorEmail = ?`, [name, email]);

        db.run(`UPDATE comments SET authorName = ? WHERE authorEmail = ?`, [name, email], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

app.listen(3000, () => console.log('Сервер запущено: http://localhost:3000'));