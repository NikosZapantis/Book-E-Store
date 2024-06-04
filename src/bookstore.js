//? Function for home button
function redirectToMainPage() {
    event.preventDefault(); // preventing from default actions of the browser
    location.reload(); // reloading the page
}

//? Function to enable or disable properly the input fields
function toggleInputStatus() {
    const titleField = document.getElementById('title');
    const authorField = document.getElementById('author');
    const genreField = document.getElementById('genre');
    const priceField = document.getElementById('price');

    if (titleField.value.length > 0) {
        authorField.disabled = false;
    } else {
        authorField.disabled = true;
        genreField.disabled = true;
        priceField.disabled = true;
        return;
    }

    if (authorField.value.length > 0) {
        genreField.disabled = false;
    } else {
        genreField.disabled = true;
        priceField.disabled = true;
    }

    if (genreField.value !== "" && authorField.value.length > 0) {
        priceField.disabled = false;
    } else {
        priceField.disabled = true;
    }
}

//? Function to add a new book to my SQLite db
function addBookToDatabase() {
    const currTitle = document.getElementById("title").value.trim();
    const currAuthor = document.getElementById("author").value.trim();
    const currGenre = document.getElementById("genre").value.trim();
    const currPrice = document.getElementById("price").value.trim();

    //? Checks for input fields to be all filled-in
    if(!currTitle || !currAuthor || !currGenre || !currPrice) {
        showNotification("All fields are required!");
        return;
    }

    //? Checks for title and author [No symbols allowed]
    const acceptableTitleAuthorRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if(acceptableTitleAuthorRegex.test(currTitle) || acceptableTitleAuthorRegex.test(currAuthor)) {
        showNotification("Title and Author must not include any symbols.");
        event.preventDefault();
        return;
    }

    //? Checks for max characters on title and author [Acceptable limits]
    if(currTitle.length > 100) {
        showNotification("Title must be a maximum of 100 characters.");
        event.preventDefault();
        return;
    }
    if(currAuthor.length > 30) {
        showNotification("Author must be a maximum of 30 characters.");
        event.preventDefault();
        return;
    }

    //? Checks for price input field [validations]
    if(currTitle && currAuthor && currGenre) {
        if(isNaN(currPrice) || parseFloat(currPrice) <= 0) { // Checking if the current price provided is a number and if it's not or the user provided a negative number it notifies properly
            showNotification("Please enter a valid price!");
            return;
        }else {
            const validPriceRegex = /^\d+(\.\d{1,2})?$/;
            if(!validPriceRegex.test(currPrice)) { // Checking if the number provided as price has maximum 2 digits after the floating point
                showNotification("Only 2 digits after floating point are acceptable.");
                return;
            }
        }
    }

    //? Making a json from the inputs the user provided and then passing it into my db
    const currBookInfo = { Title: currTitle, Author: currAuthor, Genre: currGenre, Price: currPrice };
    console.log(currBookInfo);

    //? Posting the current book information into my db
    fetch('http://localhost:3000/regBooks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currBookInfo)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        showNotification("The book has been successfully added!");
    }).catch((error) => {
        console.error('Error: ', error);
        showNotification("An error occurred while adding the book. Please try again.");
    });

    //? Clearing input fields after the user submits the book
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").selectedIndex = 0;
    document.getElementById("price").value = "";

    //? Disabling all the input fields again
    document.getElementById("author").disabled = true;
    document.getElementById("genre").disabled = true;
    document.getElementById("price").disabled = true;
    event.preventDefault(); // Preventing the auto-refresh of the page after resetting the input fields [To avoid the display of the required field message pop-up]
}

//? Function to search by keyword to the database and display the results
function searchBookToDatabase() {
    event.preventDefault();

    //? Checking if the user provided at least 3 characters as a keyword to search
    const currSearch = document.getElementById("searchInput").value.trim().toLowerCase();

    if(currSearch.length < 2) {
        showNotification("Please include at least 2 characters as a keyword!");
        return;
    }

    //? Fetching book data, searched by keyword, from the server that hosts the db and displaying the results [+ Handling possible error]
    fetch(`http://localhost:3000/regBooks/${encodeURIComponent(currSearch)}`)
    .then(response => response.json())
    .then(searchResults => {
        displaySearchResults(searchResults, currSearch);
        
        const searchResultsBox = document.getElementById("searchResultsBox");
        if(searchResults.length > 0) {
            searchResultsBox.classList.add("visible");
        }else {
            showNotification("No results found for the specific keyword.");
            searchResultsBox.classList.remove("visible");
        }
    }).catch(error => {
        console.error('Error:', error);
        showNotification("Could not fetch data: Database not found or server error!");
    });
}

//? Function to display properly the data found by the search
function displaySearchResults(res, currSearch) {
    const searchResultsContent = document.getElementById("searchResultsContent");
    searchResultsContent.innerHTML = ""; // Cleaning previous search results

    const searchHeadline = document.createElement("h2");
    searchHeadline.textContent = `Search results for: "${currSearch}"`;
    searchResultsContent.appendChild(searchHeadline);

    res.forEach((registerBook, index) => {
        const registerBookItem = document.createElement("div");
        registerBookItem.classList.add("searchResultItem");

        const bookTitle = document.createElement("span");
        bookTitle.textContent = `${index + 1}. ${registerBook.Title}`;

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
        infoBtn.addEventListener("click", (event) => toggleBookInfo(registerBook, infoBtn, event));

        registerBookItem.appendChild(bookTitle);
        registerBookItem.appendChild(copyBtn);
        registerBookItem.appendChild(infoBtn);

        searchResultsContent.appendChild(registerBookItem);
    });
}

//? Function to copy specific's book details
function copyBookDetailsToClipboard(registerBook) {
    const bookDetails = `
        Title: ${registerBook.Title}
        Author: ${registerBook.Author}
        Genre: ${registerBook.Genre}
        Price: ${registerBook.Price}€
    `;

    navigator.clipboard.writeText(bookDetails).then(() => {
        showNotification("Book details copied to clipboard!");
    }).catch(err => {
        showNotification("Failed to copy book details. Please try again.");
    });
}

//? Function to display the specific's book information
//? ChatGpt & StackOverflow helped here to struct correct the logic behind of closing the pop-up when the same infoBtn was pressed twice
let currPopUp = null;
let currInfoBtn = null;

function toggleBookInfo(specificBook, infoBtn, event) {
    // Checking if the user pressed the same infoBtn and the currently displayed pop-up is referenced to this infoBtn    
    if (currInfoBtn === infoBtn && currPopUp) {
        currPopUp.remove();
        currPopUp = null;
        currInfoBtn = null;
        return;
    }

    if (currPopUp) {
        currPopUp.remove();
    }

    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${specificBook.Title}</h2>
            <p><strong>Author:</strong> ${specificBook.Author}</p>
            <p><strong>Genre:</strong> ${specificBook.Genre}</p>
            <p><strong>Price:</strong> ${specificBook.Price}€</p>
        </div>
    `;

    document.body.appendChild(popup);

    //? Updating current popup and info button references
    currPopUp = popup;
    currInfoBtn = infoBtn;

    //? Positioning the pop-up realtively to the cursor's position
    //TODO: Check if the title of the book is greater than 50 characters to display the pop-up left of the cursor
    const cursorX = event.clientX;
    const cursorY = event.clientY;
    const standardDiff = 15;
    if(specificBook.Title.length <= 50) {
        popup.style.left = `${cursorX + standardDiff}px`;
        popup.style.top = `${cursorY - popup.offsetHeight - standardDiff}px`;
    }else {
        popup.style.right = `${cursorX - popup.offsetWidth - standardDiff}px`;
        popup.style.top = `${cursorY - popup.offsetHeight - standardDiff}px`;
    }
}

//? Function to show the notification of the loading msg
let notifDur = 5000;

function showNotification(msg) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<span class="close">&times;</span>${msg}<div class="progressBar"></div>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.right = '20px';
    }, notifDur/500);

    // Setting up the progress bar
    const progressBar = notification.querySelector('.progressBar');
    setTimeout(() => {
        progressBar.style.width = '96%';
    }, notifDur/100); // Delay until the progressBar starts

    setTimeout(() => hideNotification(notification), notifDur);
    return notification;
}

//? Function to hide the notification
function hideNotification(notification) {
    notification.style.right = '-300px';

    setTimeout(() => {
        notification.remove();
    }, notifDur/100); //Waiting for the animation to complete before removing
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
        const searchResultsBox = document.getElementById('searchResultsBox');

        if(searchResultsBox.classList.contains('visible')) {
            searchResultsBox.classList.remove('visible');
            
            currPopUp.remove();
            currPopUp = null;
            currInfoBtn = null;
        }else {
            redirectToMainPage();
        }
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
