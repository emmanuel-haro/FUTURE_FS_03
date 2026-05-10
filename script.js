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
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formMessage.textContent = "Sending your booking details...";

    const formData = new FormData(bookingForm);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      date: formData.get("date")?.toString().trim(),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        formMessage.textContent = result.error || "Unable to submit booking. Please try again.";
        return;
      }

      formMessage.textContent = result.message || "Thanks! Your reservation request has been received.";
      bookingForm.reset();
    } catch (error) {
      console.error(error);
      formMessage.textContent = "There was a problem sending your booking. Please try again later.";
    }
  });
}
