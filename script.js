// Variable to store the Sudoku puzzle received from the API
var preFilledBoard = []

// Store all the div elements from the HTML web page in a 2D array
var sudokuBoard = [];

// Store the flag to denote whether a cell in the Sudoku board is filled or not
var cellsFilled = [];

// Function to load all the div elements and store them in the 2D array
const loadCellDivs = () => {

    // Loop over each row of the Sudoku board
    for (var i = 0; i < 9; i++) {

        // Store each row in an array
        const row = [];

        // Loop over each column
        for (var j = 0; j < 9; j++) {
            // Store the div elements in a particular row
            row.push(document.getElementById(i * 9 + j));
        }

        // Store each row containing the div elements in the global 2D array
        sudokuBoard[i] = row;
    }
}

// Function to initialize all the cells to be empty by setting the value to false
const initializeFilledCells = (cellsFilled) => {

    // Loop over each row of the Sudoku board
    for (var i = 0; i < 9; i++) {

        // Store each row in an array
        const row = [];

        // Loop over each column of the Sudoku board
        for (var j = 0; j < 9; j++) {
            // Store false for each cell as initially all cells will be empty
            row.push(false);
        }

        // Store each row in a global 2D array
        cellsFilled[i] = row;
    }
}

// Function to set the flag for the filled cells
function setCellsFilled(board, cellsFilled) {

    // Loop over each row of the Sudoku board
    for (var i = 0; i < 9; i++) {

        // Loop over each column of the Sudoku board
        for (var j = 0; j < 9; j++) {

            // Check whether the Sudoku board is filled using the 
            // board received from the API
            if (board[i][j] != 0) {

                // Store true for the filled cell in the global 2D array
                cellsFilled[i][j] = true;
            }
        }
    }
}

// Function to set a different color for the filled cells in the Sudoku board
const setFilledCellsColor = (cellsFilled) => {

    // Loop over each row of the Sudoku board
    for (var i = 0; i < 9; i++) {

        // Loop over each column of the Sudoku board
        for (var j = 0; j < 9; j++) {

            // Check whether the Sudoku board is filled
            if (cellsFilled[i][j] == true) {

                // Set a different color for the filled cells
                sudokuBoard[i][j].style.color = "#DC3545";
            }
        }
    }
}

// Function to initialize the color for all the cells
const initializeColor = () => {

    // Loop over each row of the Sudoku board
    for (var i = 0; i < 9; i++) {

        // Loop over each column of the Sudoku board
        for (var j = 0; j < 9; j++) {

            // Initialize the color for the cells to be green
            sudokuBoard[i][j].style.color = "green";
        }
    }
}

// Function to display the Sudoku puzzle on the HTML web page
const changeBoard = (board) => {

    // Loop over each row of the Sudoku board
    for (var i = 0; i < 9; i++) {

        // Loop over each column of the Sudoku board
        for (var j = 0; j < 9; j++) {

            // If the cell from the API is non-zero
            if (board[i][j] != 0) {

                // Set the number on the div element 
                sudokuBoard[i][j].innerText = board[i][j]
            }

            // If the cell from the API is zero
            else {

                // Set empty string on the div element
                sudokuBoard[i][j].innerText = ''
            }
        }
    }
}

// Function to fetch the Sudoku puzzle and render it on the HTML web page
const fetchSudokuData = () => {

    // Disable the buttons
    button.disabled = true;
    solve.disabled = true;

    // Create an object of XMLHttpRequest
    var request = new XMLHttpRequest()

    // Callback function attached when the request is completed successfully
    request.onload = () => {
        var response = JSON.parse(request.response)

        // Call the function to load all the div elements and store them in the 2D array
        loadCellDivs()

        // Call the gunction to initialize all the cells to be empty by setting the value to false
        initializeFilledCells(cellsFilled)

        // Call the function to initialize the color for all the cells
        initializeColor()

        // Set the board from the API to the global variable
        preFilledBoard = response.board

        // Function to set the flag for the filled cells
        setCellsFilled(preFilledBoard, cellsFilled)

        // Call the function to set a different color for the filled cells in the Sudoku board
        setFilledCellsColor(cellsFilled)

        // Function to display the Sudoku question on the HTML web page
        changeBoard(preFilledBoard)

        // Enable the buttons
        button.disabled = false;
        solve.disabled = false;
    }
    // Create a GET request
    request.open("get", window.location.href + "puzzle")

    // Send the GET request to the API
    request.send()
}

// Function to check whether it is safe to assign a number at (row, col)
function isSafeToAssign(board, row, col, number) {

    // Iterate over the current row and the column
    for (var i = 0; i < 9; i++) {

        // Check if the number is already present in the current row and the column
        if (board[i][col] == number || board[row][i] == number) {

            // Return false since it voilates the condition for Sudoku
            return false;
        }
    }

    // Find the cell number for the current sub-grid of size (3 x 3)
    var sx = row - row % 3;
    var sy = col - col % 3;

    // Iterate over all the rows of the current sub-grid
    for (var x = sx; x < sx + 3; x++) {

        // Iterate over all the columns of the current sub-grid
        for (var y = sy; y < sy + 3; y++) {

            // Check if the number is present in the subgrid
            if (board[x][y] == number) {

                // Return false since it voilates the condition for Sudoku
                return false;
            }
        }
    }

    // Return true since it is safe to insert the number at the current cell position
    return true;
}

// Recursive function to solve Sudoku
function solveSudokuRecursively(board, row, col) {

    // Check if all the rows are traversed 
    if (row == 9) {

        // Render the solution on the HTML web page
        changeBoard(board);
        return true;
    }

    // Check if all the columns of a row are traversed
    if (col == 9) {

        // Call the function recursively for next row and first column
        return solveSudokuRecursively(board, row + 1, 0);
    }

    // Check if the cell is already filled
    if (board[row][col] != 0) {

        // Call the function recursively for current row and next column
        return solveSudokuRecursively(board, row, col + 1);
    }

    // Iterate from 1 to 9 to fill the numbers in the Sudoku board
    for (var i = 1; i <= 9; i++) {

        // Check whether it is safe to place the number at (row, col)
        if (isSafeToAssign(board, row, col, i)) {

            // Place the number at (row, col)
            board[row][col] = i;

            // Call the funciton recursively for the current row and next column
            const success = solveSudokuRecursively(board, row, col + 1);

            // Check whether the current state of Sudoku is correct
            if (success == true) {

                // Return true indicating that the number placed is correct and 
                // Sudoku is in its correct state
                return true;
            }

            // Backtracking step by removing the number placed and replacing it with 0
            board[row][col] = 0;
        }
    }

    // Return false since the Sudoku is not solvable
    return false;
}

// Callback function for the button click event
function solveSudoku() {

    // Disable the buttons
    button.disabled = true;
    solve.disabled = true;

    solveSudokuRecursively(preFilledBoard, 0, 0);

    // Enable the buttons
    button.disabled = false;
    solve.disabled = false;
}

// Access the generate new puzzle button
let button = document.getElementById('generate-sudoku')
let solve = document.getElementById('solve')

// Attach an event listener on the button
button.addEventListener("click", fetchSudokuData);
solve.addEventListener("click", solveSudoku);