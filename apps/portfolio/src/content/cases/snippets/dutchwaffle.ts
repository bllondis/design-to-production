// Source excerpts shown in the DutchWaffle case, copied from github.com/bllondis/DutchWaffle.

export const themeTokens = `export const darkColors = {
  bg:         '#0B0F0E',
  surface:    '#17201F',
  fg:         '#F4F6F3',
  fgMute:     'rgba(244,246,243,0.38)',

  accent:     '#6EC7A9',
  caramel:    '#D9A55E',
  ok:         '#6EC7A9',
  bad:        '#E58E7C',
} as const;

export const spacing = {
  _1: 2, _2: 4, _3: 8, _4: 12, _5: 16, _6: 24, _7: 32, _8: 48, _9: 64,
} as const;`;

export const handoffRules = `- All styling via \`useTheme()\` + \`StyleSheet.create\`. No inline literals.
- Features import from \`@/shared\`, \`@/components\`, \`@/theme\` – never feature → feature.
- One default export per file, named after the file.`;

export const flashcardAcceptance = `## SCR-03 · Flashcard (study)

**Interactions**
- ✅ Tap card → 3D rotateY flip animation, 700ms, easing cubic-bezier(0.4,0,0.2,1)
- ✅ "Ken ik" → next card OR navigates to Quiz on last card
- ✅ "Lastig" → next card; phrase requeued after 3 more cards

**Animations**
- ✅ Flip is 60fps on iPhone 12, Pixel 6
- ✅ Reduce Motion: flip is instant (no rotateY)`;

export const flipCard = `// Cross-platform flip: opacity switches at 90° so neither face bleeds through.
// This replaces relying on backfaceVisibility (unreliable on web / Android).
const frontAnimStyle = useAnimatedStyle(() => ({
  transform: [{ perspective: 1200 }, { rotateY: \`\${rot.value}deg\` }],
  opacity: interpolate(rot.value, [89, 90], [1, 0], Extrapolation.CLAMP),
}));

const backAnimStyle = useAnimatedStyle(() => ({
  transform: [{ perspective: 1200 }, { rotateY: \`\${rot.value + 180}deg\` }],
  opacity: interpolate(rot.value, [89, 90], [0, 1], Extrapolation.CLAMP),
}));`;
