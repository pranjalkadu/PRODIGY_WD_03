const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let isPlayerVsAI = false;  // Flag to check if the mode is Player vs AI

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Start Player vs Player game
function startPlayerVsPlayer() {
  gameActive = true;
  currentPlayer = 'X';
  board = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = "Player X's Turn";
  cells.forEach(cell => cell.textContent = "");
  isPlayerVsAI = false;
}

// Start Player vs AI game
function startPlayerVsAI() {
  gameActive = true;
  currentPlayer = 'X';  // Player X starts
  board = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = "Player X's Turn";
  cells.forEach(cell => cell.textContent = "");
  isPlayerVsAI = true;
}

// Handle player click
function handleClick(e) {
  const index = e.target.getAttribute('data-index');

  // Ignore if cell is already filled or game is not active
  if (board[index] !== "" || !gameActive || (isPlayerVsAI && currentPlayer === 'O')) return;

  // Fill the cell with current player's symbol
  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  // Check for a winner or a draw
  checkResult();

  // If it's Player vs AI mode, let AI play after the player
  if (gameActive && isPlayerVsAI && currentPlayer === 'X') {
    currentPlayer = 'O';
    statusText.textContent = "AI's Turn";
    setTimeout(aiMove, 500); // Delay to simulate AI's thinking
  } else if (gameActive && !isPlayerVsAI) {
    // Change turn if it's Player vs Player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

// Check for a winner or a draw
function checkResult() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `Player ${currentPlayer} Wins!`;
      gameActive = false;
      return;
    }
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }
}

// Reset the game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = 'X';
  gameActive = false;
  statusText.textContent = "Select a game mode";
  cells.forEach(cell => cell.textContent = "");
}

// AI move (Player O)
function aiMove() {
  const bestMove = minimax(board, 'O').index;
  board[bestMove] = 'O';
  cells[bestMove].textContent = 'O';
  checkResult();

  // After AI's move, switch back to Player X's turn
  if (gameActive) {
    currentPlayer = 'X';
    statusText.textContent = "Player X's Turn";
  }
}

// Minimax algorithm to find the best AI move
function minimax(board, player) {
  const availableSpots = board
    .map((value, index) => value === "" ? index : null)
    .filter(value => value !== null);

  if (checkWin(board, 'X')) {
    return { score: -10 };
  } else if (checkWin(board, 'O')) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availableSpots.length; i++) {
    const move = {};
    move.index = availableSpots[i];
    board[move.index] = player;

    if (player === 'O') {
      const result = minimax(board, 'X');
      move.score = result.score;
    } else {
      const result = minimax(board, 'O');
      move.score = result.score;
    }

    board[move.index] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  return bestMove;
}

// Check if a player has won
function checkWin(board, player) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
