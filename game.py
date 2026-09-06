import pygame
import sys
import mainMenu  # Importing the main menu module

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 600
SCREEN_HEIGHT = 600
CELL_SIZE = 200
GRID_SIZE = 3
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)
GREY = (255, 255, 0)
YELLOW = (255, 255, 0)
PINK = (255, 51, 153)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
FONT_SIZE = 40

# Menu Constants
MENU_FONT_SIZE = 40
MENU_BUTTON_WIDTH = 200
MENU_BUTTON_HEIGHT = 50
MENU_BUTTON_COLOR = (50, 205, 50)  # Green
MENU_BUTTON_TEXT_COLOR = WHITE

def draw_menu(screen):
    screen.fill(BLACK)  # Clear the screen
    
    # Draw Play button
    play_button_rect = pygame.Rect((SCREEN_WIDTH - MENU_BUTTON_WIDTH) // 2, (SCREEN_HEIGHT - MENU_BUTTON_HEIGHT) // 2, MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT)
    pygame.draw.rect(screen, MENU_BUTTON_COLOR, play_button_rect)
    font = pygame.font.SysFont(None, MENU_FONT_SIZE)
    play_text = font.render("Play", True, MENU_BUTTON_TEXT_COLOR)
    play_text_rect = play_text.get_rect(center=play_button_rect.center)
    screen.blit(play_text, play_text_rect)

    pygame.display.flip()
    
    return play_button_rect

def draw_winner_screen(screen, winner, score_X, score_O):
    # Create a semi-transparent overlay
    overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
    overlay.set_alpha(170)  # Set transparency level (0-255)
    overlay.fill((0, 0, 0))  # Fill overlay with black
    screen.blit(overlay, (0, 0))  # Blit overlay onto the screen

    # Display winner text
    font = pygame.font.SysFont(None, FONT_SIZE)
    winner_text = font.render(f"Player {winner} wins the game!", True, GREEN)
    winner_text_rect = winner_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 50))
    screen.blit(winner_text, winner_text_rect)

    # Update and display scores
    score_font = pygame.font.SysFont(None, FONT_SIZE)
    score_X_text = score_font.render(f"Player X: {score_X}", True, WHITE)
    score_O_text = score_font.render(f"Player O: {score_O}", True, WHITE)
    score_X_text_rect = score_X_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
    score_O_text_rect = score_O_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 50))
    screen.blit(score_X_text, score_X_text_rect)
    screen.blit(score_O_text, score_O_text_rect)

    # Draw buttons
    return_to_menu_button_rect = pygame.Rect((SCREEN_WIDTH - 300) // 2, (SCREEN_HEIGHT // 2) + 100, 300, MENU_BUTTON_HEIGHT)
    pygame.draw.rect(screen, MENU_BUTTON_COLOR, return_to_menu_button_rect)
    return_to_menu_text = font.render("Return to Menu", True, MENU_BUTTON_TEXT_COLOR)
    return_to_menu_text_rect = return_to_menu_text.get_rect(center=return_to_menu_button_rect.center)
    screen.blit(return_to_menu_text, return_to_menu_text_rect)

    play_again_button_rect = pygame.Rect((SCREEN_WIDTH - MENU_BUTTON_WIDTH) // 2, (SCREEN_HEIGHT // 2) + 200, MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT)
    pygame.draw.rect(screen, MENU_BUTTON_COLOR, play_again_button_rect)
    play_again_text = font.render("Play Again", True, MENU_BUTTON_TEXT_COLOR)
    play_again_text_rect = play_again_text.get_rect(center=play_again_button_rect.center)
    screen.blit(play_again_text, play_again_text_rect)

    pygame.display.flip()
    
    return return_to_menu_button_rect, play_again_button_rect



def draw_pause_menu(screen, boards, current_board, turn):
    # Draw the game board in the background
    draw_board(screen, boards, current_board, turn)
    
    # Draw semi-transparent overlay
    overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
    overlay.set_alpha(128)  # Set transparency level (0-255)
    overlay.fill((0, 0, 0))  # Fill overlay with black
    screen.blit(overlay, (0, 0))  # Blit overlay onto the screen
    
    # Draw Pause menu title
    font_title = pygame.font.SysFont(None, 60)
    title_text = font_title.render("Paused", True, WHITE)
    title_text_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, 100))
    screen.blit(title_text, title_text_rect)
    
    # Display current player's turn
    font_turn = pygame.font.SysFont(None, FONT_SIZE)
    turn_text = font_turn.render(f"Player {turn}'s turn", True, GREEN)
    turn_text_rect = turn_text.get_rect(center=(SCREEN_WIDTH // 2, 150))
    screen.blit(turn_text, turn_text_rect)
    
    # Draw Pause menu buttons
    font = pygame.font.SysFont(None, MENU_FONT_SIZE)
    
    # Calculate button positions
    button_width = MENU_BUTTON_WIDTH
    button_height = MENU_BUTTON_HEIGHT
    vertical_spacing = 50
    total_height = (button_height * 3) + (vertical_spacing * 2)
    top_margin = (SCREEN_HEIGHT - total_height) // 2 + 100

    resume_button_rect = pygame.Rect((SCREEN_WIDTH - button_width) // 2, top_margin, button_width, button_height)
    return_to_menu_button_rect = pygame.Rect((SCREEN_WIDTH - button_width) // 2, top_margin + button_height + vertical_spacing, button_width, button_height)
    restart_button_rect = pygame.Rect((SCREEN_WIDTH - button_width) // 2, top_margin + (button_height + vertical_spacing) * 2, button_width, button_height)
    
    # Draw buttons
    pygame.draw.rect(screen, MENU_BUTTON_COLOR, resume_button_rect)
    resume_text = font.render("Resume", True, MENU_BUTTON_TEXT_COLOR)
    resume_text_rect = resume_text.get_rect(center=resume_button_rect.center)
    screen.blit(resume_text, resume_text_rect)
    
    pygame.draw.rect(screen, MENU_BUTTON_COLOR, return_to_menu_button_rect)
    return_to_menu_text = font.render("Return to Menu", True, MENU_BUTTON_TEXT_COLOR)
    return_to_menu_text_rect = return_to_menu_text.get_rect(center=return_to_menu_button_rect.center)
    screen.blit(return_to_menu_text, return_to_menu_text_rect)

    pygame.draw.rect(screen, MENU_BUTTON_COLOR, restart_button_rect)
    restart_text = font.render("Restart", True, MENU_BUTTON_TEXT_COLOR)
    restart_text_rect = restart_text.get_rect(center=restart_button_rect.center)
    screen.blit(restart_text, restart_text_rect)

    pygame.display.flip()
    
    return resume_button_rect, return_to_menu_button_rect, restart_button_rect


def draw_board(screen, boards, current_board, turn):
    screen.fill(BLACK)  # Clear the screen

    # Draw the board grid
    for i in range(GRID_SIZE):
        for j in range(GRID_SIZE):
            pygame.draw.rect(screen, WHITE, (j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE), 3)
            for k in range(GRID_SIZE):
                for l in range(GRID_SIZE):
                    x_offset = j * CELL_SIZE + l * (CELL_SIZE // GRID_SIZE)
                    y_offset = i * CELL_SIZE + k * (CELL_SIZE // GRID_SIZE)
                    pygame.draw.rect(screen, WHITE, (x_offset, y_offset, CELL_SIZE // GRID_SIZE, CELL_SIZE // GRID_SIZE), 1)

    for i in range(GRID_SIZE):
        for j in range(GRID_SIZE):
            for k in range(GRID_SIZE):
                for l in range(GRID_SIZE):
                    x_offset = j * CELL_SIZE + l * (CELL_SIZE // GRID_SIZE)
                    y_offset = i * CELL_SIZE + k * (CELL_SIZE // GRID_SIZE)
                    if boards[i][j][k][l] == 'X':
                        pygame.draw.line(screen, WHITE, (x_offset + 15, y_offset + 15), (x_offset + CELL_SIZE // GRID_SIZE - 15, y_offset + CELL_SIZE // GRID_SIZE - 15), 6)
                        pygame.draw.line(screen, WHITE, (x_offset + CELL_SIZE // GRID_SIZE - 15, y_offset + 15), (x_offset + 15, y_offset + CELL_SIZE // GRID_SIZE - 15), 6)
                    elif boards[i][j][k][l] == 'O':
                        pygame.draw.circle(screen, WHITE, (x_offset + CELL_SIZE // (2 * GRID_SIZE), y_offset + CELL_SIZE // (2 * GRID_SIZE)), CELL_SIZE // (3 * GRID_SIZE), 5)



    
    # Check if the player has the choice to play in any square
    if current_board is None:
        # Highlight the entire board
        pygame.draw.rect(screen, (0, 255, 0), (0, 0, SCREEN_WIDTH, SCREEN_HEIGHT), 5)
    else:
        # Highlight the current board
        x_offset = current_board[1] * CELL_SIZE
        y_offset = current_board[0] * CELL_SIZE
        pygame.draw.rect(screen, (0, 255, 0), (x_offset, y_offset, CELL_SIZE, CELL_SIZE), 5)

    # Check for winners in smaller grids and overlay winning symbol
    for i in range(GRID_SIZE):
        for j in range(GRID_SIZE):
            winner = check_winner(boards[i][j])
            if winner:
                x_offset = j * CELL_SIZE
                y_offset = i * CELL_SIZE
                if winner == 'X':
                    pygame.draw.line(screen, BLUE, (x_offset + 25, y_offset + 25), (x_offset + CELL_SIZE - 25, y_offset + CELL_SIZE - 25), 10)
                    pygame.draw.line(screen, BLUE, (x_offset + CELL_SIZE - 25, y_offset + 25), (x_offset + 25, y_offset + CELL_SIZE - 25), 10)
                elif winner == 'O':
                    pygame.draw.circle(screen, RED, (x_offset + CELL_SIZE // 2, y_offset + CELL_SIZE // 2), CELL_SIZE // 3, 10)
    
    # Display current player's turn
    font = pygame.font.SysFont(None, FONT_SIZE)
    text = font.render(f"", True, GREEN)
    
    # Dynamically adjust the position of the text based on the next grid to play in
    if current_board is None or current_board[0] == 0:  # If the current board is at the top or None
        # Display the text at the bottom
        text_rect = text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT - 50))
    else:
        # Display the text at the top
        text_rect = text.get_rect(center=(SCREEN_WIDTH // 2, 50))
    
    screen.blit(text, text_rect)

    pygame.display.flip()

def get_cell(pos, current_board):
    col = (pos[0] // (CELL_SIZE // GRID_SIZE))
    row = (pos[1] // (CELL_SIZE // GRID_SIZE))
    if current_board is not None:
        row_offset = current_board[0] * GRID_SIZE * (CELL_SIZE // GRID_SIZE)
        col_offset = current_board[1] * GRID_SIZE * (CELL_SIZE // GRID_SIZE)
        cell_size = CELL_SIZE // GRID_SIZE
        cell_row = (pos[1] - row_offset) // cell_size
        cell_col = (pos[0] - col_offset) // cell_size
        if 0 <= cell_row < (CELL_SIZE // GRID_SIZE) and 0 <= cell_col < (CELL_SIZE // GRID_SIZE):
            row = row_offset // (CELL_SIZE // GRID_SIZE) + cell_row
            col = col_offset // (CELL_SIZE // GRID_SIZE) + cell_col
        else:
            row = -1
            col = -1
    return row, col

# Function to check for a winner in a sub-grid
def check_winner(board):
    # Check rows
    for row in board:
        if row[0] == row[1] == row[1] != '-':
            return row[0]
    # Check columns
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != '-':
            return board[0][col]
    # Check diagonals
    if board[0][0] == board[1][1] == board[2][2] != '-':
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != '-':
        return board[0][2]
    return None

# Update the check_game_winner function to update the scores
def check_game_winner(boards):
    global score_X, score_O  # Declare score_X and score_O as global variables
    # Initialize scores if they're not already defined
    if 'score_X' not in globals():
        score_X = 0
    if 'score_O' not in globals():
        score_O = 0

    # Check rows
    for i in range(GRID_SIZE):
        if all(check_winner(boards[i][j]) == 'X' for j in range(GRID_SIZE)):
            score_X += 1
            return 'X'
        elif all(check_winner(boards[i][j]) == 'O' for j in range(GRID_SIZE)):
            score_O += 1
            return 'O'
    
    # Check columns
    for j in range(GRID_SIZE):
        if all(check_winner(boards[i][j]) == 'X' for i in range(GRID_SIZE)):
            score_X += 1
            return 'X'
        elif all(check_winner(boards[i][j]) == 'O' for i in range(GRID_SIZE)):
            score_O += 1
            return 'O'
    
    # Check diagonals
    if all(check_winner(boards[i][i]) == 'X' for i in range(GRID_SIZE)):
        score_X += 1
        return 'X'
    elif all(check_winner(boards[i][i]) == 'O' for i in range(GRID_SIZE)):
        score_O += 1
        return 'O'
    if all(check_winner(boards[i][GRID_SIZE-1-i]) == 'X' for i in range(GRID_SIZE)):
        score_X += 1
        return 'X'
    elif all(check_winner(boards[i][GRID_SIZE-1-i]) == 'O' for i in range(GRID_SIZE)):
        score_O += 1
        return 'O'
    
    return None


def main():
    # Set up the screen
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Nested Noughts and Crosses")

    # Initialize the game
    boards = [[[['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']] for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    current_board = None
    turn = 'X'
    paused = False  # Pause state
    pause_menu_displayed = False  # Flag to track whether the pause menu is displayed
    need_redraw = True  # Flag to track whether screen needs to be redrawn
    winner = None  # Variable to store the winner of the game

    # Initialize score variables
    score_X = 0
    score_O = 0

    # Create a clock object to control the frame rate
    clock = pygame.time.Clock()

    # Game loop
    while True:
        # Check for winner
        if not winner:
            winner = check_game_winner(boards)
            if winner:
                if winner == 'X':
                    score_X += 1
                elif winner == 'O':
                    score_O += 1
                return_to_menu_button_winner_rect, play_again_button_winner_rect = draw_winner_screen(screen, winner, score_X, score_O)
                need_redraw = True

        # Handle events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                return
            elif not winner:
                if not paused:
                    # Handle mouse click events only if the game is not paused and no winner is found
                    if event.type == pygame.MOUSEBUTTONDOWN:
                        mouse_pos = pygame.mouse.get_pos()
                        clicked_row, clicked_col = get_cell(mouse_pos, current_board)
                        if clicked_row != -1 and clicked_col != -1:  # Ensure valid click
                            if boards[clicked_row // GRID_SIZE][clicked_col // GRID_SIZE][clicked_row % GRID_SIZE][clicked_col % GRID_SIZE] == '-':
                                boards[clicked_row // GRID_SIZE][clicked_col // GRID_SIZE][clicked_row % GRID_SIZE][clicked_col % GRID_SIZE] = turn
                                next_board = boards[clicked_row % GRID_SIZE][clicked_col % GRID_SIZE]
                                if check_winner(next_board) or all(all(cell != '-' for cell in row) for row in next_board):
                                    current_board = None  # Allow to play anywhere if the next board is won or full
                                else:
                                    current_board = (clicked_row % GRID_SIZE, clicked_col % GRID_SIZE)  # Otherwise, play in the next board
                                turn = 'O' if turn == 'X' else 'X'
                                need_redraw = True
                    elif event.type == pygame.KEYDOWN and event.key == pygame.K_p:
                        # Toggle pause state when 'p' key is pressed
                        paused = True
                        pause_menu_displayed = True
                        resume_button_rect, return_to_menu_button_rect, restart_button_rect = draw_pause_menu(screen, boards, current_board, turn)
                        need_redraw = True
                else:
                    # Display the pause menu if the game is paused
                    if not pause_menu_displayed:
                        resume_button_rect, return_to_menu_button_rect, restart_button_rect = draw_pause_menu(screen, boards, current_board, turn)
                        pause_menu_displayed = True  # Set flag to indicate that the pause menu is displayed
                        need_redraw = True

                    # Event handling for pause menu buttons
                    if event.type == pygame.MOUSEBUTTONDOWN:
                        mouse_pos = pygame.mouse.get_pos()
                        if resume_button_rect.collidepoint(mouse_pos):
                            # Resume the game
                            paused = False
                            pause_menu_displayed = False
                            need_redraw = True
                        elif return_to_menu_button_rect.collidepoint(mouse_pos):
                            # Return to the main menu
                            mainMenu.main()  # Call the main function from the main menu module
                            return
                        elif restart_button_rect.collidepoint(mouse_pos):
                            # Reset the game
                            boards = [[[['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']] for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
                            current_board = None
                            turn = 'X'
                            paused = False
                            pause_menu_displayed = False
                            need_redraw = True
            else:
                # Event handling for winner screen buttons
                if event.type == pygame.MOUSEBUTTONDOWN:
                    mouse_pos = pygame.mouse.get_pos()
                    if return_to_menu_button_winner_rect.collidepoint(mouse_pos):
                        # Return to the main menu
                        mainMenu.main()  # Call the main function from the main menu module
                        return
                    elif play_again_button_winner_rect.collidepoint(mouse_pos):
                        # Reset the game
                        boards = [[[['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']] for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
                        current_board = None
                        turn = 'X'
                        paused = False
                        pause_menu_displayed = False
                        winner = None  # Reset the winner
                        need_redraw = True  # Redraw the screen

        # Draw the board or pause menu
        if need_redraw:
            if not paused and not winner:
                draw_board(screen, boards, current_board, turn)
            elif pause_menu_displayed:
                draw_pause_menu(screen, boards, current_board, turn)
            need_redraw = False

        # Update the display
        pygame.display.update()

        # Limit the frame rate to 60 FPS
        clock.tick(60)

# Run the main function
if __name__ == "__main__":
    main()
