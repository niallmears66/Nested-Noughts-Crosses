import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createEmptyBoards,
  checkWinner,
  isBoardFull,
  checkGameWinner,
  nextActiveBoard,
  applyMove,
} from '../src/gameLogic.js';

function emptySubBoard() {
  return [
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-'],
  ];
}

test('checkWinner: empty board has no winner', () => {
  assert.equal(checkWinner(emptySubBoard()), null);
});

test('checkWinner: row win', () => {
  const b = emptySubBoard();
  b[0] = ['X', 'X', 'X'];
  assert.equal(checkWinner(b), 'X');
});

test('checkWinner: column win', () => {
  const b = emptySubBoard();
  b[0][1] = b[1][1] = b[2][1] = 'O';
  assert.equal(checkWinner(b), 'O');
});

test('checkWinner: diagonal win', () => {
  const b = emptySubBoard();
  b[0][0] = b[1][1] = b[2][2] = 'X';
  assert.equal(checkWinner(b), 'X');
});

test('checkWinner: anti-diagonal win', () => {
  const b = emptySubBoard();
  b[0][2] = b[1][1] = b[2][0] = 'O';
  assert.equal(checkWinner(b), 'O');
});

// Regression test: catches the classic "chained comparison" typo
// (row[0] == row[1] == row[1]) that silently ignores the third cell.
test('checkWinner: two matching cells plus a different third cell is NOT a win', () => {
  const b = emptySubBoard();
  b[0] = ['X', 'X', 'O'];
  assert.equal(checkWinner(b), null);
});

test('isBoardFull: true only when every cell is filled', () => {
  const b = emptySubBoard();
  assert.equal(isBoardFull(b), false);
  b.forEach((row) => row.fill('X'));
  assert.equal(isBoardFull(b), true);
});

test('checkGameWinner: no winner on a fresh board', () => {
  assert.equal(checkGameWinner(createEmptyBoards()), null);
});

test('checkGameWinner: outer row win when X wins three sub-boards in a row', () => {
  const boards = createEmptyBoards();
  for (let j = 0; j < 3; j++) {
    boards[0][j] = [
      ['X', 'X', 'X'],
      ['-', '-', '-'],
      ['-', '-', '-'],
    ];
  }
  assert.equal(checkGameWinner(boards), 'X');
});

test('nextActiveBoard: sends opponent to the corresponding sub-board', () => {
  const boards = createEmptyBoards();
  assert.deepEqual(nextActiveBoard(boards, 1, 2), [1, 2]);
});

test('nextActiveBoard: returns null (play anywhere) if target sub-board is already won', () => {
  const boards = createEmptyBoards();
  boards[1][2] = [
    ['X', 'X', 'X'],
    ['-', '-', '-'],
    ['-', '-', '-'],
  ];
  assert.equal(nextActiveBoard(boards, 1, 2), null);
});

test('nextActiveBoard: returns null (play anywhere) if target sub-board is full with no winner', () => {
  const boards = createEmptyBoards();
  boards[1][2] = [
    ['X', 'O', 'X'],
    ['X', 'O', 'O'],
    ['O', 'X', 'X'],
  ];
  assert.equal(nextActiveBoard(boards, 1, 2), null);
});

test('applyMove: legal move updates the correct cell and does not mutate the input', () => {
  const boards = createEmptyBoards();
  const result = applyMove(boards, 0, 0, 1, 1, 'X', null);
  assert.equal(result.legal, true);
  assert.equal(result.boards[0][0][1][1], 'X');
  assert.equal(boards[0][0][1][1], '-', 'original boards array must not be mutated');
});

test('applyMove: rejects a move outside the active (restricted) sub-board', () => {
  const boards = createEmptyBoards();
  const result = applyMove(boards, 0, 0, 1, 1, 'X', [1, 1]);
  assert.equal(result.legal, false);
});

test('applyMove: rejects a move onto an already-occupied cell', () => {
  let boards = createEmptyBoards();
  const first = applyMove(boards, 0, 0, 0, 0, 'X', null);
  boards = first.boards;
  const second = applyMove(boards, 0, 0, 0, 0, 'O', null);
  assert.equal(second.legal, false);
});

test('applyMove: rejects a move into a sub-board that is already won', () => {
  const boards = createEmptyBoards();
  boards[0][0] = [
    ['X', 'X', 'X'],
    ['-', '-', '-'],
    ['-', '-', '-'],
  ];
  const result = applyMove(boards, 0, 0, 1, 1, 'O', null);
  assert.equal(result.legal, false);
});

test('applyMove: the move sends the opponent to the sub-board matching the clicked cell position', () => {
  const boards = createEmptyBoards();
  // Clicking cell (1, 1) within sub-board (0, 0) should send the opponent
  // to sub-board (1, 1) next - that's the core nested-tictactoe rule.
  const result = applyMove(boards, 0, 0, 1, 1, 'X', null);
  assert.equal(result.legal, true);
  assert.deepEqual(result.nextActiveBoard, [1, 1]);
});

test('applyMove: if the targeted next sub-board is already won, opponent may play anywhere', () => {
  const boards = createEmptyBoards();
  // Sub-board (1, 1) is already won, so clicking cell (1, 1) anywhere
  // should free the opponent to play in any sub-board.
  boards[1][1] = [
    ['O', 'O', 'O'],
    ['-', '-', '-'],
    ['-', '-', '-'],
  ];
  const result = applyMove(boards, 0, 0, 1, 1, 'X', null);
  assert.equal(result.legal, true);
  assert.equal(result.nextActiveBoard, null);
});
