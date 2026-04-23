document.addEventListener("DOMContentLoaded", () => {
  // MENU MOBILE
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      console.log("menu toggle:", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // DROPDOWN TEMPLATE
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
  const dropdownMenu = document.querySelector(".nav-dropdown-menu");

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("open");
    });
  }

  // FORM CONTATTI
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("success-message");

  if (form && successMessage) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {};

      formData.forEach((value, key) => {
        data[key] = value;
      });

      data["form-name"] = "contatti";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: Object.keys(data)
            .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&"),
        });

        if (!response.ok) {
          throw new Error("Invio fallito");
        }

        form.reset();
        successMessage.classList.add("show");

        setTimeout(() => {
          successMessage.classList.remove("show");
        }, 4000);
      } catch (error) {
        alert("Errore nell'invio del messaggio. Riprova.");
        console.error(error);
      }
    });
  }

  // RECENSIONI GOOGLE
  const reviewsSummary = document.getElementById("reviews-summary");
  const reviewsGrid = document.getElementById("reviews-grid");
  const reviewsLink = document.getElementById("reviews-link");

  if (reviewsSummary && reviewsGrid && reviewsLink) {
    fetch("/.netlify/functions/google-reviews")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(data.error || "Errore nel caricamento recensioni");
        }

        const starsBig = "★".repeat(Math.round(data.rating || 0));

        reviewsSummary.innerHTML = `
          <div class="review-score-card">
            <div class="review-score-main">
              <div class="review-score">${data.rating}</div>
              <div class="review-stars-big">${starsBig}</div>
            </div>
            <div class="review-count">${data.userRatingCount} recensioni Google</div>
          </div>
        `;

        reviewsLink.href = data.googleMapsUri || "#";

        const reviews = data.reviews || [];

        reviewsGrid.innerHTML = reviews
          .map(
            (review) => `
              <article class="review-card">
                <div>
                  <div class="review-card-top">
                    <div class="review-author">${review.author}</div>
                    <div class="review-stars">${"★".repeat(review.rating)}</div>
                  </div>
                  <p class="review-text">${review.text}</p>
                </div>
                <div class="review-meta">${review.publishedAt}</div>
              </article>
            `
          )
          .join("");

        // Duplica le card per effetto scorrimento continuo desktop
        if (window.innerWidth > 768 && reviews.length > 0) {
          reviewsGrid.innerHTML += reviewsGrid.innerHTML;
          reviewsGrid.style.animation = "reviewsMarquee 35s linear infinite";
        }
      })
      .catch((error) => {
        reviewsSummary.textContent = "Non è stato possibile caricare le recensioni.";
        reviewsGrid.innerHTML = "";
        console.error(error);
      });
  }
});