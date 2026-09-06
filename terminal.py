
board1 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board2 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board3 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board4 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board5 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board6 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board7 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board8 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']
board9 = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-']

startGameNumber = 0
currentPlayer = "X"
winner = None
gameRunning = True
gameStarting = True

b1win = 0
b2win = 0
b3win = 0
b4win = 0
b5win = 0
b6win = 0
b7win = 0
b8win = 0
b9win = 0

# CREATE THE BOARD

def printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9):
    print(board1[0] + " | " + board1[1] + " | " + board1[2] + "   |   " + board2[0] + " | " + board2[1] + " | " + board2[2] + "   |   " + board3[0] + " | " + board3[1] + " | " + board3[2])
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print(board1[3] + " | " + board1[4] + " | " + board1[5] + "   |   " + board2[3] + " | " + board2[4] + " | " + board2[5] + "   |   " + board3[3] + " | " + board3[4] + " | " + board3[5])
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print(board1[6] + " | " + board1[7] + " | " + board1[8] + "   |   " + board2[6] + " | " + board2[7] + " | " + board2[8] + "   |   " + board3[6] + " | " + board3[7] + " | " + board3[8])
    print()
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print()
    print(board4[0] + " | " + board4[1] + " | " + board4[2] + "   |   " + board5[0] + " | " + board5[1] + " | " + board5[2] + "   |   " + board6[0] + " | " + board6[1] + " | " + board6[2])
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print(board4[3] + " | " + board4[4] + " | " + board4[5] + "   |   " + board5[3] + " | " + board5[4] + " | " + board5[5] + "   |   " + board6[3] + " | " + board6[4] + " | " + board6[5])
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print(board4[6] + " | " + board4[7] + " | " + board4[8] + "   |   " + board5[6] + " | " + board5[7] + " | " + board5[8] + "   |   " + board6[6] + " | " + board6[7] + " | " + board6[8])
    print()
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print()
    print(board7[0] + " | " + board7[1] + " | " + board7[2] + "   |   " + board8[0] + " | " + board8[1] + " | " + board8[2] + "   |   " + board9[0] + " | " + board9[1] + " | " + board9[2])
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print(board7[3] + " | " + board7[4] + " | " + board7[5] + "   |   " + board8[3] + " | " + board8[4] + " | " + board8[5] + "   |   " + board9[3] + " | " + board9[4] + " | " + board9[5])
    print("-" * 11 + " | " + "-" * 13 + " | " + "-" * 13)
    print(board7[6] + " | " + board7[7] + " | " + board7[8] + "   |   " + board8[6] + " | " + board8[7] + " | " + board8[8] + "   |   " + board9[6] + " | " + board9[7] + " | " + board9[8])
# # START OF GAME

def gameStart(board1, board2, board3, board4, board5, board6, board7, board8, board9):
    while True:
        global startGameNumber
        startInputGame = int(input("Which game would you like to start in?: \033[1;34m Player (X) \033[0;0m "))
        if startInputGame == 1:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board1[startGameNumber-1] == "-":
                board1[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 2:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board2[startGameNumber-1] == "-":
                board2[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 3:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board3[startGameNumber-1] == "-":
                board3[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 4:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board4[startGameNumber-1] == "-":
                board4[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 5:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board5[startGameNumber-1] == "-":
                board5[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 6:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board6[startGameNumber-1] == "-":
                board6[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 7:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board7[startGameNumber-1] == "-":
                board7[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 8:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board8[startGameNumber-1] == "-":
                board8[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break
        if startInputGame == 9:
            startGameNumber = int(input(f"Enter a number 1-9 \033[1;34m Player (X) \033[0;0m : "))
            if startGameNumber >= 1 and startGameNumber <= 9 and board9[startGameNumber-1] == "-":
                board9[startGameNumber-1] = currentPlayer
                startBox = startGameNumber
                break



# TAKE PLAYER INPUT

def playerInput(board1, board2, board3, board4, board5, board6, board7, board8, board9):
    while True:
        global startGameNumber
        if startGameNumber == 1 :
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board1[inp-1] == "-":
                    board1[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board1[inp-1] == "-":
                    board1[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")   
        elif startGameNumber == 2:    
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board2[inp-1] == "-":
                    board2[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board2[inp-1] == "-":
                    board2[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        elif startGameNumber == 3:
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board3[inp-1] == "-":
                    board3[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board3[inp-1] == "-":
                    board3[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        elif startGameNumber == 4 :
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board4[inp-1] == "-":
                    board4[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board4[inp-1] == "-":
                    board4[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        elif startGameNumber == 5:
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board5[inp-1] == "-":
                    board5[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board5[inp-1] == "-":
                    board5[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        elif startGameNumber == 6:
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board6[inp-1] == "-":
                    board6[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board6[inp-1] == "-":
                    board6[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        elif startGameNumber == 7:
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board7[inp-1] == "-":
                    board7[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board7[inp-1] == "-":
                    board7[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        elif startGameNumber == 8: 
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board8[inp-1] == "-":
                    board8[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board8[inp-1] == "-":
                    board8[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        elif startGameNumber == 9:
            if currentPlayer == "O":
                inp = int(input(f"Enter a number 1-9 \033[1;34m Player (O) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board9[inp-1] == "-":
                    board9[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
            else:
                inp = int(input(f"Enter a number 1-9 \033[1;31m Player (X) \033[0;0m : "))
                if inp >= 1 and inp <= 9 and board9[inp-1] == "-":
                    board9[inp-1] = currentPlayer
                    (inp-1) == startGameNumber
                    break
                else:
                    if currentPlayer == "X":
                        print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
                    else:
                        print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
        else:
            if currentPlayer == "X":
                print(f"Oops! Try again! Player - \033[1;34m Player (X) \033[0;0m ! ")
            else:
                print(f"Oops! Try again! Player - \033[1;31m Player (0) \033[0;0m ! ")
    
    startGameNumber = inp

# CHECK WIN ATTEMPT 2

def checkHorizontal(board1, board2, board3, board4, board5, board6, board7, board8, board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    if (board1[0] == board1[1] == board1[2] == "X") or (board1[3] == board1[4] == board1[5] == "X") or (board1[6] == board1[7] == board1[8] =="X"):
        b1win = 1
    if (board1[0] == board1[1] == board1[2] == "O") or (board1[3] == board1[4] == board1[5] == "O") or (board1[6] == board1[7] == board1[8] =="O"):
        b1win = 2
    if (board2[0] == board2[1] == board2[2] == "X") or (board2[3] == board2[4] == board2[5] == "X") or (board2[6] == board2[7] == board2[8] =="X"):
        b2win = 1
    if (board2[0] == board2[1] == board2[2] == "O") or (board2[3] == board2[4] == board2[5] == "O") or (board2[6] == board2[7] == board2[8] =="X"):
        b2win = 2
    if (board3[0] == board3[1] == board3[2] == "X") or (board3[3] == board3[4] == board3[5] == "X") or (board3[6] == board3[7] == board3[8] =="X"):
        b3win = 1
    if (board3[0] == board3[1] == board3[2] == "O") or (board3[3] == board3[4] == board3[5] == "O") or (board3[6] == board3[7] == board3[8] =="O"):
        b3win = 2
    if (board4[0] == board4[1] == board4[2] == "X") or (board4[3] == board4[4] == board4[5] == "X") or (board4[6] == board4[7] == board4[8] =="X"):
        b4win = 1
    if (board4[0] == board4[1] == board4[2] == "O") or (board4[3] == board4[4] == board4[5] == "O") or (board4[6] == board4[7] == board4[8] =="O"):
        b4win = 2
    if (board5[0] == board5[1] == board5[2] == "X") or (board5[3] == board5[4] == board5[5] == "X") or (board5[6] == board5[7] == board5[8] =="X"):
        b5win = 1
    if (board5[0] == board5[1] == board5[2] == "O") or (board5[3] == board5[4] == board5[5] == "O") or (board5[6] == board5[7] == board5[8] =="O"):
        b5win = 2
    if (board6[0] == board6[1] == board6[2] == "X") or (board6[3] == board6[4] == board6[5] == "X") or (board6[6] == board6[7] == board6[8] =="X"):
        b6win = 1
    if (board6[0] == board6[1] == board6[2] == "O") or (board6[3] == board6[4] == board6[5] == "O") or (board6[6] == board6[7] == board6[8] =="O"):
        b6win = 2
    if (board7[0] == board7[1] == board7[2] == "X") or (board7[3] == board7[4] == board7[5] == "X") or (board7[6] == board7[7] == board7[8] =="X"):
        b7win = 1
    if (board7[0] == board7[1] == board7[2] == "O") or (board7[3] == board7[4] == board7[5] == "O") or (board7[6] == board7[7] == board7[8] =="O"):
        b7win = 2
    if (board8[0] == board8[1] == board8[2] == "X") or (board8[3] == board8[4] == board8[5] == "X") or (board8[6] == board8[7] == board8[8] =="X"):
        b8win = 1
    if (board8[0] == board8[1] == board8[2] == "O") or (board8[3] == board8[4] == board8[5] == "O") or (board8[6] == board8[7] == board8[8] =="O"):
        b8win = 2
    if (board9[0] == board9[1] == board9[2] == "X") or (board9[3] == board9[4] == board9[5] == "X") or (board9[6] == board9[7] == board9[8] =="X"):
        b9win = 1
    if (board9[0] == board9[1] == board9[2] == "O") or (board9[3] == board9[4] == board9[5] == "O") or (board9[6] == board9[7] == board9[8] =="O"):
        b9win = 2
    return b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win
b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win = checkHorizontal(board1, board2, board3, board4, board5 ,board6, board7 ,board8 ,board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)


def checkVertical(board1, board2, board3, board4, board5, board6, board7, board8, board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    if (board1[0] == board1[3] == board1[6] == "X") or (board1[1] == board1[4] == board1[7] == "X") or (board1[2] == board1[5] == board1[8] == "X"):
        b1win = 1
    if (board1[0] == board1[3] == board1[6] == "O") or (board1[1] == board1[4] == board1[7] == "O") or (board1[2] == board1[5] == board1[8] == "O"):
        b1win = 2
    if (board2[0] == board2[3] == board2[6] == "X") or (board2[1] == board2[4] == board2[7] == "X") or (board2[2] == board2[5] == board2[8] == "X"):
        b2win = 1
    if (board2[0] == board2[3] == board2[6] == "O") or (board2[1] == board2[4] == board2[7] == "O") or (board2[2] == board2[5] == board2[8] == "O"):
        b2win = 2
    if (board3[0] == board3[3] == board3[6] == "X") or (board3[1] == board3[4] == board3[7] == "X") or (board3[2] == board3[5] == board3[8] == "X"):
        b3win = 1
    if (board3[0] == board3[3] == board3[6] == "O") or (board3[1] == board3[4] == board3[7] == "O") or (board3[2] == board3[5] == board3[8] == "O"):
        b3win = 2
    if (board4[0] == board4[3] == board4[6] == "X") or (board4[1] == board4[4] == board4[7] == "X") or (board4[2] == board4[5] == board4[8] == "X"):
        b4win = 1
    if (board4[0] == board4[3] == board4[6] == "O") or (board4[1] == board4[4] == board4[7] == "O") or (board4[2] == board4[5] == board4[8] == "O"):
        b4win = 2
    if (board5[0] == board5[3] == board5[6] == "X") or (board5[1] == board5[4] == board5[7] == "X") or (board5[2] == board5[5] == board5[8] == "X"):
        b5win = 1
    if (board5[0] == board5[3] == board5[6] == "O") or (board5[1] == board5[4] == board5[7] == "O") or (board5[2] == board5[5] == board5[8] == "O"):
        b5win = 2
    if (board6[0] == board6[3] == board6[6] == "X") or (board6[1] == board6[4] == board6[7] == "X") or (board6[2] == board6[5] == board6[8] == "X"):
        b6win = 1
    if (board6[0] == board6[3] == board6[6] == "O") or (board6[1] == board6[4] == board6[7] == "O") or (board6[2] == board6[5] == board6[8] == "O"):
        b6win = 2
    if (board7[0] == board7[3] == board7[6] == "X") or (board7[1] == board7[4] == board7[7] == "X") or (board7[2] == board7[5] == board7[8] == "X"):
        b7win = 1
    if (board7[0] == board7[3] == board7[6] == "O") or (board7[1] == board7[4] == board7[7] == "O") or (board7[2] == board7[5] == board7[8] == "O"):
        b7win = 2
    if (board8[0] == board8[3] == board8[6] == "X") or (board8[1] == board8[4] == board8[7] == "X") or (board8[2] == board8[5] == board8[8] == "X"):
        b8win = 1
    if (board8[0] == board8[3] == board8[6] == "O") or (board8[1] == board8[4] == board8[7] == "O") or (board8[2] == board8[5] == board8[8] == "O"):
        b8win = 2
    if (board9[0] == board9[3] == board9[6] == "X") or (board9[1] == board9[4] == board9[7] == "X") or (board9[2] == board9[5] == board9[8] == "X"):
        b9win = 1
    if (board9[0] == board9[3] == board9[6] == "O") or (board9[1] == board9[4] == board9[7] == "O") or (board9[2] == board9[5] == board9[8] == "O"):    
        b9win = 2
    return b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win
b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win = checkVertical(board1, board2, board3, board4, board5 ,board6, board7 ,board8 ,board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)


def checkDiagonal(board1, board2, board3, board4, board5, board6, board7, board8, board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    if (board1[0] == board1[4] == board1[8] == "X") or (board1[2] == board1[4] == board1[6] == "X"):
        b1win = 1
    if (board1[0] == board1[4] == board1[8] == "O") or (board1[2] == board1[4] == board1[6] == "O"):
        b1win = 2
    if (board2[0] == board2[4] == board2[8] == "X") or (board2[2] == board2[4] == board2[6] == "X"):
        b2win = 1
    if (board2[0] == board2[4] == board2[8] == "O") or (board2[2] == board2[4] == board2[6] == "O"):
        b2win = 2
    if (board3[0] == board3[4] == board3[8] == "X") or (board3[2] == board3[4] == board3[6] == "X"):
        b3win = 1
    if (board3[0] == board3[4] == board3[8] == "O") or (board3[2] == board3[4] == board3[6] == "O"):
        b3win = 2
    if (board4[0] == board4[4] == board4[8] == "X") or (board4[2] == board4[4] == board4[6] == "X"):
        b4win = 1
    if (board4[0] == board4[4] == board4[8] == "O") or (board4[2] == board4[4] == board4[6] == "O"):
        b4win = 2
    if (board5[0] == board5[4] == board5[8] == "X") or (board5[2] == board5[4] == board5[6] == "X"):
        b5win = 1
    if (board5[0] == board5[4] == board5[8] == "O") or (board5[2] == board5[4] == board5[6] == "O"):
        b5win = 2
    if (board6[0] == board6[4] == board6[8] == "X") or (board6[2] == board6[4] == board6[6] == "X"):    
        b6win = 1
    if (board6[0] == board6[4] == board6[8] == "O") or (board6[2] == board6[4] == board6[6] == "O"):
        b6win = 2
    if (board7[0] == board7[4] == board7[8] == "X") or (board7[2] == board7[4] == board7[6] == "X"):
        b7win = 1
    if (board7[0] == board7[4] == board7[8] == "O") or (board7[2] == board7[4] == board7[6] == "O"):
        b7win = 2
    if (board8[0] == board8[4] == board8[8] == "X") or (board8[2] == board8[4] == board8[6] == "X"):
        b8win = 1
    if (board8[0] == board8[4] == board8[8] == "O") or (board8[2] == board8[4] == board8[6] == "O"):
        b8win = 2
    if (board9[0] == board9[4] == board9[8] == "X") or (board9[2] == board9[4] == board9[6] == "X"):
        b9win = 1
    if (board9[0] == board9[4] == board9[8] == "O") or (board9[2] == board9[4] == board9[6] == "O"):
        b9win = 2    
    return b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win
b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win = checkDiagonal(board1, board2, board3, board4, board5 ,board6, board7 ,board8 ,board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
                    
def checkGameWins(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    print(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)


def checkMatchHorizontal(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    if (b1win and b2win and b3win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b1win and b2win and b3win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!") 
        quit()
    if (b4win and b5win and b6win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b4win and b5win and b6win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!")
        quit()
    if (b7win and b8win and b9win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b7win and b8win and b9win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!")
        quit()

def checkMatchVertical(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    if (b1win and b4win and b7win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b1win and b4win and b7win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!") 
        quit()
    if (b2win and b5win and b8win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b2win and b5win and b8win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!")
        quit()
    if (b3win and b6win and b9win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b3win and b6win and b9win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!")
        quit()

def checkMatchDiagonal(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    if (b1win and b5win and b9win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b1win and b5win and b9win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!") 
        quit()
    if (b3win and b5win and b7win == 1):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print ("X Wins The Match!!!")
        quit()
    elif (b3win and b5win and b7win == 2):
        printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
        print("O Wins The Match!!!")
        quit()


def checkWin(board1,board2, board3, board4, board5, board6, board7, board8, board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win):
    global winner
    b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win = checkHorizontal(board1, board2, board3, board4, board5, board6, board7, board8, board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
    b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win = checkVertical(board1, board2, board3, board4, board5, board6, board7, board8, board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
    b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win = checkDiagonal(board1, board2, board3, board4, board5 ,board6, board7 ,board8 ,board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
    checkGameWins(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
    checkMatchHorizontal(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
    checkMatchVertical(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
    checkMatchDiagonal(b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)


# SWITCH PLAYERS

def switchPlayer():
    global currentPlayer
    if currentPlayer == "X":
        currentPlayer = "O"
    else:
        currentPlayer = "X"

    
printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9)
gameStart(board1, board2, board3, board4, board5, board6, board7, board8, board9)
while gameRunning:
    printBoard(board1, board2, board3, board4, board5, board6, board7, board8, board9) 
    switchPlayer()
    playerInput(board1, board2, board3, board4, board5, board6, board7, board8, board9)
    checkWin(board1,board2, board3, board4, board5, board6, board7, board8, board9, b1win, b2win, b3win, b4win, b5win, b6win, b7win, b8win, b9win)
    gameRunning = True
    


