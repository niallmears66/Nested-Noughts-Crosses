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
import { drawFallingShape, drawBoard, drawButton, drawTitle, drawInfoLine, drawOverlay, COLORS } from './render.js';
import { computeCanvasTransform } from './canvasSizing.js';

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

const RULE_TEXT = [
  'Objective:',
  'Win three smaller tic-tac-toe games in a row across the entire larger grid.',
  '',
  'Board Layout:',
  'The game is played on a 3x3 grid, where each cell contains another 3x3 grid.',
  '',
  'Gameplay:',
  "Wherever you place your symbol in a smaller grid decides which grid your",
  'opponent must play in next.',
  '',
  'Playing in Finished Grids:',
  'If sent to a smaller grid that is already won or full, you may play in',
  'any other available smaller grid instead.',
  '',
  'Winning:',
  'Win a smaller grid, then get three smaller-grid wins in a row to win the game.',
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

  drawTitle(ctx, CANVAS_SIZE, 'Nested Noughts & Crosses', 100, 'bold 32px sans-serif');
  const playBox = drawButton(ctx, CANVAS_SIZE, 'Play', CANVAS_SIZE / 2);
  const rulesBox = drawButton(ctx, CANVAS_SIZE, 'Rules', CANVAS_SIZE / 2 + 75);
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
  drawTitle(ctx, CANVAS_SIZE, 'Rules', titleY, 'bold 36px sans-serif');

  let y = titleY + 40;
  RULE_TEXT.forEach((line) => {
    if (line !== '') {
      drawInfoLine(ctx, line, 30, y, '#ffffff', '15px sans-serif');
    }
    y += 24;
  });

  const backBox = { x: 10, y: 10 + state.rulesScroll, width: 70, height: 24 };
  drawInfoLine(ctx, '< Back', backBox.x, backBox.y + 18, '#ffffff', '18px sans-serif');

  return { back: backBox };
}

function renderGame() {
  const g = state.game;
  const winners = g.boards.map((row) => row.map((sb) => checkWinner(sb)));
  const fulls = g.boards.map((row) => row.map((sb) => isBoardFull(sb)));
  drawBoard(ctx, CANVAS_SIZE, g.boards, g.activeBoard, winners, fulls);

  const hitboxes = {};

  if (g.paused) {
    drawOverlay(ctx, CANVAS_SIZE, 0.65);
    drawTitle(ctx, CANVAS_SIZE, 'Paused', 100, 'bold 40px sans-serif');
    drawTitle(ctx, CANVAS_SIZE, `Player ${g.turn}'s turn`, 150, '22px sans-serif');
    hitboxes.resume = drawButton(ctx, CANVAS_SIZE, 'Resume', 280);
    hitboxes.menu = drawButton(ctx, CANVAS_SIZE, 'Return to Menu', 350, 220);
    hitboxes.restart = drawButton(ctx, CANVAS_SIZE, 'Restart', 420);
  } else if (g.winner) {
    drawOverlay(ctx, CANVAS_SIZE, 0.7);
    drawTitle(ctx, CANVAS_SIZE, `Player ${g.winner} wins!`, CANVAS_SIZE / 2 - 80, 'bold 32px sans-serif');
    drawTitle(ctx, CANVAS_SIZE, `X: ${g.score.X}    O: ${g.score.O}`, CANVAS_SIZE / 2 - 30, '22px sans-serif');
    hitboxes.menu = drawButton(ctx, CANVAS_SIZE, 'Return to Menu', CANVAS_SIZE / 2 + 60, 220);
    hitboxes.playAgain = drawButton(ctx, CANVAS_SIZE, 'Play Again', CANVAS_SIZE / 2 + 130);
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

function handleClick(evt) {
  const rect = canvas.getBoundingClientRect();
  const x = ((evt.clientX - rect.left) / rect.width) * CANVAS_SIZE;
  const y = ((evt.clientY - rect.top) / rect.height) * CANVAS_SIZE;

  if (state.screen === 'menu') {
    if (inBox(x, y, lastMenuBoxes.play)) {
      startNewGame();
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
window.addEventListener('keydown', handleKeydown);

// ---- Main loop ----
function frame() {
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
