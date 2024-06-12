//? Importing required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); 

//? Creating an instance of the express app
const app = express();
//? Creating the connection to the SQLite database
const db = new sqlite3.Database('books.sqlite');

//? Needed so I can parse JSON bodies from the requests I get [http]
app.use(bodyParser.json());
//? Enabling cors for cross-origin requests
app.use(cors());

//? GET endpoint for search feature
app.get('/regBooks/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    db.all('SELECT * FROM regBooks WHERE Title LIKE ?', [`%${keyword}%`], (err, rows) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//? POST endpoint for add feature
app.post('/regBooks', (req, res) => {
    const { Title, Author, Genre, Price } = req.body;
    db.run('INSERT INTO regBooks (Title, Author, Genre, Price) VALUES (?, ?, ?, ?)', [Title, Author, Genre, Price], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Book added successfully', Id: this.lastID });
    });
});

//? Default port to host the database locally
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
