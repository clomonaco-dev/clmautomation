document.addEventListener("DOMContentLoaded", () => {
  const compareFrame = document.getElementById("compareFrame");
  const singleFrame = document.getElementById("singleFrame");
  const compareBox = document.getElementById("compareBox");
  const compareBefore = document.getElementById("compareBefore");
  const compareAfter = document.getElementById("compareAfter");
  const compareHandle = document.getElementById("compareHandle");
  const singlePreviewImage = document.getElementById("singlePreviewImage");
  const thumbs = document.querySelectorAll(".showcase-thumb");

  if (!compareBox || !compareBefore || !compareAfter || !compareHandle || !thumbs.length) {
    return;
  }

  let isDragging = false;
  let currentPercent = 50;

  function applyComparePosition(percent) {
    const rect = compareBox.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = Math.max(0, Math.min(width, (percent / 100) * width));

    compareBefore.style.clip = `rect(0px, ${x}px, ${height}px, 0px)`;
    compareAfter.style.clip = `rect(0px, ${width}px, ${height}px, ${x}px)`;
    compareHandle.style.left = `${x}px`;

    currentPercent = (x / width) * 100;
  }

  function setCompareFromClientX(clientX) {
    const rect = compareBox.getBoundingClientRect();
    let x = clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    applyComparePosition((x / rect.width) * 100);
  }

  function showCompare(beforeSrc, afterSrc) {
    compareBefore.src = beforeSrc;
    compareAfter.src = afterSrc;

    compareFrame.style.display = "block";
    singleFrame.style.display = "none";

    requestAnimationFrame(() => {
      applyComparePosition(currentPercent || 50);
    });
  }

  function showSingle(imageSrc) {
    singlePreviewImage.src = imageSrc;
    compareFrame.style.display = "none";
    singleFrame.style.display = "block";
  }

  // Drag classico
  compareHandle.addEventListener("mousedown", () => {
    isDragging = true;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    setCompareFromClientX(e.clientX);
  });

  // Movimento al solo passaggio del mouse dentro la sezione compare
  compareBox.addEventListener("mousemove", (e) => {
    if (compareFrame.style.display === "none") return;
    setCompareFromClientX(e.clientX);
  });

  // Touch
  compareHandle.addEventListener("touchstart", () => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !e.touches.length) return;
    setCompareFromClientX(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (compareFrame.style.display !== "none") {
      applyComparePosition(currentPercent);
    }
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const mode = thumb.getAttribute("data-mode");
      const before = thumb.getAttribute("data-before");
      const after = thumb.getAttribute("data-after");
      const image = thumb.getAttribute("data-image");

      thumbs.forEach((btn) => btn.classList.remove("is-active"));
      thumb.classList.add("is-active");

      if (mode === "compare" && before && after) {
        showCompare(before, after);
      } else if (mode === "single" && image) {
        showSingle(image);
      }
    });
  });

  applyComparePosition(50);
});