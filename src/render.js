/**
 * render.js
 * ---------
 * All canvas drawing lives here. These functions read state and draw it -
 * they never mutate game state or make decisions about game rules.
 * Kept separate from gameLogic.js on purpose: this file needs a browser
 * canvas to run, so it isn't unit tested the way gameLogic.js is - but
 * because it holds no logic, there's nothing here worth unit testing.
 */

import { GRID_SIZE } from './gameLogic.js';

export const COLORS = {
  background: '#0a0a0a',
  gridOuter: '#3a3a3a',
  gridInner: '#2a2a2a',
  mark: '#ffffff',
  activeBoardHighlight: 'rgba(80, 205, 120, 0.12)',
  wonBoardOverlayX: 'rgba(66, 135, 245, 0.18)',
  wonBoardOverlayO: 'rgba(245, 90, 90, 0.18)',
  menuButton: '#32cd32',
  menuButtonText: '#ffffff',
  titleText: '#ffffff',
  infoText: '#aaaaaa',
  winnerText: '#32cd32',
};

/** Draw a falling X or O "confetti" shape (used on menu/rules screens). */
export function drawFallingShape(ctx, shape) {
  ctx.lineWidth = 4;
  ctx.strokeStyle = shape.color;
  const { x, y, size } = shape;
  if (shape.shape === 'X') {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** Draw the full nested 9x9 game grid with marks, the active-board highlight, and won-board tinting. */
export function drawBoard(ctx, canvasSize, boards, activeBoard, winners) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const outerCell = canvasSize / GRID_SIZE;
  const innerCell = outerCell / GRID_SIZE;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const ox = j * outerCell;
      const oy = i * outerCell;

      // Highlight the sub-board the current player must play in.
      if (activeBoard && activeBoard[0] === i && activeBoard[1] === j) {
        ctx.fillStyle = COLORS.activeBoardHighlight;
        ctx.fillRect(ox, oy, outerCell, outerCell);
      }

      // Tint a sub-board once it has been won.
      const winner = winners[i][j];
      if (winner === 'X') {
        ctx.fillStyle = COLORS.wonBoardOverlayX;
        ctx.fillRect(ox, oy, outerCell, outerCell);
      } else if (winner === 'O') {
        ctx.fillStyle = COLORS.wonBoardOverlayO;
        ctx.fillRect(ox, oy, outerCell, outerCell);
      }

      // Outer grid line.
      ctx.strokeStyle = COLORS.gridOuter;
      ctx.lineWidth = 3;
      ctx.strokeRect(ox, oy, outerCell, outerCell);

      // Inner cells + marks.
      for (let k = 0; k < GRID_SIZE; k++) {
        for (let l = 0; l < GRID_SIZE; l++) {
          const cx = ox + l * innerCell;
          const cy = oy + k * innerCell;

          ctx.strokeStyle = COLORS.gridInner;
          ctx.lineWidth = 1;
          ctx.strokeRect(cx, cy, innerCell, innerCell);

          const mark = boards[i][j][k][l];
          const pad = innerCell * 0.2;
          if (mark === 'X') {
            ctx.strokeStyle = COLORS.mark;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cx + pad, cy + pad);
            ctx.lineTo(cx + innerCell - pad, cy + innerCell - pad);
            ctx.moveTo(cx + innerCell - pad, cy + pad);
            ctx.lineTo(cx + pad, cy + innerCell - pad);
            ctx.stroke();
          } else if (mark === 'O') {
            ctx.strokeStyle = COLORS.mark;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx + innerCell / 2, cy + innerCell / 2, innerCell / 2 - pad, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    }
  }
}

/** Draw a centered button and return its bounding box in canvas coordinates (for hit-testing). */
export function drawButton(ctx, canvasSize, label, centerY, width = 160, height = 50, font = '28px sans-serif') {
  const x = (canvasSize - width) / 2;
  const y = centerY - height / 2;

  ctx.fillStyle = COLORS.menuButton;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = COLORS.menuButtonText;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, canvasSize / 2, centerY);

  return { x, y, width, height };
}

export function drawTitle(ctx, canvasSize, text, y, font = '36px sans-serif') {
  ctx.fillStyle = COLORS.titleText;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvasSize / 2, y);
}

export function drawInfoLine(ctx, text, x, y, color = COLORS.infoText, font = '16px sans-serif') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x, y);
}

/** Semi-transparent overlay, used behind pause/winner screens. */
export function drawOverlay(ctx, canvasSize, alpha = 0.65) {
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
}
