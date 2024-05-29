const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('books.sqlite');

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS regBooks`);
    db.run(`CREATE TABLE IF NOT EXISTS regBooks (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Author VARCHAR(25) NOT NULL,
        Title VARCHAR(40) NOT NULL,
        Genre VARCHAR(20) NOT NULL,
        Price REAL NOT NULL
    )`);

    db.run(`INSERT INTO regBooks (Title, Author, Genre, Price) VALUES
    ('Pirates of the Caribbean', 'Johnny Depp', 'Action and Adventure', 12.99),
    ('The Pirate Hunter', 'Nikos Zapantis', 'Mystery', 15.99),
    ('Pirate Latitudes', 'Nikos Zapantis', 'Horror', 39.99)
    `);
});

db.close();
