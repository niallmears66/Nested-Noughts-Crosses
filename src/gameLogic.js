/**
 * gameLogic.js
 * -------------
 * Pure game-state logic for Nested Noughts and Crosses, with zero DOM or
 * canvas dependency. Everything here is plain data in, plain data out, so
 * it can be unit tested without a browser.
 *
 * Board shape: boards[i][j][k][l]
 *   i, j = which of the 3x3 sub-boards (row, col)
 *   k, l = which cell within that sub-board (row, col)
 */

export const GRID_SIZE = 3;

/** Create a fresh, empty set of nested boards. */
export function createEmptyBoards() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('-'))
    )
  );
}

/**
 * Check a single 3x3 sub-board for a winner.
 * @param {string[][]} board - 3x3 array of '-', 'X', or 'O'
 * @returns {'X'|'O'|null}
 */
export function checkWinner(board) {
  // Rows
  for (let r = 0; r < GRID_SIZE; r++) {
    if (board[r][0] !== '-' && board[r][0] === board[r][1] && board[r][1] === board[r][2]) {
      return board[r][0];
    }
  }
  // Columns
  for (let c = 0; c < GRID_SIZE; c++) {
    if (board[0][c] !== '-' && board[0][c] === board[1][c] && board[1][c] === board[2][c]) {
      return board[0][c];
    }
  }
  // Diagonals
  if (board[0][0] !== '-' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] !== '-' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  return null;
}

/** True if every cell in a sub-board is filled (used to free up play when a board is full but undecided). */
export function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== '-'));
}

/**
 * Check the outer 3x3 grid of sub-board results for a winner.
 * Does NOT mutate any score state - caller decides what to do with the result.
 * @returns {'X'|'O'|null}
 */
export function checkGameWinner(boards) {
  const outer = boards.map((row) => row.map((subBoard) => checkWinner(subBoard)));
  return checkWinner(outer.map((row) => row.map((v) => v || '-')));
}

/**
 * Given a click inside a specific sub-board (0-2, 0-2) and the board state,
 * decide which sub-board the opponent must play in next.
 * @returns {[number, number] | null} null means "play anywhere"
 */
export function nextActiveBoard(boards, clickedSubRow, clickedSubCol) {
  const target = boards[clickedSubRow][clickedSubCol];
  if (checkWinner(target) || isBoardFull(target)) {
    return null; // that board is settled - opponent may play anywhere
  }
  return [clickedSubRow, clickedSubCol];
}

/**
 * Validate and apply a move. Returns a new boards array (does not mutate input)
 * plus metadata about what happened. Returns null moveResult if the move was illegal.
 *
 * @param {Array} boards
 * @param {number} subRow outer row 0-2
 * @param {number} subCol outer col 0-2
 * @param {number} cellRow inner row 0-2
 * @param {number} cellCol inner col 0-2
 * @param {'X'|'O'} player
 * @param {[number, number] | null} activeBoard - the sub-board the player is restricted to, or null for "any"
 */
export function applyMove(boards, subRow, subCol, cellRow, cellCol, player, activeBoard) {
  // Reject if restricted to a different sub-board.
  if (activeBoard && (activeBoard[0] !== subRow || activeBoard[1] !== subCol)) {
    return { boards, legal: false };
  }
  // Reject if that sub-board is already won.
  if (checkWinner(boards[subRow][subCol])) {
    return { boards, legal: false };
  }
  // Reject if the cell is already occupied.
  if (boards[subRow][subCol][cellRow][cellCol] !== '-') {
    return { boards, legal: false };
  }

  // Deep copy so callers can treat state as immutable.
  const next = boards.map((row) => row.map((sb) => sb.map((r) => [...r])));
  next[subRow][subCol][cellRow][cellCol] = player;

  const nextActive = nextActiveBoard(next, cellRow, cellCol);

  return { boards: next, legal: true, nextActiveBoard: nextActive };
}
