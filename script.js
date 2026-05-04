const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const bookingForm = document.querySelector(".booking-form");
const formMessage = document.querySelector(".form-message");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navLinks.classList.toggle("show");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      menuToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("show");
    }
  });
}

if (bookingForm && formMessage) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Thanks! Your reservation request has been received.";
    bookingForm.reset();
  });
}
