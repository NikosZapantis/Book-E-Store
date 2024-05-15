//? Event listeners to redirect to the correct route each time [Displaying the proper function and inputs]
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
    });
});

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
    event.preventDefault(); //preventing from default actions of the browser

    const currTitle = document.getElementById("title").value.trim();
    const currAuthor = document.getElementById("author").value.trim();
    const currGenre = document.getElementById("genre").value.trim();
    const currPrice = document.getElementById("price").value.trim();

    //TODO: Checks for input fields to be all filled-in
    if(!currTitle || !currAuthor || !currGenre || !currPrice) {
        alert("⚠️ Fill-in all the input fields before submitting. ⚠️");
        
        setTimeout(() => {
            hideNotification(notification);
        }, 3000); //Hiding notification after 3 seconds

        return;
    }

    //TODO: Checks for price to contain only numbers and [.]
    if(/[^0-9.]/.test(currPrice)) {
        alert("❌ Provide a correct price for the book you want to list! ❌");

        return;
    }

    //? Clearing input fields after the user submits the book
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").selectedIndex = 0; // Resetting select to default
    document.getElementById("price").value = "";

    //Displaying notification
    showNotification("The book has been succesfully added!");
    setTimeout(() => {
        hideNotification(notification);

    }, 6000); //Hiding notification box after 6 seconds
}

//? Function to search by keyword to the database and display the results
function searchBookToDatabase() {
    const footer = document.querySelector('footer');

    //Starting the fade-out animation of the footer
    footer.style.opacity = '0';
        
    setTimeout(() => {
        footer.style.display = 'none';
    }, 700);

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
        showNotification("No results found for the specific keyword.");
        searchResultsBox.classList.remove("visible");
    }
}

//? Function to display properly the data found by the search
function displaySearchResults(res) {
    const searchResultsBox = document.getElementById("searchResultsBox");
    const searchResultsContent = document.getElementById("searchResultsContent");
    searchResultsContent.innerHTML = ""; //Clearing previous search results

    res.forEach((registerBook, index) => {
        const registerBookItem = document.createElement("div");
        registerBookItem.textContent = `${index + 1}. ${registerBook.title}`; //Displaying each book found with the keyword and besides it I put a numeric index like (1. / 2.)
        registerBookItem.classList.add("searchResultItem");

        //? Event listener for displaying book details on mouse hover with a small pop-up window
        registerBookItem.addEventListener("mouseenter", () => {
            displayBookDetailsOnHover(registerBook);
        });

        //? Event listener to hide book details on mouse leave and close the pop-up window
        registerBookItem.addEventListener("mouseleave", () => {
            closePopupOnMouseLeave();
        });

        searchResultsContent.appendChild(registerBookItem);
    });

    //Displaying the search results box
    searchResultsBox.classList.add("visible");
}

//? Function to display the specific's book details
function displayBookDetailsOnHover(registerBook) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${registerBook.title}</h2>
            <p><strong>Author:</strong> ${registerBook.author}</p>
            <p><strong>Genre:</strong> ${registerBook.genre}</p>
            <p><strong>Price:</strong> ${registerBook.price}€</p>
        </div>
    `;
    
    //? Event listeners for mouse hover and leave
    popup.addEventListener("mouseenter", () => {
        document.body.appendChild(popup);
    });
    popup.addEventListener("mouseleave", () => {
        popup.remove();
    });

    document.body.appendChild(popup);
}

//? Function to close the popup
function closePopupOnMouseLeave() {
    const popup = document.querySelector(".popup");
    if (popup) {
        popup.remove();
    }
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

//? Close button functionality for notification box
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('close')) {
        const notification = e.target.parentNode;
        hideNotification(notification);
    }
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
