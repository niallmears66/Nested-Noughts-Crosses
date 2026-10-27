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

// Same font stack as the score panels in style.css, so canvas text and page
// text look like one design.
export const FONT_FAMILY = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const FONTS = {
  title: `700 28px ${FONT_FAMILY}`,
  subtitle: `400 16px ${FONT_FAMILY}`,
  button: `600 20px ${FONT_FAMILY}`,
  body: `400 15px ${FONT_FAMILY}`,
};

export const COLORS = {
  background: '#0a0a0a',
  // Previous values (#3a3a3a outer, #2a2a2a inner) were too close to the
  // #0a0a0a background to read clearly - bumped the brightness gap
  // significantly so both grid levels are easy to see at a glance.
  gridOuter: '#787878',
  gridInner: '#484848',
  // Very subtle alternating tint on sub-boards (checkerboard), so the 3x3
  // structure is visible even before you look closely at the grid lines.
  subBoardAlt: 'rgba(255, 255, 255, 0.035)',
  // X and O get distinct, saturated colors so they're never confused with
  // each other or with the grid lines - matching the blue/red split the
  // original pygame menu's falling shapes used.
  markX: '#4287f5',
  markO: '#ff4040',
  bigMarkX: '#4287f5',
  bigMarkO: '#ff4040',
  // Solid, bright green used as a border (not a fill) around every
  // sub-board the current player is allowed to click into.
  playableBorder: '#3ddc84',
  wonBoardOverlayX: 'rgba(66, 135, 245, 0.18)',
  wonBoardOverlayO: 'rgba(245, 90, 90, 0.18)',
  // Cards (menu, pause, winner) - same dark card look as the score panels.
  panelFill: '#141414',
  panelBorder: '#2a2a2a',
  // Buttons: one filled "primary" action per screen, the rest outlined.
  buttonPrimary: '#3ddc84',
  buttonPrimaryHover: '#6ae8a2',
  buttonPrimaryText: '#06210f',
  buttonSecondary: '#1c1c1c',
  buttonSecondaryHover: '#262626',
  buttonSecondaryBorder: '#3a3a3a',
  buttonSecondaryBorderHover: '#3ddc84',
  buttonSecondaryText: '#ffffff',
  titleText: '#ffffff',
  subtitleText: '#a0a0a0',
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
 * @param showPlayable set false to hide the green playable-board borders (e.g. once the game is won)
 */
export function drawBoard(ctx, canvasSize, boards, activeBoard, winners, fulls, showPlayable = true) {
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

      // Subtle checkerboard tint so the 3x3 sub-board structure reads at a
      // glance, independent of the (previously too-faint) grid lines.
      if ((i + j) % 2 === 1) {
        ctx.fillStyle = COLORS.subBoardAlt;
        ctx.fillRect(ox, oy, outerCell, outerCell);
      }

      // Which sub-boards the player may legally click into: either the one
      // specific board they're restricted to, or - when free to play
      // anywhere - every still-open board. Drawn as a border (below) rather
      // than a background fill, so it never washes out the grid lines.
      const isRestrictedToHere = activeBoard && activeBoard[0] === i && activeBoard[1] === j;
      const freeToPlayAnywhere = !activeBoard;
      const isPlayable = showPlayable && (isRestrictedToHere || freeToPlayAnywhere) && isOpen;

      // Tint a sub-board once it has been won.
      if (winner === 'X') {
        ctx.fillStyle = COLORS.wonBoardOverlayX;
        ctx.fillRect(ox, oy, outerCell, outerCell);
      } else if (winner === 'O') {
        ctx.fillStyle = COLORS.wonBoardOverlayO;
        ctx.fillRect(ox, oy, outerCell, outerCell);
      }

      // Outer grid line - thicker than inner lines so the 3x3 sub-board
      // boundaries are unmistakable even at a glance.
      ctx.strokeStyle = COLORS.gridOuter;
      ctx.lineWidth = 4;
      ctx.strokeRect(ox, oy, outerCell, outerCell);

      // Inner cells + marks - skipped once the sub-board is won, since the
      // big mark below replaces them.
      if (!winner) {
        for (let k = 0; k < GRID_SIZE; k++) {
          for (let l = 0; l < GRID_SIZE; l++) {
            const cx = ox + l * innerCell;
            const cy = oy + k * innerCell;

            ctx.strokeStyle = COLORS.gridInner;
            ctx.lineWidth = 1.5;
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

      // Big winning mark, drawn on top of the won sub-board.
      if (winner) {
        drawBigMark(ctx, winner, ox, oy, outerCell);
      }

      // Playable-board indicator: a bright inset border, drawn last so it
      // sits on top of the grid lines and leaves the background untouched.
      if (isPlayable) {
        const inset = 3;
        ctx.strokeStyle = COLORS.playableBorder;
        ctx.lineWidth = 4;
        ctx.strokeRect(ox + inset, oy + inset, outerCell - inset * 2, outerCell - inset * 2);
      }
    }
  }
}

export const BUTTON_WIDTH = 240;
export const BUTTON_HEIGHT = 52;
const BUTTON_RADIUS = 10;
const PANEL_RADIUS = 14;
const PANEL_ACCENT_HEIGHT = 4;

/**
 * Where a centered button sits. Kept separate from drawing so the game can
 * hit-test the mouse against the box (for the hover effect) before drawing.
 */
export function getButtonBox(canvasSize, centerY, width = BUTTON_WIDTH, height = BUTTON_HEIGHT) {
  return { x: (canvasSize - width) / 2, y: centerY - height / 2, width, height };
}

function traceRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Draw a rounded button.
 * @param box - from getButtonBox()
 * @param variant 'primary' (filled green, the main action) or 'secondary' (dark with an outline)
 * @param hovered true while the mouse is over it
 */
export function drawButton(ctx, box, label, { variant = 'secondary', hovered = false } = {}) {
  const primary = variant === 'primary';

  traceRoundedRect(ctx, box.x, box.y, box.width, box.height, BUTTON_RADIUS);
  if (primary) {
    ctx.fillStyle = hovered ? COLORS.buttonPrimaryHover : COLORS.buttonPrimary;
  } else {
    ctx.fillStyle = hovered ? COLORS.buttonSecondaryHover : COLORS.buttonSecondary;
  }
  ctx.fill();

  if (!primary) {
    ctx.strokeStyle = hovered ? COLORS.buttonSecondaryBorderHover : COLORS.buttonSecondaryBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.fillStyle = primary ? COLORS.buttonPrimaryText : COLORS.buttonSecondaryText;
  ctx.font = FONTS.button;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, box.x + box.width / 2, box.y + box.height / 2);
}

/**
 * Draw a dark rounded card with a coloured bar along its top edge - the same
 * look as the score panels beside the board.
 * @param accent one colour, or an array of colours to split the bar between
 *               (the menu uses blue + red for X and O)
 */
export function drawPanel(ctx, box, accent) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 8;
  traceRoundedRect(ctx, box.x, box.y, box.width, box.height, PANEL_RADIUS);
  ctx.fillStyle = COLORS.panelFill;
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = COLORS.panelBorder;
  ctx.lineWidth = 1;
  traceRoundedRect(ctx, box.x, box.y, box.width, box.height, PANEL_RADIUS);
  ctx.stroke();

  // Accent bar, clipped to the card so it follows the rounded corners.
  ctx.save();
  traceRoundedRect(ctx, box.x, box.y, box.width, box.height, PANEL_RADIUS);
  ctx.clip();
  const colors = Array.isArray(accent) ? accent : [accent];
  const segment = box.width / colors.length;
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(box.x + i * segment, box.y, segment, PANEL_ACCENT_HEIGHT);
  });
  ctx.restore();
}

export function drawTitle(ctx, canvasSize, text, y, font = FONTS.title, color = COLORS.titleText) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvasSize / 2, y);
}

export function drawInfoLine(ctx, text, x, y, color = COLORS.infoText, font = FONTS.body) {
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
