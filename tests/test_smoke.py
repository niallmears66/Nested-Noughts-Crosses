import ast
import os
import pathlib

PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent


def test_rules_module_imports():
    import rules  # noqa: F401


def test_main_menu_module_imports():
    # mainMenu.py calls pygame.display.set_mode() at import time; conftest.py
    # sets SDL_VIDEODRIVER=dummy so this works without a real display.
    import mainMenu  # noqa: F401


def test_game_module_imports():
    import game  # noqa: F401


def test_terminal_py_is_syntactically_valid():
    # terminal.py runs its game loop (with blocking input()) at import time,
    # so we only verify it parses as valid Python rather than importing it.
    source = (PROJECT_ROOT / "terminal.py").read_text()
    ast.parse(source)
