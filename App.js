require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Membuat koneksi ke MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// Menampilkan semua todo
app.get('/todos', (req, res) => {
    const query = 'SELECT * FROM todos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to fetch todos' });
            return;
        }
        res.json(results);
    });
});

// Menambahkan todo baru
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO todos (title, description) VALUES (?, ?)';
    connection.query(query, [title, description], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to create todo' });
            return;
        }
        res.json({ id: result.insertId, title, description });
    });
});

// Mengupdate todo berdasarkan ID
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const query = 'UPDATE todos SET title = ?, description = ? WHERE id = ?';
    connection.query(query, [title, description, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to update todo' });
            return;
        }
        res.json({ id, title, description });
    });
});

// Menghapus todo berdasarkan ID
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to delete todo' });
            return;
        }
        res.json({ id });
    });
});

// Menjalankan server pada port 3000
app.listen(3001, () => {
    console.log('Server started on port 3001');
});