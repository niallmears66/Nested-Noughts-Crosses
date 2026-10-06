import test from 'node:test';
import assert from 'node:assert/strict';
import { computeCanvasTransform } from '../src/canvasSizing.js';

// Regression test for the "grey X/O marks" bug: the canvas's internal pixel
// buffer must scale with its actual on-screen size and device pixel ratio,
// not stay fixed at the logical coordinate size. If the buffer stays fixed
// while the element is displayed larger, the browser stretches (blurs) it.
test('canvas buffer grows to match a larger on-screen display size', () => {
  const logicalSize = 600;
  const result = computeCanvasTransform(900, 900, 1, logicalSize);
  assert.equal(result.bufferWidth, 900);
  assert.equal(result.bufferHeight, 900);
  assert.notEqual(
    result.bufferWidth,
    logicalSize,
    'buffer must not stay stuck at the logical size when displayed larger'
  );
});

test('canvas buffer scales up further on high-DPI (Retina-style) displays', () => {
  const result = computeCanvasTransform(600, 600, 2, 600);
  assert.equal(result.bufferWidth, 1200);
  assert.equal(result.bufferHeight, 1200);
});

test('on a standard-DPI display at exactly the logical size, buffer matches 1:1', () => {
  const result = computeCanvasTransform(600, 600, 1, 600);
  assert.equal(result.bufferWidth, 600);
  assert.equal(result.bufferHeight, 600);
  assert.equal(result.scaleX, 1);
  assert.equal(result.scaleY, 1);
});

test('scale factors let drawing code keep using logical coordinates regardless of actual resolution', () => {
  // A draw call at logical x=300 (half of 600) should land at the
  // horizontal center of the buffer no matter the display size or DPI.
  const { bufferWidth, scaleX } = computeCanvasTransform(900, 900, 2, 600);
  const logicalX = 300;
  const actualPixelX = logicalX * scaleX;
  assert.ok(
    Math.abs(actualPixelX - bufferWidth / 2) < 1,
    'logical center should map to the buffer center'
  );
});

test('handles a non-square display (different width and height) independently', () => {
  const result = computeCanvasTransform(800, 400, 1, 600);
  assert.equal(result.bufferWidth, 800);
  assert.equal(result.bufferHeight, 400);
  assert.notEqual(result.scaleX, result.scaleY);
});
