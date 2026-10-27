/**
 * main.js
 * -------
 * Application shell: screen state machine, input handling, and the
 * animation loop. Delegates all rules decisions to gameLogic.js and all
 * drawing to render.js, so this file is mostly plumbing.
 */

import {
  GRID_SIZE,
  createEmptyBoards,
  checkWinner,
  isBoardFull,
  checkGameWinner,
  applyMove,
} from './gameLogic.js';
import {
  drawFallingShape,
  drawBoard,
  drawButton,
  drawPanel,
  drawTitle,
  drawInfoLine,
  drawOverlay,
  getButtonBox,
  COLORS,
  FONTS,
} from './render.js';
import { computeCanvasTransform } from './canvasSizing.js';
import { startBackground } from './background.js';

// All drawing math below uses this *logical* size - it has nothing to do
// with how many actual device pixels the canvas is rendered at. That's
// handled separately by resizeCanvasForDisplay(), which is what keeps
// lines crisp instead of blurry/grey on high-resolution or scaled-up
// displays (the CSS stretches the canvas element to fill the screen; without
// matching the internal pixel buffer to that size, the browser blurs the
// bitmap when stretching it, which is why marks were looking grey instead
// of solid white/colored). The actual sizing math is in canvasSizing.js so
// it can be unit tested without a real DOM.
const CANVAS_SIZE = 600;
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvasForDisplay() {
  const dpr = window.devicePixelRatio || 1;
  const { bufferWidth, bufferHeight, scaleX, scaleY } = computeCanvasTransform(
    canvas.clientWidth,
    canvas.clientHeight,
    dpr,
    CANVAS_SIZE
  );
  canvas.width = bufferWidth;
  canvas.height = bufferHeight;
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
}

resizeCanvasForDisplay();
window.addEventListener('resize', resizeCanvasForDisplay);

// Large falling X/O shapes in the page regions either side of the board.
startBackground(document.getElementById('bg-canvas'), canvas);

const RULE_TEXT = [
  'Objective:',
  'Win three smaller games in a row across the larger grid.',
  '',
  'Board Layout:',
  'A 3x3 grid of boards, each holding its own 3x3 grid.',
  '',
  'Gameplay:',
  'Where you place your symbol decides which smaller grid',
  'your opponent must play in next.',
  '',
  'Playing in Finished Grids:',
  'If sent to a grid that is already won or full, you may play',
  'in any other available smaller grid instead.',
  '',
  'Winning:',
  'Win three smaller grids in a row to win the game.',
  '',
  'Draw:',
  'If every cell is filled with no winner, the game is a draw.',
];

// ---- Single source of truth for all application state. ----
// (This replaces two separate, drifting score counters in the original code.)
const state = {
  screen: 'menu', // 'menu' | 'rules' | 'game'
  shapes: [],
  rulesScroll: 0,
  game: null, // populated by startNewGame()
};

// ---- Scoreboard (HTML panels either side of the board) ----
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
let shownScoreX = null;
let shownScoreO = null;

// Only touches the page when a number actually changes.
function updateScoreboard() {
  const score = state.game ? state.game.score : { X: 0, O: 0 };
  if (score.X !== shownScoreX) {
    scoreXEl.textContent = String(score.X);
    shownScoreX = score.X;
  }
  if (score.O !== shownScoreO) {
    scoreOEl.textContent = String(score.O);
    shownScoreO = score.O;
  }
}

function startNewGame(keepScore = { X: 0, O: 0 }) {
  state.game = {
    boards: createEmptyBoards(),
    activeBoard: null,
    turn: 'X',
    winner: null,
    paused: false,
    score: { ...keepScore },
  };
}

// ---- Falling shapes background animation (shared by menu + rules screens) ----
function spawnShapeMaybe() {
  if (Math.random() < 0.02) {
    const shape = Math.random() < 0.5 ? 'X' : 'O';
    state.shapes.push({
      shape,
      color: shape === 'X' ? '#4287f5' : '#ff4040',
      size: 20 + Math.random() * 30,
      x: Math.random() * (CANVAS_SIZE - 50),
      y: -50,
      speed: 1 + Math.random() * 2,
    });
  }
}

function updateShapes() {
  state.shapes.forEach((s) => (s.y += s.speed));
  state.shapes = state.shapes.filter((s) => s.y < CANVAS_SIZE);
}

function drawShapes() {
  state.shapes.forEach((s) => drawFallingShape(ctx, s));
}

// ---- Screen renderers. Each returns a map of {name: hitbox} for click handling. ----

function renderMenu() {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  spawnShapeMaybe();
  updateShapes();
  drawShapes();

  // Blue + red bar along the top of the card: X and O.
  drawPanel(ctx, { x: 50, y: 150, width: 500, height: 285 }, [COLORS.markX, COLORS.markO]);
  drawTitle(ctx, CANVAS_SIZE, 'Nested Noughts & Crosses', 202, FONTS.title);
  drawTitle(ctx, CANVAS_SIZE, 'Win three small boards in a row', 234, FONTS.subtitle, COLORS.subtitleText);

  const playBox = getButtonBox(CANVAS_SIZE, 298);
  const rulesBox = getButtonBox(CANVAS_SIZE, 364);
  drawButton(ctx, playBox, 'Play', { variant: 'primary', hovered: isHovered(playBox) });
  drawButton(ctx, rulesBox, 'Rules', { hovered: isHovered(rulesBox) });
  drawInfoLine(ctx, "Press 'P' to pause during a game", 10, CANVAS_SIZE - 15);

  return { play: playBox, rules: rulesBox };
}

function renderRules() {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  spawnShapeMaybe();
  updateShapes();
  drawShapes();

  const titleY = 50 + state.rulesScroll;
  drawTitle(ctx, CANVAS_SIZE, 'Rules', titleY, FONTS.title);

  let y = titleY + 40;
  RULE_TEXT.forEach((line) => {
    if (line !== '') {
      drawInfoLine(ctx, line, 30, y, '#ffffff', FONTS.body);
    }
    y += 24;
  });

  const backBox = { x: 10, y: 10 + state.rulesScroll, width: 70, height: 24 };
  drawInfoLine(ctx, '< Back', backBox.x, backBox.y + 18, '#ffffff', FONTS.body);

  return { back: backBox };
}

function renderGame() {
  const g = state.game;
  const winners = g.boards.map((row) => row.map((sb) => checkWinner(sb)));
  const fulls = g.boards.map((row) => row.map((sb) => isBoardFull(sb)));
  // Once someone has won there is nowhere left to play, so hide the green borders.
  drawBoard(ctx, CANVAS_SIZE, g.boards, g.activeBoard, winners, fulls, !g.winner);

  const hitboxes = {};

  if (g.paused) {
    drawOverlay(ctx, CANVAS_SIZE, 0.7);
    // The card takes the colour of the player whose turn it is.
    const accent = g.turn === 'X' ? COLORS.markX : COLORS.markO;
    drawPanel(ctx, { x: 150, y: 130, width: 300, height: 340 }, accent);
    drawTitle(ctx, CANVAS_SIZE, 'Paused', 178, FONTS.title);
    drawTitle(ctx, CANVAS_SIZE, `Player ${g.turn}'s turn`, 212, FONTS.subtitle, accent);

    hitboxes.resume = getButtonBox(CANVAS_SIZE, 275);
    hitboxes.menu = getButtonBox(CANVAS_SIZE, 341);
    hitboxes.restart = getButtonBox(CANVAS_SIZE, 407);
    drawButton(ctx, hitboxes.resume, 'Resume', { variant: 'primary', hovered: isHovered(hitboxes.resume) });
    drawButton(ctx, hitboxes.menu, 'Return to Menu', { hovered: isHovered(hitboxes.menu) });
    drawButton(ctx, hitboxes.restart, 'Restart', { hovered: isHovered(hitboxes.restart) });
  } else if (g.winner) {
    drawOverlay(ctx, CANVAS_SIZE, 0.7);
    const accent = g.winner === 'X' ? COLORS.markX : COLORS.markO;
    drawPanel(ctx, { x: 150, y: 155, width: 300, height: 290 }, accent);
    drawTitle(ctx, CANVAS_SIZE, `Player ${g.winner} wins!`, 205, FONTS.title);
    drawTitle(ctx, CANVAS_SIZE, `X: ${g.score.X}     O: ${g.score.O}`, 240, FONTS.subtitle, COLORS.subtitleText);

    hitboxes.playAgain = getButtonBox(CANVAS_SIZE, 306);
    hitboxes.menu = getButtonBox(CANVAS_SIZE, 372);
    drawButton(ctx, hitboxes.playAgain, 'Play Again', { variant: 'primary', hovered: isHovered(hitboxes.playAgain) });
    drawButton(ctx, hitboxes.menu, 'Return to Menu', { hovered: isHovered(hitboxes.menu) });
  } else {
    drawInfoLine(ctx, `Player ${g.turn}'s turn`, 10, CANVAS_SIZE - 15);
  }

  return hitboxes;
}

// ---- Click handling per screen ----

let lastMenuBoxes = {};
let lastRulesBoxes = {};
let lastGameBoxes = {};

function inBox(x, y, box) {
  return box && x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
}

// Mouse position in the canvas's own 600x600 coordinates, whatever size it is on screen.
function toCanvasCoords(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / rect.width) * CANVAS_SIZE,
    y: ((evt.clientY - rect.top) / rect.height) * CANVAS_SIZE,
  };
}

// Where the mouse is right now, used to highlight the button under it.
const pointer = { x: -1, y: -1 };

function isHovered(box) {
  return inBox(pointer.x, pointer.y, box);
}

function handleClick(evt) {
  const { x, y } = toCanvasCoords(evt);

  if (state.screen === 'menu') {
    if (inBox(x, y, lastMenuBoxes.play)) {
      // Keep the running tally so the scoreboard doesn't reset every time
      // you visit the menu.
      startNewGame(state.game ? state.game.score : undefined);
      state.screen = 'game';
    } else if (inBox(x, y, lastMenuBoxes.rules)) {
      state.rulesScroll = 0;
      state.screen = 'rules';
    }
    return;
  }

  if (state.screen === 'rules') {
    if (inBox(x, y, lastRulesBoxes.back)) {
      state.screen = 'menu';
    }
    return;
  }

  if (state.screen === 'game') {
    const g = state.game;

    if (g.paused) {
      if (inBox(x, y, lastGameBoxes.resume)) {
        g.paused = false;
      } else if (inBox(x, y, lastGameBoxes.menu)) {
        state.screen = 'menu';
      } else if (inBox(x, y, lastGameBoxes.restart)) {
        startNewGame(g.score);
      }
      return;
    }

    if (g.winner) {
      if (inBox(x, y, lastGameBoxes.menu)) {
        state.screen = 'menu';
      } else if (inBox(x, y, lastGameBoxes.playAgain)) {
        startNewGame(g.score);
      }
      return;
    }

    // Normal move: figure out which sub-board/cell was clicked.
    const outerCell = CANVAS_SIZE / GRID_SIZE;
    const innerCell = outerCell / GRID_SIZE;
    const subRow = Math.floor(y / outerCell);
    const subCol = Math.floor(x / outerCell);
    const cellRow = Math.floor((y % outerCell) / innerCell);
    const cellCol = Math.floor((x % outerCell) / innerCell);

    const result = applyMove(g.boards, subRow, subCol, cellRow, cellCol, g.turn, g.activeBoard);
    if (result.legal) {
      g.boards = result.boards;
      g.activeBoard = result.nextActiveBoard;
      g.turn = g.turn === 'X' ? 'O' : 'X';

      const winner = checkGameWinner(g.boards);
      if (winner) {
        g.winner = winner;
        g.score[winner] += 1;
      }
    }
  }
}

function handleKeydown(evt) {
  if (state.screen === 'game' && evt.key.toLowerCase() === 'p') {
    const g = state.game;
    if (!g.winner) {
      g.paused = !g.paused;
    }
  }
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('mousemove', (evt) => {
  const { x, y } = toCanvasCoords(evt);
  pointer.x = x;
  pointer.y = y;
});
canvas.addEventListener('mouseleave', () => {
  pointer.x = -1;
  pointer.y = -1;
});
window.addEventListener('keydown', handleKeydown);

// ---- Main loop ----
function frame() {
  updateScoreboard();
  if (state.screen === 'menu') {
    lastMenuBoxes = renderMenu();
  } else if (state.screen === 'rules') {
    lastRulesBoxes = renderRules();
  } else if (state.screen === 'game') {
    lastGameBoxes = renderGame();
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
