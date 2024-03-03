// Define the number of rows, columns, and mines
let ROWS = 8;
let COLUMNS = 8;
let MINES = Math.round(10 / 4 * 3.14);

// Initialize the board, board element, and message element
let board = [];
let boardElement = document.getElementById('board');
let messageElement = document.getElementById('message');

// Get the reset button and add a click event listener
let resetButton = document.getElementById('reset');
resetButton.addEventListener('click', function () {
    resetGame();
    renderBoard();
    messageElement.innerHTML = '';
});

// Get the medium button and add a click event listener
let mediumButton = document.getElementById('medium');
mediumButton.addEventListener('click', function () {
    ROWS = 16;
    COLUMNS = 16;
    MINES = Math.floor(40 / 4 * 3.14);
    resetGame();
    renderBoard();
    messageElement.innerHTML = '';
});

// Get the hard button and add a click event listener
let hardButton = document.getElementById('hard');
hardButton.addEventListener('click', function () {
    ROWS = 30;
    COLUMNS = 30;
    MINES = Math.floor(99 / 4 * 3.14);
    resetGame();
    renderBoard();
    messageElement.innerHTML = '';
});

// Get the easy button and add a click event listener
let easyButton = document.getElementById('easy');
easyButton.addEventListener('click', function () {
    ROWS = 8;
    COLUMNS = 8;
    MINES = Math.floor(10 / 4 * 3.14);
    resetGame();
    renderBoard();
    messageElement.innerHTML = '';
});

// Create a minesweeper board
function createBoard() {
    // Calculate the center of the board
    const centerX = ROWS / 2 - 0.5;
    const centerY = COLUMNS / 2 - 0.5;
    // Calculate the radius of the circle
    const radius = Math.min(ROWS, COLUMNS) / 2;

    // Loop through each row and column to create cells
    for (let i = 0; i < ROWS; i++) {
        board.push([]);
        for (let j = 0; j < COLUMNS; j++) {
            // Calculate the distance to the center of the board
            const distanceToCenter = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
            // Create a cell object with initial properties
            board[i].push({
                row: i,
                column: j,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                isHidden: distanceToCenter > radius,
                neighbor: 0
            });
        }
    }

    // Add mines to the board
    for (let i = 0; i < MINES; i++) {
        let randomRow = Math.floor(Math.random() * ROWS);
        let randomColumn = Math.floor(Math.random() * COLUMNS);

        let cell = board[randomRow][randomColumn];
        if (cell.isMine || cell.isHidden) {
            i--;
        } else {
            cell.isMine = true;
        }
    }

    // Calculate the number of mines around each cell
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            let cell = board[i][j];
            if (!cell.isMine) {
                cell.neighbor = countNeighborMines(cell);
            }
        }
    }
}

// Count the number of mines around a cell
function countNeighborMines(cell) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let x = cell.row + i;
            let y = cell.column + j;
            if (x >= 0 && x < ROWS && y >= 0 && y < COLUMNS) {
                if (board[x][y].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Reveal the entire board
function revealBoard() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            board[i][j].isRevealed = true;
        }
    }
}

// Reveal a cell and its neighbors
function revealCell(cell) {
    if (cell.isRevealed || cell.isFlagged) {
        return;
    }
    cell.isRevealed = true;
    if (cell.isMine) {
        revealBoard();
    }
    if (cell.neighbor === 0) {
        revealEmptyCells(cell);
    }
}

// Reveal empty cells using depth-first search
function revealEmptyCells(cell) {
    // Create a stack to store the cells to be revealed
    let cells = [cell]; 
    // Continue until all cells have been revealed
    while (cells.length > 0) { 
        let currentCell = cells.pop();
        // Loop through the neighboring cells
        for (let i = -1; i <= 1; i++) { 
            for (let j = -1; j <= 1; j++) {
                let x = currentCell.row + i; 
                let y = currentCell.column + j; 
                if (x >= 0 && x < ROWS && y >= 0 && y < COLUMNS) {
                    let neighbor = board[x][y];
                    if (!neighbor.isRevealed) { 
                        neighbor.isRevealed = true; 
                        // If the neighbor is empty, add it to the stack
                        if (neighbor.neighbor === 0) {
                            cells.push(neighbor); 
                        }
                    }
                }
            }
        }
    }
}

// Flag or unflag a cell
function flagCell(cell) {
    if (!cell.isRevealed) {
        cell.isFlagged = !cell.isFlagged;
    }
}

// Check if the game is won
function isGameWon() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            let cell = board[i][j];
            if (!cell.isHidden && !cell.isRevealed && !cell.isMine) {
                return false;
            }
        }
    }
    return true;
}

// Check if the game is lost
function isGameLost() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            let cell = board[i][j];
            if (cell.isRevealed && cell.isMine) {
                return true;
            }
        }
    }
    return false;
}

// Reset the game
function resetGame() {
    board = [];
    createBoard();
}

// Display the board on the screen
function renderBoard() {
    boardElement.innerHTML = '';
    let table = document.createElement('table');

    for (let i = 0; i < ROWS; i++) {
        let row = document.createElement('tr');
        row.className = 'row';
        for (let j = 0; j < COLUMNS; j++) {
            let cell = document.createElement('td');
            cell.className = 'cell';
            let currentCell = board[i][j];
            if (!currentCell.isHidden) {
                if (currentCell.isRevealed) {
                    cell.classList.add('revealed');
                    if (currentCell.isMine) {
                        cell.classList.add('mine');
                    } else if (currentCell.neighbor > 0) {
                        cell.innerHTML = currentCell.neighbor;
                    }
                } else if (currentCell.isFlagged) {
                    cell.classList.add('flag');
                }
                cell.addEventListener('click', function () {
                    revealCell(currentCell);
                    if (isGameLost()) {
                        messageElement.innerHTML = 'You lost';
                        revealBoard();
                    } else if (isGameWon()) {
                        messageElement.innerHTML = 'You win';
                        revealBoard();
                    }
                    renderBoard();
                });
                cell.oncontextmenu = function (e) {
                    e.preventDefault();
                    flagCell(currentCell);
                    renderBoard();
                };
            }
            else {
                cell.classList.add('hidden');
            }
            row.appendChild(cell);
        }
        if (row.hasChildNodes()) {
            table.appendChild(row);
        }
    }
    boardElement.appendChild(table);
}

// Initialize the game
resetGame();
renderBoard();