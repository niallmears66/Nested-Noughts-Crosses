import pygame
import sys
import random
from pygame.locals import *

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 600, 600
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREY = (20, 20, 20)

# Define the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Rules")

# Clock for controlling the frame rate
clock = pygame.time.Clock()

# Font for displaying text
font_title = pygame.font.SysFont(None, 60)
font_rules = pygame.font.SysFont(None, 24)

# Grid size
GRID_SIZE = 3
CELL_SIZE = WIDTH // GRID_SIZE

# Define rule_texts globally
rule_texts = [
    "Objective:",
    "Win three smaller tic-tac-toe games in a row across the",
    "entire larger grid.",
    "Board Layout:",
    "The game is played on a 3x3 grid, where each cell contains another",
    "3x3 grid. This results in a total of 81 cells.",
    "Starting the Game:",
    "Players take turns placing their symbol (nought or cross) in any empty",
    "cell of any of the nine smaller grids.",
    "Gameplay:",
    "Wherever the player places their symbol in a smaller grid will decide ",
    "which grid their opponent plays in. ",
    "For example, if Player 1 places their symbol in the top right cell of ", 
    "a smaller grid, Player 2 must play in the top right grid",
    "Playing in Finished Grids:",
    "If a player sends their opponent to a smaller grid that has already",
    "been won or has no empty cells left, the opponent can choose to play",
    "their symbol in any empty cell in any of the other available smaller grids.",
    "Winning:",
    "A player wins the game by getting three of their symbols in a row",
    "(horizontally, vertically, or diagonally) in the larger 3x3 grid.",
    "Once a smaller grid is won, no more symbols can be placed in it.",
    "Draw:",
    "If all cells are filled and no player has won the larger grid,",
    "the game is a draw.",
    "End of Game:",
    "The game ends when one player achieves victory or when the game",
    "is declared a draw.",
]

# Function to create a new 'X' or 'O' object
def create_shape():
    shape = random.choice(['X', 'O'])
    color = (0, 0, 255) if shape == 'X' else (255, 0, 0)
    size = random.randint(20, 50)
    x = random.randint(0, WIDTH - size)
    y = random.randint(-50, -size)
    speed = random.randint(1, 3)
    return {'shape': shape, 'color': color, 'size': size, 'x': x, 'y': y, 'speed': speed}

# Function to draw the Nested Noughts and Crosses grid
def draw_nested_grid():
    for i in range(GRID_SIZE):
        for j in range(GRID_SIZE):
            pygame.draw.rect(screen, GREY, (j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE), 3)
            for k in range(GRID_SIZE):
                for l in range(GRID_SIZE):
                    x_offset = j * CELL_SIZE + l * (CELL_SIZE // GRID_SIZE)
                    y_offset = i * CELL_SIZE + k * (CELL_SIZE // GRID_SIZE)
                    pygame.draw.rect(screen, GREY, (x_offset, y_offset, CELL_SIZE // GRID_SIZE, CELL_SIZE // GRID_SIZE), 1)
# Define shape list globally
shapes = []

def show_rules_screen(scroll_offset=0):
    running = True
    max_offset = max(0, len(rule_texts) * 25 + font_title.size("Rules")[1] - HEIGHT)
    back_button_rect = pygame.Rect(10, 10, 80, 30)  # Define rectangle for back button

    global shapes  # Access the global shape list

    # Game loop
    while running:
        screen.fill(BLACK)

        # Draw Nested Noughts and Crosses grid
        draw_nested_grid()

        # Create new shape every few frames
        if random.random() < 0.02:
            shapes.append(create_shape())  # Append new shape to the global list

        # Update shapes' positions
        for shape in shapes:
            shape['y'] += shape['speed']

        # Remove shapes that have fallen off the screen
        shapes = [shape for shape in shapes if shape['y'] < HEIGHT]

        # Draw shapes
        for shape in shapes:
            if shape['shape'] == 'X':
                pygame.draw.line(screen, shape['color'], (shape['x'], shape['y']), (shape['x'] + shape['size'], shape['y'] + shape['size']), 5)
                pygame.draw.line(screen, shape['color'], (shape['x'] + shape['size'], shape['y']), (shape['x'], shape['y'] + shape['size']), 5)
            else:
                pygame.draw.circle(screen, shape['color'], (shape['x'] + shape['size'] // 2, shape['y'] + shape['size'] // 2), shape['size'] // 2, 5)

        # Display rules title
        rules_title = font_title.render("Rules", True, WHITE)
        rules_title_rect = rules_title.get_rect(center=(WIDTH // 2, 50 + scroll_offset))  # Adjusted for scrolling
        screen.blit(rules_title, rules_title_rect)

        # Render and blit each line with appropriate spacing
        x_offset = 30  # Adjust this value to control the left margin
        y_offset = 50 + rules_title_rect.height + scroll_offset  # Adjusted for scrolling and title height
        for index, text in enumerate(rule_texts):
            rule_surface = font_rules.render(text, True, WHITE)
            rule_rect = rule_surface.get_rect(topleft=(x_offset, y_offset))

            # Underline specific lines
            if index in [0, 3, 6, 9, 14, 18, 22, 25]:
                pygame.draw.line(rule_surface, WHITE, (0, rule_surface.get_height() - 2), (rule_surface.get_width(), rule_surface.get_height() - 2), 1)

            screen.blit(rule_surface, rule_rect)
            y_offset += 25

        # Draw back button
        back_button_surface = font_rules.render("< Back", True, WHITE)
        back_button_rect = back_button_surface.get_rect(topleft=(10, 10 + scroll_offset))  # Adjusted for scrolling
        screen.blit(back_button_surface, back_button_rect)

        # Continuous scrolling while arrow keys are held down
        keys = pygame.key.get_pressed()
        if keys[K_DOWN]:
            scroll_offset -= 10
            if scroll_offset < -max_offset - 90:
                scroll_offset = -max_offset - 90
        elif keys[K_UP]:
            scroll_offset += 10
            if scroll_offset > 0:
                scroll_offset = 0

        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return True  # Return True if window is closed
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_x, mouse_y = pygame.mouse.get_pos()
                if back_button_rect.collidepoint(mouse_x, mouse_y):  # Check if mouse click is within back button area
                    return True  # Return True if back button is clicked

        pygame.display.flip()
        clock.tick(60)

    return False  # Return False if the rules screen is closed without clicking the back button

if __name__ == "__main__":
    show_rules_screen()
