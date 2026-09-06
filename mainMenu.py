# main_menu.py
import pygame
import random
import sys
import rules
import game  # Importing the game module

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 600, 600
# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREY = (20, 20, 20)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)

# Define the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Nested Noughts and Crosses Main Menu")

# Clock for controlling the frame rate
clock = pygame.time.Clock()

# Font for displaying text
font_title = pygame.font.SysFont(None, 60)

# Grid size
GRID_SIZE = 3
CELL_SIZE = WIDTH // GRID_SIZE


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

# Function to draw the "Play" button
def draw_play_button():
    pygame.draw.rect(screen, GREEN, (WIDTH // 2 - 60, HEIGHT // 2 - 25, 120, 50))
    play_text = font_title.render("Play", True, WHITE)
    play_rect = play_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
    screen.blit(play_text, play_rect)

# Function to draw the "Rules" button
def draw_rules_button():
    pygame.draw.rect(screen, GREEN, (WIDTH // 2 - 60, HEIGHT // 2 + 50, 120, 50))  # Adjusted width to 200
    rules_text = font_title.render("Rules", True, WHITE)
    rules_rect = rules_text.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 75))
    screen.blit(rules_text, rules_rect)

# Define font for displaying additional text
font_info = pygame.font.SysFont(None, 25)

# Function to display additional information
def display_info():
    info_text = font_info.render("Press Key 'p' for Pause", True, WHITE)
    screen.blit(info_text, (10, HEIGHT - 30))


# Main function for running the game
def main():

    shapes = []  # List to hold falling shapes

    # Game loop
    while True:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_x, mouse_y = pygame.mouse.get_pos()
                if WIDTH // 2 - 50 <= mouse_x <= WIDTH // 2 + 50 and HEIGHT // 2 - 25 <= mouse_y <= HEIGHT // 2 + 25:
                    # Link to the game file
                    game.main()
                elif WIDTH // 2 - 100 <= mouse_x <= WIDTH // 2 + 100 and HEIGHT // 2 + 50 <= mouse_y <= HEIGHT // 2 + 100:  # Adjusted width condition
                    # Call the function to show rules screen from rules.py
                    if show_rules_screen():
                        return  # Return to main menu

        # Add new shape every few frames
        if random.random() < 0.02:
            shapes.append(create_shape())

        # Update shapes' positions
        for shape in shapes:
            shape['y'] += shape['speed']

        # Remove shapes that have fallen off the screen
        shapes = [shape for shape in shapes if shape['y'] < HEIGHT]

        # Fill the background
        screen.fill(BLACK)

        # Draw the Nested Noughts and Crosses grid
        draw_nested_grid()

        # Draw shapes
        for shape in shapes:
            if shape['shape'] == 'X':
                pygame.draw.line(screen, shape['color'], (shape['x'], shape['y']), (shape['x'] + shape['size'], shape['y'] + shape['size']), 5)
                pygame.draw.line(screen, shape['color'], (shape['x'] + shape['size'], shape['y']), (shape['x'], shape['y'] + shape['size']), 5)
            else:
                pygame.draw.circle(screen, shape['color'], (shape['x'] + shape['size'] // 2, shape['y'] + shape['size'] // 2), shape['size'] // 2, 5)

        # Draw title
        title_text = font_title.render("Nested Noughts and Crosses", True, WHITE)
        title_rect = title_text.get_rect(center=(WIDTH // 2, 100))
        screen.blit(title_text, title_rect)

        # Draw "Play" button
        draw_play_button()

        # Draw "Rules" button
        draw_rules_button()

        # Display additional information
        display_info()

        # Display
        pygame.display.flip()
        clock.tick(60)

# Function to show rules screen
def show_rules_screen():
    # Clear the screen
    screen.fill(BLACK)
    

    # Display rules
    scroll_offset = 0
    while True:
        if rules.show_rules_screen(scroll_offset):
            # Return to main menu
            return
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    main()
