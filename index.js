// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const db = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

// Create a new todo
app.post('/todos', async (req, res) => {
  const { title, completed } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, completed]);
    res.status(201).json({ id: result.insertId, title, completed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM todos');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single todo by ID
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM todos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a todo by ID
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  console.log(`Updating todo with id: ${id}, title: ${title}, completed: ${completed}`); // Log data

  try {
    // Fetch the current todo to get the title if it's not provided
    const [currentTodo] = await db.execute('SELECT * FROM todos WHERE id = ?', [id]);
    if (currentTodo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTitle = title !== undefined ? title : currentTodo[0].title;
    const updatedCompleted = completed !== undefined ? completed : currentTodo[0].completed;

    const [result] = await db.execute('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [updatedTitle, updatedCompleted, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json({ id, title: updatedTitle, completed: updatedCompleted });
  } catch (error) {
    console.error('Error updating todo:', error); // Log error
    res.status(500).json({ error: error.message });
  }
});

// Delete a todo by ID
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM todos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check database connection
const checkDatabaseConnection = async () => {
  try {
    await db.execute('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
  }
};

// Start the server and check database connection
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => { // Bind to all interfaces
  console.log(`Server is running on port ${PORT}`);
  await checkDatabaseConnection();
});