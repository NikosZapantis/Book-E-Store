//! DATA ENTRIES FOR UAT
const registerBooks = [
    { title: "Pirates of the Caribbean", author: "Johnny Depp", genre: "Action and Adventure", price: 12.99},
    { title: "The Pirate Hunter", author: "Nikos Zapantis", genre: "Mystery", price: 15.99},
    { title: "Pirate Latitudes", author: "Nikos Zapantis", genre: "Horror", price: 39.99}
];

//? Function for home button
function redirectToMainPage() {
    event.preventDefault(); //preventing from default actions of the browser
    location.reload(); //reloading the page
}

//? Function to add a new book to my SQLite db
function addBookToDatabase() {
    const currTitle = document.getElementById("title").value.trim();
    const currAuthor = document.getElementById("author").value.trim();
    const currGenre = document.getElementById("genre").value.trim();
    const currPrice = document.getElementById("price").value.trim();

    //TODO: Checks for input fields to be all filled-in
    if(!currTitle || !currAuthor || !currGenre || !currPrice) {
        return;
    }

    //TODO: Checks for price to contain only numbers and [.]
    if(isNaN(currPrice) || parseFloat(currPrice) <= 0) { //Checking if the current price provided is a number and if it's not or the user provided a negative number it notifies properly
        alert("❌ Provide a correct price for the book you want to list! ❌");
        return;
    }

    //? Clearing input fields after the user submits the book
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").selectedIndex = 0; // Resetting select to default
    document.getElementById("price").value = "";

    //Displaying notification
    const notification = showNotification("The book has been succesfully added!");
    setTimeout(() => {
        hideNotification(notification);
    }, 4000); //Hiding notification box after 4 seconds
}

//? Function to search by keyword to the database and display the results
function searchBookToDatabase() {
    const footer = document.querySelector('footer');

    //Starting the fade-out animation of the footer
    footer.style.opacity = '0';
        
    setTimeout(() => {
        footer.style.display = 'none';
    }, 700);

    //Checking if the user provided at least one letter as a keyword to search [This can be uncommented and have the feature of not allowing the blank search of the user]
    // const currSearch = document.getElementById("searchInput").value.trim();

    // if(!currSearch) {
    //     alert("⚠️ Provide a keyword before searching. ⚠️");
    //     return;
    // }

    //? Basically I convert the keyword the user provides to Lower Case and I'm searching in the "db" the books that includes the specific keyword in their title
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const searchResults = registerBooks.filter(registerBook => registerBook.title.toLowerCase().includes(searchInput));

    //? Calling the function to display the books I found in the db
    displaySearchResults(searchResults);

    //? Making the results box visible so the user can check each book's informations
    const searchResultsBox = document.getElementById("searchResultsBox");
    if (searchResults.length > 0) {
        searchResultsBox.classList.add("visible");
    } else {
        const notification = showNotification("No results found for the specific keyword.");
        setTimeout(() => {
            hideNotification(notification);
        }, 4000); //Hiding notification box after 4 seconds
        
        searchResultsBox.classList.remove("visible");
    }
}

//? Function to display properly the data found by the search
function displaySearchResults(res) {
    const searchResultsContent = document.getElementById("searchResultsContent");
    searchResultsContent.innerHTML = ""; //Clearing previous search results

    res.forEach((registerBook, index) => {
        const registerBookItem = document.createElement("div");
        registerBookItem.classList.add("searchResultItem");
        
        const bookTitle = document.createElement("span");
        bookTitle.textContent = `${index + 1}. ${registerBook.title}`;
        
        //? Copy Button so the user can easily copy all the information of a specific book
        const copyBtn = document.createElement("button");
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.classList.add("copyBtn");
        copyBtn.addEventListener("click", () => {
            copyBookDetailsToClipboard(registerBook);
        });

        //? Info button so the user can easily toggle the information pop-up for each title
        const infoBtn = document.createElement("button");
        infoBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
        infoBtn.classList.add("infoBtn");
        infoBtn.addEventListener("click", () => toggleBookInfo(registerBook, infoBtn));

        registerBookItem.appendChild(bookTitle);
        registerBookItem.appendChild(copyBtn);
        registerBookItem.appendChild(infoBtn);

        searchResultsContent.appendChild(registerBookItem);
    });
}

//? Function to copy specific's book details
function copyBookDetailsToClipboard(registerBook) {
    const bookDetails = `
        Title: ${registerBook.title}
        Author: ${registerBook.author}
        Genre: ${registerBook.genre}
        Price: ${registerBook.price}€
    `;

    navigator.clipboard.writeText(bookDetails).then(() => {
        const notification = showNotification("Book details copied to clipboard!");
        setTimeout(() => {
            hideNotification(notification);
        }, 4000); // Hiding notification box after 4 seconds
    }).catch(err => {
        const notification = showNotification("Failed to copy book details. Please try again.");
        setTimeout(() => {
            hideNotification(notification);
        }, 4000); // Hiding notification box after 4 seconds
    });
}

//? Function to display the specific's book information
//? ChatGpt & StackOverflow helped here to struct correct the logic behind of closing the pop-up when the same infoBtn was pressed twice
let currPopUp = null;
let currInfoBtn = null;

function toggleBookInfo(book, infoBtn) {
    //Checking if the user pressed the same infoBtn and the currently displayed pop-up is referenced to this infoBtn    
    if(currInfoBtn === infoBtn && currPopUp) {
        currPopUp.remove();
        currPopUp = null;
        currInfoBtn = null;
        return;
    }

    if(currPopUp) {
        currPopUp.remove();
    }

    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Price:</strong> ${book.price}€</p>
        </div>
    `;

    document.body.appendChild(popup);

    //? Updating current popup and info button references
    currPopUp = popup;
    currInfoBtn = infoBtn;
}

//? Function to show the notification of the loading msg
function showNotification(msg) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<span class="close">&times;</span>${msg}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.right = '20px';
    }, 100);
    return notification;
}

//? Function to hide the notification
function hideNotification(notification) {
    notification.style.right = '-300px';
    setTimeout(() => {
        notification.remove();
    }, 500); //Waiting for the animation to complete before removing
}

//? --------------------------- EVENT LISTENERS ---------------------------

//? Close button functionality for notification box
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('close')) {
        const notification = e.target.parentNode;
        hideNotification(notification);
    }
});

//? Event listeners to redirect to the correct route each time [Displaying the proper feature and it's inputs]
document.getElementById("addBookBtn").addEventListener("click", function() {
    document.querySelector(".firstSelect-container").style.display = "none";
    document.getElementById("addBookSelected").style.display = "block"; 
});

document.getElementById("searchBookBtn").addEventListener("click", function() {
    document.querySelector(".firstSelect-container").style.display = "none";
    document.getElementById("searchBookSelected").style.display = "block";
});

//? Event listener for the X button so the user can continue searching books
document.addEventListener('DOMContentLoaded', function() {
    const closeSearchResultsBtn = document.getElementById('closeSearchResultsBtn');
    closeSearchResultsBtn.addEventListener('click', function() {
        const searchResultsBox = document.getElementById('searchResultsBox');
        searchResultsBox.classList.remove('visible');

        //Closing the pop-up that is open when the user press the X button
        if(currPopUp) {
            currPopUp.remove();
            currPopUp = null;
            currInfoBtn = null;
        }
    });
});

//? Event listeners for keypads
document.addEventListener('keydown', function(e) {
    //? Escape keypad press [return to home page]
    if(e.key === 'Escape') {
        redirectToMainPage();
    }else if(e.key === 'Enter') {
        event.preventDefault();

        //Checking which div is open so I can redirect the Enter key in it's proper use each time
        var currDivOpen = document.getElementById('addBookSelected');
        if (currDivOpen.style.display !== 'none') {
            addBookToDatabase();
        }

        currDivOpen = document.getElementById('searchBookSelected');
        if (currDivOpen.style.display !== 'none') {
            searchBookToDatabase();
        }
    }
});
