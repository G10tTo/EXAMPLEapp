require("dotenv").config();
const express = require('express');
const cors = require('cors');
const pool = require('./dbconfig');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/badges', async (req, res) => {
  try {
    //query to the database to get all records from the table
    const list_badges = await pool.query('SELECT * FROM badges_list');

    // Send the rows (array of data) as a response and in JSON format.
    res.json(list_badges.rows);

  } catch (err) {
    console.log('Internal error:'+ err);
    res.status(500).send('Internal error:'+ err);
  }
});

app.delete('/badges/:id', async (req, res) => {
  try {
    // Extract id parameter from the request object
    const { id } = req.params;
    const badge = await pool.query(
      `delete from badges_list where id =$1`, [id]);
    res.json(badge.rows[0]);
  }catch (err) {
    console.log('Internal error:', err);
    res.status(500).send('Internal error:'+ err);
  }
});

app.put('/badges/:id', async (req, res) => {
  try {
    // Extract id parameter from the request object
    const { id } = req.params;

    // Extract the new title, description, and points submitted from the form.
    const { title: rawTitle, description, points } = req.body;
    const title = rawTitle.replace(/\s+/g, ' ').trim();

    // Debugging log, can be deleted
    console.log('Received points:', points);

    // Validate points only if provided
    if (points !== undefined) {
      if (typeof points !== 'number' || points < 0 || points > 100) {
        return res.status(400).json({ error: 'Points must be a number between 0 and 100.' });
      }
    }

    // Validation for title and description
    if (!title || title.length > 100) {
      return res.status(400).json({ error: 'Title is required and must be 1-100 characters long.' });
    }
    if (!description || description.length < 3 || description.length > 300) {
      return res.status(400).json({ error: 'Description must be between 3 and 300 characters long.' });
    }

    // Check if a badge with the same title already exists (case-insensitive)
    const existingBadge = await pool.query('SELECT * FROM badges_list WHERE LOWER(title) = LOWER($1) AND id != $2', [title, id]);
    if (existingBadge.rows.length > 0) {
      return res.status(409).json({ error: 'Title already exists.' });
    }

    // Create the update query
    let query = 'UPDATE badges_list SET title=$2, description=$3';
    const values = [id, title, description];

    // If points is provided, add it to the update query
    if (points !== undefined) {
      query += ', points=$4';
      values.push(points);
    }

    // Complete the query with the id
    query += ' WHERE id=$1 RETURNING *';

    // Update badge in the database
    const badge = await pool.query(query, values);  
    res.json(badge.rows[0]);
  }catch (err) {
    console.log('Internal error:', err);
    res.status(500).send('Internal error:'+ err);
  }
});

app.post('/badges', async (req, res) => {
  try {
    const { title: rawTitle, description, points } = req.body;
    const title = rawTitle.replace(/\s+/g, ' ').trim();
    console.log('Received points:', points);

    // Validate points only if provided
    if (points !== undefined) {
      if (typeof points !== 'number' || points < 0 || points > 100) {
        return res.status(400).json({ error: 'Points must be a number between 0 and 100.' });
      }
    }

    // Validation for title and description
    if (!title || title.length > 100) {
      return res.status(400).json({ error: 'Title is required and must be 1-100 characters long.' });
    }
    if (!description || description.length < 3 || description.length > 300) {
      return res.status(400).json({ error: 'Description must be between 3 and 300 characters long.' });
    }

    // Check if a badge with the same title already exists (case-insensitive)
    const existingBadge = await pool.query('SELECT * FROM badges_list WHERE LOWER(title) = LOWER($1)', [title]);
    if (existingBadge.rows.length > 0) {
      return res.status(409).json({ error: 'Title already exists.' });
    }

    // Set points to 0 if not provided
    const badgePoints = points !== undefined ? points : 0;

    const newBadge = await pool.query(
      `INSERT INTO badges_list (title, description, points) VALUES($1, $2, $3) RETURNING *`,
      [title, description, badgePoints]
    );
    res.json(newBadge.rows[0]);

  } catch (err) {
    console.log('Internal error:', err);
    res.status(500).send('Internal error:'+ err);
  }
});

app.listen(PORT,() => {
  console.log(`Server listening on the port  ${PORT}`);
});