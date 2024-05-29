const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('books.sqlite');

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS regBooks`); // Checking if the table already exists and deleting it so I can create the new one
    
    //? Creating the table for the registered Books of the db 
    db.run(`CREATE TABLE regBooks (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Author VARCHAR(25) NOT NULL,
        Title VARCHAR(40) NOT NULL,
        Genre VARCHAR(20) NOT NULL,
        Price REAL NOT NULL
    )`);

    //? ChatGPT used to entry books with the same keyword for UAT purposes
    db.run(`INSERT INTO regBooks (Title, Author, Genre, Price) VALUES
    ('Pirates of the Caribbean', 'Johnny Depp', 'Action and Adventure', 12.99),
    ("The Pirate Hunter", "Richard Zacks", "Action and Adventure", 10.49),
    ("Pirate Latitudes", "Michael Crichton", "Action and Adventure", 9.99),
    ("Dune", "Frank Herbert", "Science fiction", 9.99),
    ("The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "Science fiction", 8.49),
    ("Catch-22", "Joseph Heller", "Satire", 7.99),
    ("Animal Farm", "George Orwell", "Satire", 6.99),
    ("Animal Dreams", "Barbara Kingsolver", "Drama", 9.99),
    ("Hamlet", "William Shakespeare", "Drama", 5.99),
    ("Death of a Salesman", "Arthur Miller", "Drama", 6.49),
    ("The Death Cure", "James Dashner", "Science fiction", 8.99),
    ("Death on the Nile", "Agatha Christie", "Mystery", 7.99),
    ("Death Note", "Tsugumi Ohba", "Mystery", 10.99),
    ("The Hobbit", "J.R.R. Tolkien", "Action and Adventure", 10.99),
    ("Treasure Island", "Robert Louis Stevenson", "Action and Adventure", 8.99),
    ("Pride and Prejudice", "Jane Austen", "Romance", 7.49),
    ("The Notebook", "Nicholas Sparks", "Romance", 8.99),
    ('The Lost Notebook', 'Agatha Christie', 'Mystery', 10.49),
    ('The Notebook of Doom', 'Troy Cummings', 'Horror', 8.49),
    ('The Notebook Trilogy', 'Nicholas Sparks', 'Romance', 12.99),
    ('The Haunted Notebook', 'R.L. Stine', 'Horror', 9.99),
    ("The Da Vinci Code", "Dan Brown", "Mystery", 9.49),
    ("Gone Girl", "Gillian Flynn", "Mystery", 10.99),
    ("It", "Stephen King", "Horror", 11.99),
    ("Dracula", "Bram Stoker", "Horror", 7.99),
    ("1922", "Stephen King", "Horror", 17.99),
    ("1922: Scenes from a Turbulent Year", "Nick Rennison", "History", 12.49)
    `);
});

// Closing the database
db.close();
