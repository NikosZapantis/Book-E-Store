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
    const { Author, Title, Genre, Price } = req.body;
    db.run('INSERT INTO books (author, title, genre, price) VALUES (?, ?, ?, ?)', [Author, Title, Genre, Price], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Book added successfully', Id: this.lastID });
    });
});
