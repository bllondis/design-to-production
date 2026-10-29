(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.querySelector("[data-system-field]");
  const fieldStatus = document.querySelector("[data-field-status]");
  const fieldToggle = document.querySelector("[data-field-toggle]");
  const fieldToggleLabel = document.querySelector("[data-field-toggle-label]");
  const projectVideos = [...document.querySelectorAll("[data-project-video]")];

  if (canvas) {
    const context = canvas.getContext("2d", { alpha: true });
    const field = canvas.closest(".hero");
    const pointer = { x: -1000, y: -1000, active: false };
    const glyphs = "01+·/:*<>[]{}xyzuvw";
    let width = 0;
    let height = 0;
    let dpr = 1;
    let cellSize = 13;
    let columns = 0;
    let rows = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let paused = false;

    const noise = (x, y, offset = 0) => {
      const value = Math.sin(x * 12.9898 + y * 78.233 + offset * 37.719) * 43758.5453;
      return value - Math.floor(value);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cellSize = width < 680 ? 12 : 13;
      columns = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.textBaseline = "top";
      context.font = `${cellSize - 2}px ${getComputedStyle(document.documentElement).getPropertyValue("--mono")}`;
      if (fieldStatus) fieldStatus.textContent = `CELLS / ${columns * rows}`;
      draw(0, true);
    };

    const draw = (time, still = false) => {
      context.clearRect(0, 0, width, height);
      const phase = still ? 0 : time * 0.00035;
      const pointerRadius = Math.max(95, width * 0.085);

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellSize;
          const y = row * cellSize;
          const base = noise(column, row);
          const wave = (Math.sin(column * 0.21 + row * 0.09 + phase * 4) + 1) / 2;
          const vertical = (Math.cos(row * 0.18 - phase * 3 + base * 2) + 1) / 2;
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          const pointerForce = pointer.active ? Math.max(0, 1 - distance / pointerRadius) : 0;
          const signal = wave * 0.48 + vertical * 0.25 + base * 0.27 + pointerForce * 0.85;
          const glyphIndex = Math.floor((base + phase * 0.16 + pointerForce * 0.7) * glyphs.length) % glyphs.length;

          if (signal > 0.87 && base > 0.62) {
            const channel = Math.floor(noise(column + 40, row + 10) * 3);
            const fill = ["rgba(124,162,255,0.22)", "rgba(199,215,98,0.18)", "rgba(255,109,88,0.16)"][channel];
            context.fillStyle = fill;
            context.fillRect(x, y, cellSize, cellSize);
          }

          if (signal > 1.02) {
            const channel = Math.floor(noise(column + 60, row + 30) * 3);
            context.fillStyle = ["rgba(160,184,255,0.92)", "rgba(215,228,126,0.88)", "rgba(255,137,116,0.84)"][channel];
          } else {
            context.fillStyle = `rgba(244,245,240,${0.055 + signal * 0.34})`;
          }

          context.fillText(glyphs[glyphIndex], x + 1, y);
        }
      }
    };

    const animate = (time) => {
      if (time - lastFrame > 42) {
        draw(time);
        lastFrame = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const updateMotion = () => {
      window.cancelAnimationFrame(animationFrame);
      if (reducedMotion.matches || paused) {
        draw(lastFrame || 0, true);
      } else {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    field?.addEventListener("pointermove", (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    });

    field?.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    fieldToggle?.addEventListener("click", () => {
      paused = !paused;
      fieldToggle.setAttribute("aria-pressed", String(paused));
      if (fieldToggleLabel) fieldToggleLabel.textContent = paused ? "Resume signal" : "Pause signal";
      const icon = fieldToggle.querySelector("[aria-hidden='true']");
      if (icon) icon.textContent = paused ? "[ > ]" : "[ II ]";
      updateMotion();
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    reducedMotion.addEventListener("change", updateMotion);
    updateMotion();
  }

  if (projectVideos.length) {
    const updateVideoMotion = () => {
      projectVideos.forEach((video) => {
        if (reducedMotion.matches) {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.3 },
      );
      projectVideos.forEach((video) => videoObserver.observe(video));
    }

    reducedMotion.addEventListener("change", updateVideoMotion);
    updateVideoMotion();
  }
})();
