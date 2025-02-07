const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();
// app.use(express.json());
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

const port = 5000;
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

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

// Sample route
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the Node.js API!' });
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
    res.status(500).json({ error: checkCustomError(err.message) });
  } finally {
    if (conn) conn.release();
  }
});

function checkCustomError(errMsg) {
  if (errMsg && errMsg.includes('Duplicate entry') && errMsg.includes('email')) {
    errMsg = `Email already exists ${email}`;
  }
  return errMsg;
}
// Add a new user
app.post('/users', async (req, res) => {
  let conn;
  const { name, email } = req.body;
  try {
    conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: checkCustomError(err.message) });
  } finally {
    if (conn) conn.release();
  }
});


// update a user
app.put('/users/:id', async (req, res) => {
    const userId = req.params.id; // Extract the ID from the route parameter
    let conn;
    try {
      const { name, email } = req.body;
      conn = await pool.getConnection();
      const result = await conn.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
      res.json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: checkCustomError(err.message) });
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
      const result = await conn.query('DELETE FROM users WHERE id = ?', [userId]);
  
      conn.release(); // Release the connection back to the pool
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: `User with ID ${userId} deleted successfully.` });
      } else {
        res.status(404).json({ error: `User with ID ${userId} not found.` });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: checkCustomError(err.message) });
    }
  });
