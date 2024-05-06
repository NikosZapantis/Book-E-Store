//? Event listeners to redirect to the correct route each time [Displaying the proper function and inputs]
document.getElementById("addBookBtn").addEventListener("click", function() {
    document.querySelector(".firstSelect-container").style.display = "none";
    document.getElementById("addBookSelected").style.display = "block"; 
});

document.getElementById("searchBookBtn").addEventListener("click", function() {
    document.querySelector(".firstSelect-container").style.display = "none";
    document.getElementById("searchBookSelected").style.display = "block";
});

//? Function for home button
function redirectToMainPage() {
    event.preventDefault(); //preventing from default actions of the browser
    location.reload(); //reloading the page
}

//? Function to add a new book to my SQLite db
function addBookToDatabase() {
    event.preventDefault(); //preventing from default actions of the browser

    // Showing notification
    const notification = showNotification("The book has been succesfully added!");
    setTimeout(() => {
        hideNotification(notification);
        
        setTimeout(() => {
            location.reload();
        }, 50);
    }, 6000); // Hiding notification box after 6 seconds
}

//? Function to search by keyword to the database and display the results
function searchBookToDatabase() {
    alert("Debug");
    //TODO:
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
