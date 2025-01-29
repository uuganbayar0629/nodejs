const express = require('express');
const mariadb = require('mariadb');

const app = express();
app.use(express.json());

BigInt.prototype.toJSON = function () {
    return Number(this);
  };

// Create a connection pool
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '#8164H3%$mX7oAkXiN#65XxjV7',
  database: 'bps',
  connectionLimit: 5, // Maximum number of connections in the pool
});


// Fetch all users
app.get('/users', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users');
    // console.log('rows' + rows);

    for (const item of rows) {
        // code to be executed
        item['newField'] = 'added'
    }

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Add a new user
app.post('/users', async (req, res) => {
  let conn;
  try {
    const { name, email } = req.body;
    conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});


// update a user
app.put('/users', async (req, res) => {
    let conn;
    try {
      const { id, name, email } = req.body;
      conn = await pool.getConnection();
      const result = await conn.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
      res.json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      if (conn) conn.release();
    }
  });

  


// delete a user by ID
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id; // Extract the ID from the route parameter
  
    try {
      const conn = await pool.getConnection();
  
      // Execute the DELETE query
      const result = await conn.query('DELETE FROM `users WHERE id = ?', [userId]);
  
      conn.release(); // Release the connection back to the pool
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: `User with ID ${userId} deleted successfully.` });
      } else {
        res.status(404).json({ error: `User with ID ${userId} not found.` });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
