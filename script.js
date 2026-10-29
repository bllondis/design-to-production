(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.querySelector("[data-system-field]");
  const fieldStatus = document.querySelector("[data-field-status]");
  const projectVideos = [...document.querySelectorAll("[data-project-video]")];

  if (canvas) {
    const context = canvas.getContext("2d", { alpha: true });
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let animationFrame = 0;
    let lastFrame = 0;

    const seed = (index) => {
      const value = Math.sin(index * 9283.231 + 17.32) * 43758.5453;
      return value - Math.floor(value);
    };

    const buildNodes = () => {
      const mobile = width < 680;
      const count = mobile ? 17 : 32;
      const columns = mobile ? 4 : 7;

      nodes = Array.from({ length: count }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const rows = Math.ceil(count / columns);
        const baseX = width * (0.12 + (column / Math.max(columns - 1, 1)) * 0.78);
        const baseY = height * (0.12 + (row / Math.max(rows - 1, 1)) * 0.76);
        return {
          index,
          baseX: baseX + (seed(index) - 0.5) * width * 0.08,
          baseY: baseY + (seed(index + 90) - 0.5) * height * 0.12,
          phase: seed(index + 160) * Math.PI * 2,
          radius: index % 7 === 0 ? 3 : 1.7,
        };
      });

      if (fieldStatus) fieldStatus.textContent = `SIGNALS / ${count}`;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
      draw(0, true);
    };

    const positionNode = (node, time, still) => {
      const drift = still ? 0 : 8;
      let x = node.baseX + Math.cos(time * 0.0002 + node.phase) * drift;
      let y = node.baseY + Math.sin(time * 0.00017 + node.phase) * drift;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);

      if (pointer.active && distance < 150 && distance > 0) {
        const force = (1 - distance / 150) * 12;
        x += (dx / distance) * force;
        y += (dy / distance) * force;
      }

      return { x, y };
    };

    const draw = (time, still = false) => {
      context.clearRect(0, 0, width, height);
      const positions = nodes.map((node) => positionNode(node, time, still));

      context.lineWidth = 0.75;
      for (let index = 0; index < nodes.length; index += 1) {
        for (let target = index + 1; target < nodes.length; target += 1) {
          const a = positions[index];
          const b = positions[target];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 150) continue;

          const pointerDistance = Math.min(
            Math.hypot(a.x - pointer.x, a.y - pointer.y),
            Math.hypot(b.x - pointer.x, b.y - pointer.y),
          );
          const emphasis = pointer.active ? Math.max(0, 1 - pointerDistance / 220) : 0;
          context.strokeStyle = `rgba(29, 87, 255, ${0.08 + emphasis * 0.23})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      positions.forEach((position, index) => {
        const node = nodes[index];
        context.fillStyle = index % 7 === 0 ? "rgba(29, 87, 255, 0.95)" : "rgba(17, 19, 21, 0.5)";
        context.beginPath();
        context.arc(position.x, position.y, node.radius, 0, Math.PI * 2);
        context.fill();

        if (index % 8 === 0) {
          context.fillStyle = "rgba(17, 19, 21, 0.56)";
          context.font = '9px "SFMono-Regular", Consolas, monospace';
          context.fillText(`N${String(index + 1).padStart(2, "0")}`, position.x + 8, position.y - 7);
        }
      });
    };

    const animate = (time) => {
      if (time - lastFrame > 34) {
        draw(time);
        lastFrame = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const updateMotion = () => {
      window.cancelAnimationFrame(animationFrame);
      if (reducedMotion.matches) {
        draw(0, true);
      } else {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    canvas.addEventListener("pointermove", (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    });
    canvas.addEventListener("pointerleave", () => {
      pointer.active = false;
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
