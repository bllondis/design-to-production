(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fieldCanvases = [...document.querySelectorAll("[data-system-field]")];
  const projectVideos = [...document.querySelectorAll("[data-project-video]")];
  const pixelHeadings = [...document.querySelectorAll("[data-pixel]")];
  const asciiCanvases = [...document.querySelectorAll("[data-ascii]")];
  const pixelDoors = [...document.querySelectorAll(".pixel-door")];

  const hash = (x, y = 0) => {
    const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  const whenVisible = (element, onChange, threshold = 0.2) => {
    if (!("IntersectionObserver" in window)) {
      onChange(true);
      return;
    }
    new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { threshold }).observe(element);
  };

  // The same signal field runs on the dark hero and the light contact section; "light" swaps the ink.
  fieldCanvases.forEach((canvas) => {
    const context = canvas.getContext("2d", { alpha: true });
    const field = canvas.parentElement;
    const fieldStatus = field.querySelector("[data-field-status]");
    const fieldToggle = field.querySelector("[data-field-toggle]");
    const fieldToggleLabel = field.querySelector("[data-field-toggle-label]");
    const light = canvas.dataset.systemField === "light";
    const fieldText = canvas.dataset.fieldText || "";
    const ink = light ? "5,6,7" : "244,245,240";
    const blocks = light
      ? ["rgba(49,94,211,0.16)", "rgba(150,165,40,0.18)", "rgba(222,82,60,0.14)"]
      : ["rgba(124,162,255,0.22)", "rgba(199,215,98,0.18)", "rgba(255,109,88,0.16)"];
    const accents = light
      ? ["rgba(49,94,211,0.95)", "rgba(112,124,18,0.95)", "rgba(206,66,44,0.92)"]
      : ["rgba(160,184,255,0.92)", "rgba(215,228,126,0.88)", "rgba(255,137,116,0.84)"];
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
    let visible = true;

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
      const shift = still ? 0 : Math.floor(time / 200);

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
            context.fillStyle = blocks[channel];
            context.fillRect(x, y, cellSize, cellSize);
          }

          if (signal > 1.02) {
            const channel = Math.floor(noise(column + 60, row + 30) * 3);
            context.fillStyle = accents[channel];
          } else {
            context.fillStyle = `rgba(${ink},${0.055 + signal * 0.34})`;
          }

          const glyph = fieldText
            ? fieldText[(((column + row * 5 - shift) % fieldText.length) + fieldText.length) % fieldText.length]
            : glyphs[glyphIndex];
          context.fillText(glyph, x + 1, y);
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
      } else if (visible) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    field.addEventListener("pointermove", (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    });

    field.addEventListener("pointerleave", () => {
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
    whenVisible(field, (isVisible) => {
      visible = isVisible;
      updateMotion();
    }, 0);
  });

  // Headings keep their real text for assistive tech and swap a few letters into a pixel face.
  pixelHeadings.forEach((heading, headingIndex) => {
    const text = heading.textContent.trim();
    const label = document.createElement("span");
    const visual = document.createElement("span");
    const letters = [];
    label.className = "visually-hidden";
    label.textContent = text;
    visual.setAttribute("aria-hidden", "true");

    text.split(" ").forEach((word, wordIndex) => {
      if (wordIndex) visual.append(" ");
      const wordElement = document.createElement("span");
      wordElement.className = "pixel-word";
      [...word].forEach((character) => {
        const letter = document.createElement("span");
        letter.textContent = character;
        wordElement.append(letter);
        if (/[a-z0-9]/i.test(character)) letters.push(letter);
      });
      visual.append(wordElement);
    });

    heading.replaceChildren(label, visual);

    const settle = (share, seed) => {
      letters.forEach((letter, index) => {
        letter.classList.toggle("is-pixel", hash(index + headingIndex * 31, seed) < share);
      });
    };
    let timer = 0;
    let played = false;

    settle(0.1, 1);
    if (reducedMotion.matches) return;

    whenVisible(heading, (visible) => {
      window.clearTimeout(timer);
      if (!visible) {
        settle(0.1, 1);
        return;
      }
      let step = played ? 12 : 0;
      played = true;
      const tick = () => {
        step += 1;
        if (step <= 12) {
          settle(0.6 - step * 0.042, step);
        } else {
          const letter = letters[Math.floor(Math.random() * letters.length)];
          letter?.classList.toggle("is-pixel");
          window.setTimeout(() => letter?.classList.toggle("is-pixel"), 450);
        }
        timer = window.setTimeout(tick, step < 12 ? 70 : 900);
      };
      tick();
    }, 0.4);
  });

  // Project screenshots rendered as a coloured glyph field. Light UI is inverted so ink and colour carry the shape.
  asciiCanvases.forEach((canvas) => {
    const context = canvas.getContext("2d");
    const sampler = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const ramp = " .'`,:;~-_+<>i!lI?|/\\()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*#MW&8%B@$";
    const image = new Image();
    const [focusX, focusY] = (canvas.dataset.asciiFocus || "0.5 0.5").split(" ").map(Number);
    const pointer = { x: -1000, y: -1000, active: false };
    let cells = [];
    let width = 0;
    let height = 0;
    let cellWidth = 9;
    let cellHeight = 14;
    let reveal = 0;
    let revealStart = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let visible = false;

    const build = () => {
      if (!image.complete || !image.naturalWidth) return;
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      cellWidth = width < 520 ? 8 : 10;
      cellHeight = width < 520 ? 13 : 16;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.textBaseline = "top";
      context.font = `${cellHeight - 2}px ${getComputedStyle(document.documentElement).getPropertyValue("--mono")}`;

      const columns = Math.ceil(width / cellWidth);
      const rows = Math.ceil(height / cellHeight);
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const sourceWidth = width / scale;
      const sourceHeight = height / scale;
      const sourceX = (image.naturalWidth - sourceWidth) * focusX;
      const sourceY = (image.naturalHeight - sourceHeight) * focusY;
      sampler.canvas.width = columns;
      sampler.canvas.height = rows;
      sampler.imageSmoothingQuality = "high";
      sampler.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, columns, rows);
      const pixels = sampler.getImageData(0, 0, columns, rows).data;

      cells = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const offset = (row * columns + column) * 4;
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const max = Math.max(red, green, blue);
          const min = Math.min(red, green, blue);
          const saturation = max ? (max - min) / max : 0;
          const ink = 1 - (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
          const coloured = saturation > 0.16;
          const density = Math.min(1, coloured ? 0.45 + saturation * 0.6 : 0.08 + Math.pow(ink, 0.7) * 1.05);
          const lift = coloured ? 255 / Math.max(max, 1) : 1;
          const tint = coloured
            ? `${Math.round(red * lift)},${Math.round(green * lift)},${Math.round(blue * lift)}`
            : "244,245,240";
          const noise = hash(column, row);
          cells.push({
            x: column * cellWidth,
            y: row * cellHeight,
            glyph: ramp[Math.min(ramp.length - 1, Math.floor(density * ramp.length) + Math.floor(noise * 3))],
            index: Math.floor(density * ramp.length),
            color: `rgba(${tint},${coloured ? 0.95 : (0.2 + density * 0.8).toFixed(2)})`,
            faint: `rgba(${tint},0.14)`,
            block: coloured
              ? `rgba(${tint},${(0.16 + saturation * 0.3).toFixed(2)})`
              : density > 0.5
                ? `rgba(244,245,240,${(density * 0.1).toFixed(2)})`
                : "",
            noise,
          });
        }
      }
      draw(performance.now());
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      const radius = Math.max(70, width * 0.12);
      for (const cell of cells) {
        if (cell.noise > reveal) {
          if (cell.noise < reveal + 0.18) {
            context.fillStyle = cell.faint;
            context.fillText(ramp[Math.floor(hash(cell.x, time) * ramp.length)], cell.x, cell.y);
          }
          continue;
        }
        if (cell.block) {
          context.fillStyle = cell.block;
          context.fillRect(cell.x, cell.y, cellWidth, cellHeight);
        }
        let glyph = cell.glyph;
        if (pointer.active && Math.hypot(cell.x - pointer.x, cell.y - pointer.y) < radius && cell.index > 1) {
          glyph = ramp[Math.floor(hash(cell.x + time * 0.004, cell.y) * ramp.length)];
        } else if (cell.index > 1 && hash(cell.noise, Math.floor(time / 140)) > 0.985) {
          glyph = ramp[Math.max(1, cell.index - 4 + Math.floor(hash(cell.x, time) * 8))] || glyph;
        }
        if (!glyph) continue;
        context.fillStyle = cell.color;
        context.fillText(glyph, cell.x, cell.y);
      }
    };

    const animate = (time) => {
      if (!revealStart) revealStart = time;
      reveal = Math.min(1, (time - revealStart) / 1400);
      if (time - lastFrame > 70) {
        draw(time);
        lastFrame = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const updateMotion = () => {
      window.cancelAnimationFrame(animationFrame);
      if (reducedMotion.matches) {
        reveal = 1;
        draw(0);
      } else if (visible) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    canvas.parentElement.addEventListener("pointermove", (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    });

    canvas.parentElement.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    image.addEventListener("load", () => {
      new ResizeObserver(build).observe(canvas);
      whenVisible(canvas, (isVisible) => {
        visible = isVisible;
        updateMotion();
      }, 0.05);
    });
    image.src = canvas.dataset.ascii;
    reducedMotion.addEventListener("change", updateMotion);
  });

  pixelDoors.forEach((door) => {
    door.addEventListener("click", () => {
      const open = door.getAttribute("aria-pressed") !== "true";
      door.setAttribute("aria-pressed", String(open));
      door.setAttribute("aria-label", open ? "Close the pixel door" : "Open the pixel door");
    });
  });

  // Scrolling nudges the doors ajar, like the hover peek, then they swing shut once the page settles.
  if (pixelDoors.length) {
    let settleTimer = 0;

    window.addEventListener(
      "scroll",
      () => {
        if (reducedMotion.matches) return;
        pixelDoors.forEach((door) => door.classList.add("is-peeking"));
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          pixelDoors.forEach((door) => door.classList.remove("is-peeking"));
        }, 150);
      },
      { passive: true },
    );
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
