// Builds the sprite strips the moving characters play, from their door pictures in public/assets:
//   <name>-walk.png  for PixelWalk, PixelFlight and PixelBurrow: stand, one foot up, stand, the other foot up
//   <name>-fly.png   for PixelFlight: four wing positions of one flap, feet tucked away
//   <name>-bow.png   for PixelWalk's bow: arms up, arms wide, one arm across the middle, then standing again
//   <name>-hang.png  for PixelHang: the character in layers — body, body asleep, then each arm as upper arm and hand
// Run with `npm run sprites -w portfolio` after adding or redrawing a character. Uses the sharp that Astro installs.
//
// A strip is four square frames in a row on a transparent background, each the size of the picture,
// so the standing frame lines up exactly with the picture behind the door. The hang strip has six such frames,
// which stacked on top of each other make the standing picture again.
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const assets = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/assets");

// All positions are in source pixels.
// legs   the columns each leg occupies and the row where it starts; lift is how far a foot rises.
// bow    for characters that take a bow: each arm is cut along its `outline` and swung about its `shoulder`,
//        `reach` times its size, to the pair of angles (degrees, clockwise) each of `poses` gives.
// arms   for characters that hang: the left arm is cut along `outline` and split into upper arm and hand at row
//        `wrist`; the right arm is the same shape mirrored about column `axis`. For the sleeping body each eye,
//        a disc of `radius` about its centre in `eyes`, is filled with the colour found at `lids` and closed
//        with a curved line `stitch` pixels thick, in a much darker shade of the same.
// wing   for characters that fly: the folded wing is cut along `outline` and swung about `shoulder` to each of
//        `strokes` (degrees, clockwise), `spread` times its folded size. Where it lay, the side is covered with
//        feathers borrowed from the belly, `feathers` away, a little darker, or the colour at `body` where the
//        belly runs out. Everything from row `tuck` down, the feet, is folded away.
const characters = [
  {
    name: "pixel-cat",
    legs: [
      { from: 133, to: 197, top: 297 },
      { from: 197, to: 256, top: 297 },
    ],
    lift: 12,
  },
  {
    name: "pixel-pigeon",
    legs: [
      { from: 128, to: 184, top: 298 },
      { from: 192, to: 248, top: 298 },
    ],
    lift: 9,
    wing: {
      outline: [
        [124, 162],
        [150, 161],
        [172, 168],
        [188, 180],
        [194, 196],
        [192, 216],
        [184, 236],
        [170, 250],
        [150, 258],
        [122, 262],
        [100, 260],
        [84, 252],
        [75, 240],
        [77, 220],
        [84, 200],
        [95, 182],
        [108, 169],
      ],
      shoulder: [178, 186],
      feathers: [60, 30],
      body: [232, 244],
      strokes: [65, 12, -52, 12],
      spread: 1.12,
      tuck: 298,
    },
  },
  {
    name: "pixel-waffle",
    legs: [
      { from: 138, to: 176, top: 304 },
      { from: 205, to: 242, top: 304 },
    ],
    lift: 12,
    bow: {
      arms: [
        {
          outline: [
            [86, 236],
            [93, 240],
            [97, 252],
            [99, 262],
            [92, 268],
            [80, 288],
            [44, 288],
            [44, 254],
            [66, 244],
            [74, 238],
          ],
          shoulder: [92, 248],
        },
        {
          outline: [
            [297, 238],
            [306, 244],
            [328, 254],
            [330, 284],
            [296, 284],
            [290, 266],
            [292, 254],
            [293, 244],
          ],
          shoulder: [295, 252],
        },
      ],
      poses: [
        [86, -94],
        [35, -43],
        [-128, -62],
      ],
      reach: 1.3,
    },
  },
  {
    name: "pixel-sloth",
    arms: {
      outline: [
        [118, 204],
        [147, 206],
        [146, 212],
        [140, 220],
        [134, 230],
        [130, 240],
        [128, 250],
        [128, 258],
        [133, 262],
        [133, 300],
        [84, 300],
        [78, 262],
        [82, 226],
        [116, 204],
      ],
      wrist: 266,
      axis: 181.5,
      eyes: [
        [141, 142],
        [225, 142],
      ],
      lids: [
        [110, 135],
        [254, 135],
      ],
      radius: 27,
      stitch: 5,
    },
  },
  {
    name: "pixel-beet",
    legs: [
      { from: 144, to: 181, top: 300 },
      { from: 187, to: 226, top: 300 },
    ],
    lift: 14,
  },
];

// The door pictures sit on pure black; anything this dark and connected to the edge is background.
const backgroundCeiling = 26;

const cutOut = (pixels, width, height) => {
  const seen = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x += 1) stack.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y += 1) stack.push(y * width, y * width + width - 1);
  while (stack.length > 0) {
    const index = stack.pop();
    if (seen[index]) continue;
    const offset = index * 4;
    if (Math.max(pixels[offset], pixels[offset + 1], pixels[offset + 2]) > backgroundCeiling) continue;
    seen[index] = 1;
    pixels[offset + 3] = 0;
    const x = index % width;
    if (x > 0) stack.push(index - 1);
    if (x < width - 1) stack.push(index + 1);
    if (index >= width) stack.push(index - width);
    if (index < (height - 1) * width) stack.push(index + width);
  }
  return pixels;
};

// Slides one leg up inside its own columns: the foot rises, the leg above it shortens.
const liftLeg = (pixels, width, height, leg, lift) => {
  const frame = Buffer.from(pixels);
  for (let y = leg.top; y < height; y += 1) {
    for (let x = leg.from; x < leg.to; x += 1) {
      const target = (y * width + x) * 4;
      const source = ((y + lift) * width + x) * 4;
      if (y + lift < height) pixels.copy(frame, target, source, source + 4);
      else frame.fill(0, target, target + 4);
    }
  }
  return frame;
};

const inside = (outline, x, y) => {
  let within = false;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i, i += 1) {
    const [xi, yi] = outline[i];
    const [xj, yj] = outline[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) within = !within;
  }
  return within;
};

// The side under a lifted wing sits in its shade.
const underWingShade = 0.92;

// The average colour of the 5×5 block around a point, to paint over where the folded wing was.
const sample = (pixels, width, [x, y]) => {
  const sum = [0, 0, 0];
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const offset = ((y + dy) * width + x + dx) * 4;
      for (let channel = 0; channel < 3; channel += 1) sum[channel] += pixels[offset + channel];
    }
  }
  return sum.map((total) => Math.round(total / 25));
};

// Draws the part of the picture inside `limb.outline` onto the frame, turned about `limb.shoulder` and `spread`
// times its size. Each pixel of the frame looks back to where it sat before the turn.
const swing = (frame, pixels, width, rows, limb, degrees, spread) => {
  const angle = (-degrees * Math.PI) / 180;
  const [pivotX, pivotY] = limb.shoulder;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = (x - pivotX) / spread;
      const dy = (y - pivotY) / spread;
      const sourceX = Math.round(pivotX + dx * Math.cos(angle) - dy * Math.sin(angle));
      const sourceY = Math.round(pivotY + dx * Math.sin(angle) + dy * Math.cos(angle));
      if (sourceX < 0 || sourceX >= width || sourceY < 0 || sourceY >= rows) continue;
      if (!inside(limb.outline, sourceX, sourceY)) continue;
      const source = (sourceY * width + sourceX) * 4;
      if (pixels[source + 3] > 0) pixels.copy(frame, (y * width + x) * 4, source, source + 4);
    }
  }
  return frame;
};

// One frame of a flap: the body with its feet tucked and the wing swung to `stroke` about the shoulder.
const swingWing = (pixels, width, height, wing, stroke) => {
  const frame = Buffer.from(pixels);
  const plain = sample(pixels, width, wing.body);
  const [acrossBy, downBy] = wing.feathers;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (y >= wing.tuck) {
        frame.fill(0, offset, offset + 4);
      } else if (inside(wing.outline, x, y)) {
        const belly = ((y + downBy) * width + x + acrossBy) * 4;
        const borrowed = y + downBy < wing.tuck && pixels[belly + 3] > 0;
        const colour = borrowed ? [pixels[belly], pixels[belly + 1], pixels[belly + 2]] : plain;
        frame.set([...colour.map((channel) => Math.round(channel * underWingShade)), 255], offset);
      }
    }
  }

  return swing(frame, pixels, width, wing.tuck, wing, stroke, wing.spread);
};

// One frame of a bow: the arms taken off the picture and put back at the angles the pose gives.
const poseArms = (pixels, width, height, bow, pose) => {
  const frame = Buffer.from(pixels);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (bow.arms.some((arm) => inside(arm.outline, x, y)))
        frame.fill(0, (y * width + x) * 4, (y * width + x) * 4 + 4);
    }
  }
  bow.arms.forEach((arm, index) => swing(frame, pixels, width, height, arm, pose[index], bow.reach));
  return frame;
};

// A shut eye is drawn in the colour of its lid, darkened this far.
const lashShade = 0.3;

// The picture taken apart for hanging: the body without its arms, awake and asleep, and the four arm pieces.
const takeApart = (pixels, width, height, arms) => {
  const mirrored = arms.outline.map(([x, y]) => [2 * arms.axis - x, y]);
  const blank = () => Buffer.alloc(pixels.length);
  const body = Buffer.from(pixels);
  const pieces = [blank(), blank(), blank(), blank()];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const side = inside(arms.outline, x, y) ? 0 : inside(mirrored, x, y) ? 2 : -1;
      if (side < 0) continue;
      const offset = (y * width + x) * 4;
      pixels.copy(pieces[side + (y < arms.wrist ? 0 : 1)], offset, offset, offset + 4);
      body.fill(0, offset, offset + 4);
    }
  }

  const asleep = Buffer.from(body);
  arms.eyes.forEach(([centreX, centreY], index) => {
    const lid = sample(pixels, width, arms.lids[index]);
    const lash = lid.map((channel) => Math.round(channel * lashShade));
    for (let y = centreY - arms.radius; y <= centreY + arms.radius; y += 1) {
      for (let x = centreX - arms.radius; x <= centreX + arms.radius; x += 1) {
        if (Math.hypot(x - centreX, y - centreY) <= arms.radius) asleep.set([...lid, 255], (y * width + x) * 4);
      }
    }
    // A shut eye: a row of square stitches, low in the middle and turned up at the ends.
    for (let step = -3; step <= 3; step += 1) {
      const left = Math.round(centreX + (step - 0.5) * arms.stitch);
      const top = centreY + (1 - Math.round((step / 3) ** 2 * 2)) * arms.stitch;
      for (let y = top; y < top + arms.stitch; y += 1) {
        for (let x = left; x < left + arms.stitch; x += 1) asleep.set([...lash, 255], (y * width + x) * 4);
      }
    }
  });
  return [body, asleep, ...pieces];
};

const writeStrip = async (frames, width, height, output) => {
  await sharp({ create: { width: width * frames.length, height, channels: 4, background: "#0000" } })
    .composite(
      frames.map((input, index) => ({ input, raw: { width, height, channels: 4 }, left: index * width, top: 0 })),
    )
    .png({ palette: true, colours: 64, dither: 0 })
    .toFile(output);
  console.log(`${path.relative(process.cwd(), output)}: ${frames.length} frames of ${width}×${height}`);
};

for (const { name, legs, lift, wing, arms, bow } of characters) {
  const { data, info } = await sharp(path.join(assets, `${name}.jpg`))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const stand = cutOut(data, width, height);

  if (legs) {
    const steps = legs.map((leg) => liftLeg(stand, width, height, leg, lift));
    await writeStrip([stand, steps[0], stand, steps[1]], width, height, path.join(assets, `${name}-walk.png`));
  }

  if (wing) {
    const flap = wing.strokes.map((stroke) => swingWing(stand, width, height, wing, stroke));
    await writeStrip(flap, width, height, path.join(assets, `${name}-fly.png`));
  }

  if (bow) {
    const poses = bow.poses.map((pose) => poseArms(stand, width, height, bow, pose));
    await writeStrip([...poses, stand], width, height, path.join(assets, `${name}-bow.png`));
  }

  if (arms) {
    await writeStrip(takeApart(stand, width, height, arms), width, height, path.join(assets, `${name}-hang.png`));
  }
}
