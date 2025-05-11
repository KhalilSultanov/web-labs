window.addEventListener('DOMContentLoaded', function() {
    const formReviews = document.getElementById("form-reviews");
    const tableReviews = document.getElementById("reviews-table")

    let storedTable = localStorage.getItem("Data");
    if (storedTable) {
        tableReviews.innerHTML = storedTable;
    }

    formReviews.onsubmit = function (event){
        event.preventDefault();

        let formData = new FormData(event.target);

        let row = tableReviews.insertRow();
        row.insertCell().textContent = formData.get('name');
        row.insertCell().textContent = formData.get('nameProduct');
        row.insertCell().textContent = formData.get('city');
        row.insertCell().textContent = formData.get('comment');
        row.insertCell().textContent = formData.get('rating');

        localStorage.setItem("Data", tableReviews.innerHTML);
    }
});
