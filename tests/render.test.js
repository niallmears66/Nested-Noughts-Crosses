import test from 'node:test';
import assert from 'node:assert/strict';
import { drawBoard, COLORS } from '../src/render.js';
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
  fillText() {}
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

  const highlights = ctx.ops.filter((op) => op.type === 'fillRect' && op.fillStyle === COLORS.activeBoardHighlight);
  assert.equal(highlights.length, GRID_SIZE * GRID_SIZE, 'all 9 open sub-boards should be highlighted');
});

test('play-anywhere does NOT highlight a sub-board that is already won', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();
  winners[0][0] = 'X';

  drawBoard(ctx, CANVAS_SIZE, boards, null, winners, fulls);

  const highlights = ctx.ops.filter((op) => op.type === 'fillRect' && op.fillStyle === COLORS.activeBoardHighlight);
  assert.equal(highlights.length, 8, 'the won sub-board should be excluded from the play-anywhere highlight');
});

test('being restricted to one sub-board highlights only that one', () => {
  const ctx = new FakeContext();
  const boards = createEmptyBoards();
  const { winners, fulls } = freshWinnersAndFulls();

  drawBoard(ctx, CANVAS_SIZE, boards, [1, 2], winners, fulls);

  const highlights = ctx.ops.filter((op) => op.type === 'fillRect' && op.fillStyle === COLORS.activeBoardHighlight);
  assert.equal(highlights.length, 1, 'only the restricted sub-board should be highlighted');

  const outerCell = CANVAS_SIZE / GRID_SIZE;
  const expected = { x: 2 * outerCell, y: 1 * outerCell }; // sub-board [row=1, col=2]
  assert.equal(highlights[0].x, expected.x);
  assert.equal(highlights[0].y, expected.y);
});

// Regression test: X and O must use visually distinct colors.
test('X and O marks use different colors from each other', () => {
  assert.notEqual(COLORS.markX, COLORS.markO);
  assert.notEqual(COLORS.bigMarkX, COLORS.bigMarkO);
});
