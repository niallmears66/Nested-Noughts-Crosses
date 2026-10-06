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
  // X and O get distinct, saturated colors so they're never confused with
  // each other or with the grid lines - matching the blue/red split the
  // original pygame menu's falling shapes used.
  markX: '#4287f5',
  markO: '#ff4040',
  bigMarkX: '#4287f5',
  bigMarkO: '#ff4040',
  activeBoardHighlight: 'rgba(80, 205, 120, 0.18)',
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

/** Draw a single large X or O filling a box, used to mark a sub-board as won. */
function drawBigMark(ctx, mark, x, y, size) {
  const pad = size * 0.12;
  ctx.lineWidth = Math.max(4, size * 0.08);
  ctx.strokeStyle = mark === 'X' ? COLORS.bigMarkX : COLORS.bigMarkO;
  ctx.lineCap = 'round';
  if (mark === 'X') {
    ctx.beginPath();
    ctx.moveTo(x + pad, y + pad);
    ctx.lineTo(x + size - pad, y + size - pad);
    ctx.moveTo(x + size - pad, y + pad);
    ctx.lineTo(x + pad, y + size - pad);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2 - pad, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
}

/**
 * Draw the full nested 9x9 game grid with marks, the active-board highlight,
 * and a big X/O over any sub-board that's been won.
 *
 * @param activeBoard [row, col] the player is restricted to, or null for "play anywhere"
 * @param winners 3x3 array of 'X' | 'O' | null - winner of each sub-board
 * @param fulls 3x3 array of booleans - whether each sub-board is completely filled
 */
export function drawBoard(ctx, canvasSize, boards, activeBoard, winners, fulls) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const outerCell = canvasSize / GRID_SIZE;
  const innerCell = outerCell / GRID_SIZE;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const ox = j * outerCell;
      const oy = i * outerCell;
      const winner = winners[i][j];
      const isOpen = !winner && !(fulls && fulls[i][j]);

      // Highlight every sub-board the player may legally click into:
      // either the one specific board they're restricted to, or - when
      // free to play anywhere - every still-open board.
      const isRestrictedToHere = activeBoard && activeBoard[0] === i && activeBoard[1] === j;
      const freeToPlayAnywhere = !activeBoard;
      if ((isRestrictedToHere || freeToPlayAnywhere) && isOpen) {
        ctx.fillStyle = COLORS.activeBoardHighlight;
        ctx.fillRect(ox, oy, outerCell, outerCell);
      }

      // Tint a sub-board once it has been won.
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

      // Inner cells + marks - skipped once the sub-board is won, since the
      // big mark below replaces them.
      if (!winner) {
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
              ctx.strokeStyle = COLORS.markX;
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(cx + pad, cy + pad);
              ctx.lineTo(cx + innerCell - pad, cy + innerCell - pad);
              ctx.moveTo(cx + innerCell - pad, cy + pad);
              ctx.lineTo(cx + pad, cy + innerCell - pad);
              ctx.stroke();
            } else if (mark === 'O') {
              ctx.strokeStyle = COLORS.markO;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(cx + innerCell / 2, cy + innerCell / 2, innerCell / 2 - pad, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      // Big winning mark, drawn last so it sits clearly on top.
      if (winner) {
        drawBigMark(ctx, winner, ox, oy, outerCell);
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
