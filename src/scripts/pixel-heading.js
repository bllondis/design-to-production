import { hash, reducedMotion, whenVisible } from "./motion.js";

// Headings keep their real text for assistive tech and swap a few letters into the pixel face.
// On first view the pixels "settle" from ~60% to ~10%, then a random letter flickers now and then.
const restingShare = 0.1;

document.querySelectorAll("[data-pixel]").forEach((heading, headingIndex) => {
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

  settle(restingShare, 1);
  if (reducedMotion.matches || heading.dataset.pixel === "static") return;

  whenVisible(
    heading,
    (visible) => {
      window.clearTimeout(timer);
      if (!visible) {
        settle(restingShare, 1);
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
    },
    0.4,
  );
});
