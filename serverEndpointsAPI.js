const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const db = new sqlite3.Database('books.sqlite');

app.use(bodyParser.json());
app.use(cors()); // For cross-origin requests

//? Get function for search feature
app.get('/regBooks/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    db.all('SELECT * FROM regBooks WHERE Title LIKE ?', [`%${keyword}%`], (err, rows) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//? Post function for add feature
app.post('/regBooks', (req, res) => {
    const { Title, Author, Genre, Price } = req.body;
    db.run('INSERT INTO books (Title, Author, Genre, Price) VALUES (?, ?, ?, ?)', [Title, Author, Genre, Price], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Book added successfully', Id: this.lastID });
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
