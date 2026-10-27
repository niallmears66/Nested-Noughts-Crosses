/**
 * background.js
 * -------------
 * Large X and O shapes falling down the page behind the game, in the
 * regions either side of the board.
 *
 * Same split as the rest of the project: the decisions (where shapes may
 * appear, how they are created, how they move) are plain functions that
 * can be unit tested; only startBackground() touches the real DOM.
 */

import { COLORS } from './render.js';

// Deliberately larger than the confetti on the menu screen (max ~50px).
export const BG_MIN_SIZE = 70;
export const BG_MAX_SIZE = 150;
export const BG_MAX_SHAPES = 16;

const SPAWN_CHANCE_PER_FRAME = 0.015;
const EDGE_MARGIN = 8;
const SHAPE_OPACITY = 0.55;

/**
 * Work out which horizontal strips of the page are free for falling shapes:
 * the space left of the board and the space right of it. If neither side is
 * wide enough to hold a shape (e.g. on a phone), fall back to the full width
 * so shapes still drift behind the board.
 *
 * @returns {{x0: number, x1: number}[]}
 */
export function computeSideRegions(viewportWidth, gameLeft, gameRight) {
  const regions = [];
  if (gameLeft - EDGE_MARGIN >= BG_MIN_SIZE) {
    regions.push({ x0: 0, x1: gameLeft - EDGE_MARGIN });
  }
  if (viewportWidth - gameRight - EDGE_MARGIN >= BG_MIN_SIZE) {
    regions.push({ x0: gameRight + EDGE_MARGIN, x1: viewportWidth });
  }
  if (regions.length === 0) {
    regions.push({ x0: 0, x1: viewportWidth });
  }
  return regions;
}

/**
 * Create one new shape just above the top of the page, inside one of the
 * given regions. `rand` is injected (instead of calling Math.random
 * directly) so tests can make this deterministic.
 */
export function createBgShape(rand, regions) {
  const region = regions[Math.floor(rand() * regions.length)];
  const regionWidth = region.x1 - region.x0;
  const size = Math.min(BG_MIN_SIZE + rand() * (BG_MAX_SIZE - BG_MIN_SIZE), regionWidth);
  return {
    kind: rand() < 0.5 ? 'X' : 'O',
    size,
    x: region.x0 + rand() * (regionWidth - size),
    y: -size,
    speed: 0.6 + rand() * 1.4,
  };
}

/** Move every shape down one frame and drop the ones that have left the page. Does not mutate the input. */
export function stepBgShapes(shapes, viewportHeight) {
  return shapes
    .map((shape) => ({ ...shape, y: shape.y + shape.speed }))
    .filter((shape) => shape.y < viewportHeight);
}

/** Draw one shape. X and O use the same blue/red as the marks on the board. */
export function drawBgShape(ctx, shape) {
  const { kind, x, y, size } = shape;
  const pad = size * 0.12;

  ctx.globalAlpha = SHAPE_OPACITY;
  ctx.lineWidth = Math.max(4, size * 0.07);
  ctx.lineCap = 'round';
  ctx.strokeStyle = kind === 'X' ? COLORS.markX : COLORS.markO;

  ctx.beginPath();
  if (kind === 'X') {
    ctx.moveTo(x + pad, y + pad);
    ctx.lineTo(x + size - pad, y + size - pad);
    ctx.moveTo(x + size - pad, y + pad);
    ctx.lineTo(x + pad, y + size - pad);
  } else {
    ctx.arc(x + size / 2, y + size / 2, size / 2 - pad, 0, Math.PI * 2);
  }
  ctx.stroke();

  ctx.globalAlpha = 1;
}

/**
 * Start the animation on a full-page canvas.
 * @param {HTMLCanvasElement} bgCanvas - fixed, full-viewport canvas sitting behind everything
 * @param {HTMLCanvasElement} gameCanvas - the game board, used to find the side regions
 */
export function startBackground(bgCanvas, gameCanvas) {
  // Respect the operating-system "reduce motion" setting.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = bgCanvas.getContext('2d');
  let shapes = [];
  let width = 0;
  let height = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = Math.round(width * dpr);
    bgCanvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);

    if (shapes.length < BG_MAX_SHAPES && Math.random() < SPAWN_CHANCE_PER_FRAME) {
      // Measured at spawn time so shapes follow the board if the window is resized.
      const rect = gameCanvas.getBoundingClientRect();
      shapes.push(createBgShape(Math.random, computeSideRegions(width, rect.left, rect.right)));
    }

    shapes = stepBgShapes(shapes, height);
    shapes.forEach((shape) => drawBgShape(ctx, shape));
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}
