/**
 * canvasSizing.js
 * ----------------
 * Pure math for sizing a canvas's internal pixel buffer to match its real
 * on-screen size and the display's pixel density.
 *
 * Why this exists: a canvas has two independent sizes - its CSS display
 * size (how big it looks on screen) and its internal pixel buffer (how
 * many actual pixels it draws into). If the buffer is smaller than the
 * display size, the browser stretches the bitmap to fill the larger area,
 * which blurs sharp lines into a grey smear - this was the root cause of
 * X/O marks appearing grey instead of crisp white/colored.
 *
 * Kept separate from main.js (which touches the real DOM) so the sizing
 * math itself can be unit tested.
 */

/**
 * @param {number} displayWidth - canvas's CSS width in pixels (canvas.clientWidth)
 * @param {number} displayHeight - canvas's CSS height in pixels (canvas.clientHeight)
 * @param {number} devicePixelRatio - e.g. 1 for standard displays, 2+ for high-DPI/Retina
 * @param {number} logicalSize - the fixed coordinate space all draw calls use (e.g. 600)
 * @returns {{ bufferWidth: number, bufferHeight: number, scaleX: number, scaleY: number }}
 */
export function computeCanvasTransform(displayWidth, displayHeight, devicePixelRatio, logicalSize) {
  const bufferWidth = Math.round(displayWidth * devicePixelRatio);
  const bufferHeight = Math.round(displayHeight * devicePixelRatio);
  // scaleX/scaleY are what gets passed to ctx.setTransform() so that drawing
  // code can keep using logicalSize-based coordinates (0..600) regardless of
  // the actual buffer resolution.
  const scaleX = (devicePixelRatio * displayWidth) / logicalSize;
  const scaleY = (devicePixelRatio * displayHeight) / logicalSize;
  return { bufferWidth, bufferHeight, scaleX, scaleY };
}
