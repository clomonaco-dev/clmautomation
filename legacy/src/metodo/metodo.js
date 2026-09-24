document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".metodo-slide");
  const dots = document.querySelectorAll(".metodo-dot");
  const prevBtn = document.querySelector(".metodo-showcase-prev");
  const nextBtn = document.querySelector(".metodo-showcase-next");

  if (!slides.length) return;

  let currentIndex = 0;
  let autoSlide;

  function updateSlider(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });

    currentIndex = index;
  }

  function goNext() {
    const nextIndex = (currentIndex + 1) % slides.length;
    updateSlider(nextIndex);
  }

  function goPrev() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider(prevIndex);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlide = setInterval(() => {
      goNext();
    }, 5000);
  }

  function stopAutoSlide() {
    if (autoSlide) clearInterval(autoSlide);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      updateSlider(index);
      startAutoSlide();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goNext();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goPrev();
      startAutoSlide();
    });
  }

  const showcase = document.querySelector(".metodo-showcase");
  if (showcase) {
    showcase.addEventListener("mouseenter", stopAutoSlide);
    showcase.addEventListener("mouseleave", startAutoSlide);
  }

  updateSlider(0);
  startAutoSlide();
});

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("metodo3dCarousel");
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll(".metodo-3d-card"));
  const dots = document.querySelectorAll(".metodo-3d-dot");
  const prevBtn = document.querySelector(".metodo-3d-prev");
  const nextBtn = document.querySelector(".metodo-3d-next");

  let current = 0;
  let intervalId = null;

  function render3dCards() {
    cards.forEach((card, index) => {
      card.classList.remove("is-left", "is-center", "is-right", "is-hidden");

      if (index === current) {
        card.classList.add("is-center");
      } else if (index === (current - 1 + cards.length) % cards.length) {
        card.classList.add("is-left");
      } else if (index === (current + 1) % cards.length) {
        card.classList.add("is-right");
      } else {
        card.classList.add("is-hidden");
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === current);
    });
  }

  function next3dCard() {
    current = (current + 1) % cards.length;
    render3dCards();
  }

  function prev3dCard() {
    current = (current - 1 + cards.length) % cards.length;
    render3dCards();
  }

  function start3dAutoplay() {
    stop3dAutoplay();
    intervalId = setInterval(next3dCard, 5000);
  }

  function stop3dAutoplay() {
    if (intervalId) clearInterval(intervalId);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      next3dCard();
      start3dAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prev3dCard();
      start3dAutoplay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      current = index;
      render3dCards();
      start3dAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stop3dAutoplay);
  carousel.addEventListener("mouseleave", start3dAutoplay);

  render3dCards();
  start3dAutoplay();
});