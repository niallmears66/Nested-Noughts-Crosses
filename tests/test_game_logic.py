import game


def empty_board():
    return [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']]


def test_check_winner_no_winner():
    assert game.check_winner(empty_board()) is None


def test_check_winner_row():
    board = empty_board()
    board[0] = ['X', 'X', 'X']
    assert game.check_winner(board) == 'X'


def test_check_winner_column():
    board = empty_board()
    board[0][1] = board[1][1] = board[2][1] = 'O'
    assert game.check_winner(board) == 'O'


def test_check_winner_diagonal():
    board = empty_board()
    board[0][0] = board[1][1] = board[2][2] = 'X'
    assert game.check_winner(board) == 'X'


def test_check_winner_anti_diagonal():
    board = empty_board()
    board[0][2] = board[1][1] = board[2][0] = 'O'
    assert game.check_winner(board) == 'O'


def test_get_cell_no_active_board():
    # With no active sub-board, get_cell should map raw pixel position to a
    # (row, col) on the full 9x9 grid.
    row, col = game.get_cell((0, 0), None)
    assert (row, col) == (0, 0)


def test_get_cell_outside_active_board_returns_invalid():
    # current_board restricts play to one sub-board; clicking outside it
    # should be reported as invalid (-1, -1).
    row, col = game.get_cell((0, 0), (2, 2))
    assert (row, col) == (-1, -1)


def test_check_winner_partial_row_is_not_a_win():
    board = empty_board()
    board[0] = ['X', 'X', 'O']
    assert game.check_winner(board) is None