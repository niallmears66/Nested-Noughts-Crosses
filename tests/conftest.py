import os
import sys

# Must be set before pygame is imported by any test or app module, since
# mainMenu.py calls pygame.display.set_mode() at import time.
os.environ.setdefault("SDL_VIDEODRIVER", "dummy")
os.environ.setdefault("SDL_AUDIODRIVER", "dummy")

# Make the project root importable regardless of where pytest is invoked from.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
