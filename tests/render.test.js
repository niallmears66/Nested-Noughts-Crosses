import test from 'node:test';
import assert from 'node:assert/strict';
import { drawBoard, drawButton, drawPanel, getButtonBox, BUTTON_WIDTH, BUTTON_HEIGHT, COLORS } from '../src/render.js';
import { createEmptyBoards } from '../src/gameLogic.js';

const CANVAS_SIZE = 600;
const GRID_SIZE = 3;
const OUTER_CELL = CANVAS_SIZE / GRID_SIZE; // 200

/**
 * Minimal fake Canvas2D context: implements just enough of the real API for
 * render.js to run, and records every draw call so tests can inspect what
 * was actually drawn without a real browser.
 */
class FakeContext {
  constructor() {
    this.ops = [];
    this.fillStyle = null;
    this.strokeStyle = null;
    this.lineWidth = null;
    this.lineCap = null;
  }
  fillRect(x, y, w, h) {
    this.ops.push({ type: 'fillRect', fillStyle: this.fillStyle, x, y, w, h });
  }
  strokeRect(x, y, w, h) {
    this.ops.push({ type: 'strokeRect', strokeStyle: this.strokeStyle, lineWidth: this.lineWidth, x, y, w, h });
  }
  beginPath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  stroke() {
    this.ops.push({ type: 'stroke', strokeStyle: this.strokeStyle, lineWidth: this.lineWidth });
  }
  arcTo() {}
  closePath() {}
  save() {}
  restore() {}
  clip() {}
  fill() {
    this.ops.push({ type: 'fill', fillStyle: this.fillStyle });
  }
  fillText(text) {
    this.ops.push({ type: 'fillText', text, fillStyle: this.fillStyle });
  }
  setTransform() {}
}

function freshWinnersAndFulls() {
  return {
    winners: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)),
    fulls: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false)),
  };
}

// Regression test: a won sub-board must show a large X/O, not just a tinted
// background. Distinguished from the small in-cell marks by line width -
// the big mark is drawn thick enough to span the whole sub-board.
test('a won sub-board gets a large winning mark, not just a background tint', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();
  winners[0][0] = 'X';

  drawBoard(ctx, CANVAS_SIZE, boards, null, winners, fulls);

  const expectedBigMarkLineWidth = Math.max(4, OUTER_CELL * 0.08); // 16
  const bigMarkStroke = ctx.ops.find(
    (op) => op.type === 'stroke' && op.strokeStyle === COLORS.bigMarkX && op.lineWidth === expectedBigMarkLineWidth
  );
  assert.ok(bigMarkStroke, 'expected a thick stroke in the X winning-mark color sized to the whole sub-board');
});

test('a won sub-board also keeps its background tint', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();
  winners[2][1] = 'O';

  drawBoard(ctx, CANVAS_SIZE, boards, null, winners, fulls);

  const tint = ctx.ops.find((op) => op.type === 'fillRect' && op.fillStyle === COLORS.wonBoardOverlayO);
  assert.ok(tint, 'expected the O winner background tint to still be drawn');
});

// Regression test: when a player is free to play in any sub-board (sent to
// one that was already won/full), every open sub-board should highlight -
// not none, and not just one arbitrarily chosen one.
test('play-anywhere (activeBoard=null) highlights every open sub-board', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();

  drawBoard(ctx, CANVAS_SIZE, boards, null, winners, fulls);

  const highlights = ctx.ops.filter((op) => op.type === 'strokeRect' && op.strokeStyle === COLORS.playableBorder);
  assert.equal(highlights.length, GRID_SIZE * GRID_SIZE, 'all 9 open sub-boards should be highlighted');
});

test('play-anywhere does NOT highlight a sub-board that is already won', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();
  winners[0][0] = 'X';

  drawBoard(ctx, CANVAS_SIZE, boards, null, winners, fulls);

  const highlights = ctx.ops.filter((op) => op.type === 'strokeRect' && op.strokeStyle === COLORS.playableBorder);
  assert.equal(highlights.length, 8, 'the won sub-board should be excluded from the play-anywhere highlight');
});

test('being restricted to one sub-board highlights only that one', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();

  drawBoard(ctx, CANVAS_SIZE, boards, [1, 2], winners, fulls);

  const highlights = ctx.ops.filter((op) => op.type === 'strokeRect' && op.strokeStyle === COLORS.playableBorder);
  assert.equal(highlights.length, 1, 'only the restricted sub-board should be highlighted');

  const outerCell = CANVAS_SIZE / GRID_SIZE;
  const inset = 3; // border sits slightly inside the sub-board edge
  const expected = { x: 2 * outerCell + inset, y: 1 * outerCell + inset }; // sub-board [row=1, col=2]
  assert.equal(highlights[0].x, expected.x);
  assert.equal(highlights[0].y, expected.y);
});

// Regression test for the washed-out grid: the playable-board indicator must
// be a border, never a background fill. A fill across all 9 open sub-boards
// at the start of a game tinted the whole board green and made the grid
// lines hard to see.
test('playable-board indicator is a border only, never a background fill', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();

  drawBoard(ctx, CANVAS_SIZE, boards, null, winners, fulls);

  const fills = ctx.ops.filter((op) => op.type === 'fillRect' && op.fillStyle === COLORS.playableBorder);
  assert.equal(fills.length, 0, 'playable color must not be used to fill backgrounds');
});

// Regression test: X and O must use visually distinct colors.
test('X and O marks use different colors from each other', () => {
  assert.notEqual(COLORS.markX, COLORS.markO);
  assert.notEqual(COLORS.bigMarkX, COLORS.bigMarkO);
});

// Regression test: grid lines must have enough brightness contrast against
// the background to actually be visible - the original #2a2a2a inner /
// #3a3a3a outer lines against a #0a0a0a background were nearly invisible.
function hexToBrightness(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r + g + b) / 3;
}

test('grid lines are bright enough to read clearly against the background', () => {
  const backgroundBrightness = hexToBrightness(COLORS.background);
  const innerBrightness = hexToBrightness(COLORS.gridInner);
  const outerBrightness = hexToBrightness(COLORS.gridOuter);

  const MIN_CONTRAST = 40; // minimum brightness-value gap to be clearly visible
  assert.ok(
    innerBrightness - backgroundBrightness >= MIN_CONTRAST,
    `inner grid lines (${innerBrightness}) too close to background (${backgroundBrightness})`
  );
  assert.ok(
    outerBrightness - backgroundBrightness >= MIN_CONTRAST,
    `outer grid lines (${outerBrightness}) too close to background (${backgroundBrightness})`
  );
  assert.ok(
    outerBrightness > innerBrightness,
    'outer (sub-board) grid lines should be brighter than inner (cell) grid lines, for a clear visual hierarchy'
  );
});

// ---- Hiding the playable-board borders ----

test('showPlayable=false hides the green borders (used once the game has been won)', () => {
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();

  for (const activeBoard of [null, [1, 1]]) {
    const ctx = new FakeContext();
    drawBoard(ctx, CANVAS_SIZE, boards, activeBoard, winners, fulls, false);
    const borders = ctx.ops.filter((op) => op.type === 'strokeRect' && op.strokeStyle === COLORS.playableBorder);
    assert.equal(borders.length, 0);
  }
});

// ---- Buttons ----

const BOX = { x: 100, y: 200, width: 240, height: 52 };

function labelDrawn(ctx) {
  return ctx.ops.find((op) => op.type === 'fillText');
}

test('getButtonBox: centers the button horizontally and uses the standard size', () => {
  const box = getButtonBox(600, 300);
  assert.equal(box.width, BUTTON_WIDTH);
  assert.equal(box.height, BUTTON_HEIGHT);
  assert.equal(box.x + box.width / 2, 300, 'horizontally centered');
  assert.equal(box.y + box.height / 2, 300, 'vertically centered on the given y');
});

test('getButtonBox: every button on every screen defaults to the same size', () => {
  const a = getButtonBox(600, 100);
  const b = getButtonBox(600, 500);
  assert.equal(a.width, b.width);
  assert.equal(a.height, b.height);
});

test('primary button is filled with the primary color and has no outline', () => {
  const ctx = new FakeContext();
  drawButton(ctx, BOX, 'Play', { variant: 'primary' });
  assert.equal(ctx.ops.find((op) => op.type === 'fill').fillStyle, COLORS.buttonPrimary);
  assert.equal(ctx.ops.filter((op) => op.type === 'stroke').length, 0);
});

test('primary button gets lighter when hovered', () => {
  const ctx = new FakeContext();
  drawButton(ctx, BOX, 'Play', { variant: 'primary', hovered: true });
  assert.equal(ctx.ops.find((op) => op.type === 'fill').fillStyle, COLORS.buttonPrimaryHover);
});

test('secondary button is dark with an outline, and the outline lights up on hover', () => {
  const normal = new FakeContext();
  drawButton(normal, BOX, 'Rules');
  assert.equal(normal.ops.find((op) => op.type === 'fill').fillStyle, COLORS.buttonSecondary);
  assert.equal(normal.ops.find((op) => op.type === 'stroke').strokeStyle, COLORS.buttonSecondaryBorder);

  const hovered = new FakeContext();
  drawButton(hovered, BOX, 'Rules', { hovered: true });
  assert.equal(hovered.ops.find((op) => op.type === 'fill').fillStyle, COLORS.buttonSecondaryHover);
  assert.equal(hovered.ops.find((op) => op.type === 'stroke').strokeStyle, COLORS.buttonSecondaryBorderHover);
});

test('button draws its label text', () => {
  const ctx = new FakeContext();
  drawButton(ctx, BOX, 'Return to Menu');
  assert.equal(labelDrawn(ctx).text, 'Return to Menu');
});

// ---- Panels (the dark cards behind the menu / pause / winner text) ----

const CARD = { x: 150, y: 130, width: 300, height: 340 };

function accentBars(ctx) {
  // The accent bar is the only fillRect drawn by drawPanel.
  return ctx.ops.filter((op) => op.type === 'fillRect');
}

test('panel is filled with the panel color', () => {
  const ctx = new FakeContext();
  drawPanel(ctx, CARD, COLORS.markX);
  assert.ok(ctx.ops.some((op) => op.type === 'fill' && op.fillStyle === COLORS.panelFill));
});

test('panel with one accent colour draws a single bar across the top edge', () => {
  const ctx = new FakeContext();
  drawPanel(ctx, CARD, COLORS.markO);
  const bars = accentBars(ctx);
  assert.equal(bars.length, 1);
  assert.equal(bars[0].fillStyle, COLORS.markO);
  assert.equal(bars[0].x, CARD.x);
  assert.equal(bars[0].y, CARD.y);
  assert.equal(bars[0].w, CARD.width);
});

test('panel with two accent colours splits the bar between them (the menu uses X blue + O red)', () => {
  const ctx = new FakeContext();
  drawPanel(ctx, CARD, [COLORS.markX, COLORS.markO]);
  const bars = accentBars(ctx);
  assert.equal(bars.length, 2);
  assert.equal(bars[0].fillStyle, COLORS.markX);
  assert.equal(bars[1].fillStyle, COLORS.markO);
  assert.equal(bars[0].x + bars[0].w, bars[1].x, 'the two halves must meet in the middle');
  assert.equal(bars[0].w + bars[1].w, CARD.width);
});

// ---- Readability: every piece of text must be readable on its background ----
// Uses the WCAG contrast ratio; 4.5 is the usual minimum for normal-size text.

function luminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const MIN_CONTRAST = 4.5;

test('button text is readable on every button colour, including hover', () => {
  const pairs = [
    ['primary', COLORS.buttonPrimaryText, COLORS.buttonPrimary],
    ['primary hover', COLORS.buttonPrimaryText, COLORS.buttonPrimaryHover],
    ['secondary', COLORS.buttonSecondaryText, COLORS.buttonSecondary],
    ['secondary hover', COLORS.buttonSecondaryText, COLORS.buttonSecondaryHover],
  ];
  for (const [name, text, background] of pairs) {
    assert.ok(contrastRatio(text, background) >= MIN_CONTRAST, `${name} button text is too faint`);
  }
});

test('text on the cards is readable (titles, subtitles and the player-coloured turn text)', () => {
  const texts = {
    title: COLORS.titleText,
    subtitle: COLORS.subtitleText,
    'X turn text': COLORS.markX,
    'O turn text': COLORS.markO,
  };
  for (const [name, color] of Object.entries(texts)) {
    assert.ok(contrastRatio(color, COLORS.panelFill) >= MIN_CONTRAST, `${name} is too faint on the card`);
  }
});
