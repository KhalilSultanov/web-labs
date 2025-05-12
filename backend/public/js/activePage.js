let currentLocation = window.location.href;
let navigationLinks = document.querySelectorAll('.menu a');


navigationLinks.forEach(function (link) {
    if (link.href === currentLocation) {
        link.classList.add('active');
    }
});