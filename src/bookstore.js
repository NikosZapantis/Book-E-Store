//? Event listeners to redirect to the correct route each time [Displaying the proper function and inputs]
document.getElementById("addBookBtn").addEventListener("click", function() {
    document.querySelector(".firstSelect-container").style.display = "none";
    document.getElementById("addBookSelected").style.display = "block"; 
});

document.getElementById("searchBookBtn").addEventListener("click", function() {
    document.querySelector(".firstSelect-container").style.display = "none";
    document.getElementById("searchBookSelected").style.display = "block";
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

    if(!currTitle || !currAuthor || !currGenre || !currPrice) {
        alert("⚠️ Fill-in all the input fields before submitting. ⚠️");
        
        setTimeout(() => {
            hideNotification(notification);
        }, 3000); // Hide notification after 3 seconds

        return;
    }

    if(/[^0-9.]/.test(currPrice)) {
        alert("❌ Provide a correct price for the book you want to list! ❌");

        return;
    }

    // Clearing input fields
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").selectedIndex = 0; // Resetting select to default
    document.getElementById("price").value = "";

    // Showing notification
    const notification = showNotification("The book has been succesfully added!");
    setTimeout(() => {
        hideNotification(notification);

    }, 6000); // Hiding notification box after 6 seconds
}

//? Function to search by keyword to the database and display the results
function searchBookToDatabase() {
    const footer = document.querySelector('footer'); // footer element

    // Starting the fade-out animation
    footer.style.opacity = '0';
        
    setTimeout(() => {
        footer.style.display = 'none';
    }, 700);

    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const searchResults = registerBooks.filter(registerBook => registerBook.title.toLowerCase().includes(searchInput));

    displaySearchResults(searchResults);

    const searchResultsBox = document.getElementById("searchResultsBox");
    if (searchResults.length > 0) {
        searchResultsBox.classList.add("visible");

        // Make closeButton visible
        closeButton.style.display = 'block';
    } else {
        searchResultsBox.classList.remove("visible");

        // Hide closeButton
        closeButton.style.display = 'none';
    }
}

//? Function to display properly the data found by the search
function displaySearchResults(res) {
    const searchResultsBox = document.getElementById("searchResultsBox");
    const searchResultsContent = document.getElementById("searchResultsContent");
    searchResultsContent.innerHTML = ""; // Clear previous search results

    res.forEach((registerBook, index) => {
        const registerBookItem = document.createElement("div");
        registerBookItem.textContent = `${index + 1}. ${registerBook.title}`; // Prefix with index number
        registerBookItem.classList.add("searchResultItem");

        // Add event listener for displaying book details on hover
        registerBookItem.addEventListener("mouseenter", () => {
            displayBookDetailsOnHover(registerBook);
        });

        // Add event listener to hide book details on mouse leave
        registerBookItem.addEventListener("mouseleave", () => {
            closePopupOnMouseLeave();
        });

        searchResultsContent.appendChild(registerBookItem);
    });

    // Display the search results box
    searchResultsBox.classList.add("visible");

    // Add event listener for the close button
    const closeButton = document.getElementById("searchResultsCloseBtn");
    closeButton.addEventListener("click", () => {
        searchResultsBox.classList.remove("visible");
    });
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
    
    // Adding event listeners for hover
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
    }, 500); // Waiting for the animation to complete before removing
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
