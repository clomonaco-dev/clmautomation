document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".pacchetti-slide");
  const dots = document.querySelectorAll(".pacchetti-dot");
  const prevBtn = document.querySelector(".pacchetti-showcase-prev");
  const nextBtn = document.querySelector(".pacchetti-showcase-next");

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
    if (autoSlide) {
      clearInterval(autoSlide);
    }
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

  const showcase = document.querySelector(".pacchetti-showcase");
  if (showcase) {
    showcase.addEventListener("mouseenter", stopAutoSlide);
    showcase.addEventListener("mouseleave", startAutoSlide);
  }

  updateSlider(0);
  startAutoSlide();
});