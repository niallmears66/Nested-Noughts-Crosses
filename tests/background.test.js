import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BG_MIN_SIZE,
  BG_MAX_SIZE,
  computeSideRegions,
  createBgShape,
  stepBgShapes,
  drawBgShape,
} from '../src/background.js';
import { COLORS } from '../src/render.js';

// Returns the given numbers one after another, then repeats the last one.
function fakeRand(...values) {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
}

class FakeContext {
  constructor() {
    this.strokes = [];
    this.strokeStyle = null;
    this.lineWidth = null;
    this.globalAlpha = 1;
  }
  beginPath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  stroke() {
    this.strokes.push({ strokeStyle: this.strokeStyle, lineWidth: this.lineWidth, alpha: this.globalAlpha });
  }
}

// Regression guard for the point of this change: the menu confetti in
// main.js is at most ~50px, and these background shapes must be clearly bigger.
test('background shapes are larger than the menu confetti', () => {
  assert.ok(BG_MIN_SIZE >= 60);
  assert.ok(BG_MAX_SIZE > BG_MIN_SIZE);
});

test('computeSideRegions: a wide page gives a region on each side of the board', () => {
  const regions = computeSideRegions(1600, 500, 1100);
  assert.equal(regions.length, 2);
  assert.equal(regions[0].x0, 0);
  assert.ok(regions[0].x1 <= 500, 'left region must stop before the board');
  assert.ok(regions[1].x0 >= 1100, 'right region must start after the board');
  assert.equal(regions[1].x1, 1600);
});

test('computeSideRegions: only returns a side that is wide enough to hold a shape', () => {
  const regions = computeSideRegions(1000, 20, 700); // 20px left strip is too small
  assert.equal(regions.length, 1);
  assert.ok(regions[0].x0 >= 700);
});

test('computeSideRegions: falls back to the full width when neither side has room (phones)', () => {
  const regions = computeSideRegions(400, 10, 390);
  assert.deepEqual(regions, [{ x0: 0, x1: 400 }]);
});

test('createBgShape: starts just above the top of the page', () => {
  const shape = createBgShape(fakeRand(0.5), [{ x0: 0, x1: 400 }]);
  assert.equal(shape.y, -shape.size);
});

test('createBgShape: size is within the allowed range and stays inside the region', () => {
  const region = { x0: 900, x1: 1500 };
  for (const r of [0, 0.25, 0.5, 0.99]) {
    const shape = createBgShape(fakeRand(0, r), [region]);
    assert.ok(shape.size >= BG_MIN_SIZE && shape.size <= BG_MAX_SIZE);
    assert.ok(shape.x >= region.x0, 'must not start left of the region');
    assert.ok(shape.x + shape.size <= region.x1, 'must not extend right of the region');
  }
});

test('createBgShape: shrinks a shape to fit a region narrower than the maximum size', () => {
  const region = { x0: 0, x1: 80 };
  const shape = createBgShape(fakeRand(0, 0.99), [region]);
  assert.ok(shape.size <= 80);
  assert.ok(shape.x + shape.size <= 80);
});

test('createBgShape: picks both kinds depending on the random value', () => {
  const regions = [{ x0: 0, x1: 400 }];
  assert.equal(createBgShape(fakeRand(0, 0.5, 0.1, 0.5, 0.5), regions).kind, 'X');
  assert.equal(createBgShape(fakeRand(0, 0.5, 0.9, 0.5, 0.5), regions).kind, 'O');
});

test('createBgShape: can pick either region', () => {
  const regions = [{ x0: 0, x1: 200 }, { x0: 800, x1: 1000 }];
  assert.ok(createBgShape(fakeRand(0.1, 0.5), regions).x < 200);
  assert.ok(createBgShape(fakeRand(0.9, 0.5), regions).x >= 800);
});

test('stepBgShapes: moves shapes down by their speed without mutating the input', () => {
  const shapes = [{ kind: 'X', size: 80, x: 10, y: 100, speed: 2 }];
  const next = stepBgShapes(shapes, 1000);
  assert.equal(next[0].y, 102);
  assert.equal(shapes[0].y, 100, 'original array must not be mutated');
});

test('stepBgShapes: removes shapes that have fallen off the bottom of the page', () => {
  const shapes = [
    { kind: 'X', size: 80, x: 10, y: 999, speed: 2 },
    { kind: 'O', size: 80, x: 10, y: 500, speed: 2 },
  ];
  const next = stepBgShapes(shapes, 1000);
  assert.equal(next.length, 1);
  assert.equal(next[0].kind, 'O');
});

test('drawBgShape: X and O are drawn in their own colors', () => {
  const ctxX = new FakeContext();
  drawBgShape(ctxX, { kind: 'X', size: 100, x: 0, y: 0, speed: 1 });
  assert.equal(ctxX.strokes[0].strokeStyle, COLORS.markX);

  const ctxO = new FakeContext();
  drawBgShape(ctxO, { kind: 'O', size: 100, x: 0, y: 0, speed: 1 });
  assert.equal(ctxO.strokes[0].strokeStyle, COLORS.markO);
});

test('drawBgShape: shapes are semi-transparent and restore full opacity afterwards', () => {
  const ctx = new FakeContext();
  drawBgShape(ctx, { kind: 'X', size: 100, x: 0, y: 0, speed: 1 });
  assert.ok(ctx.strokes[0].alpha < 1, 'background shapes should not compete with the board');
  assert.equal(ctx.globalAlpha, 1, 'opacity must be reset so later drawing is unaffected');
});
