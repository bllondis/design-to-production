import { reducedMotion } from "./motion.js";

const doors = [...document.querySelectorAll("[data-pixel-door]")];

doors.forEach((door) => {
  door.addEventListener("click", () => {
    const open = door.getAttribute("aria-pressed") !== "true";
    door.setAttribute("aria-pressed", String(open));
    door.setAttribute("aria-label", open ? "Close the pixel door" : "Open the pixel door");
  });
});

// While the page scrolls the doors flap like the hover peek, then fall shut once scrolling stops.
// Doors marked data-pixel-door="still" (e.g. specimens in the docs) ignore scrolling.
const flappers = doors.filter((door) => door.dataset.pixelDoor !== "still");

if (flappers.length) {
  let settleTimer = 0;

  window.addEventListener(
    "scroll",
    () => {
      if (reducedMotion.matches) return;
      flappers.forEach((door) => door.classList.add("is-peeking"));
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        flappers.forEach((door) => door.classList.remove("is-peeking"));
      }, 150);
    },
    { passive: true },
  );
}
