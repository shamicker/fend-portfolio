// Get the modal
var modal = document.getElementById('modal');

// Get the button that opens the modal
var project = document.getElementById("project");

// Get the <span> element that closes the modal
var dismiss = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
project.onclick = function() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
dismiss.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
