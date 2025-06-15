// Constants
const GRID_SIZE = 20;
let CELL_SIZE = 20;
const INITIAL_SNAKE_POSITION = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
const INITIAL_GAME_SPEED = 250;

// This function to adjust cell size based on screen width
function adjustCellSize() {
    if (window.innerWidth <= 480) {
        CELL_SIZE = 15; // 300px / 20 cells
    } else {
        CELL_SIZE = 20; // 400px / 20 cells
    }
}

// This function initially and on window resize
adjustCellSize();
window.addEventListener('resize', adjustCellSize);

// Game state
let snake = [INITIAL_SNAKE_POSITION];
let food = {};
let dx = 1;
let dy = 0;
let score = 0;
let gameSpeed = INITIAL_GAME_SPEED;
let gameLoop;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const nameInput = document.getElementById('name-input');
const playerNameInput = document.getElementById('player-name');
const submitScoreButton = document.getElementById('submit-score');
const leaderboardList = document.getElementById('leaderboard-list');

// Event Listeners
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', restartGame);
submitScoreButton.addEventListener('click', submitScore);

function initGame() {
    snake = [INITIAL_SNAKE_POSITION];
    createFood();
    score = 0;
    dx = 1;
    dy = 0;
    updateScore();
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    gameLoop = setInterval(moveSnake, gameSpeed);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    };
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    if (isCollision(head) || isWallCollision(head)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        createFood();
    } else {
        snake.pop();
    }

    updateGameBoard();
}

function isCollision(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function isWallCollision(position) {
    return position.x < 0 || position.x >= GRID_SIZE || position.y < 0 || position.y >= GRID_SIZE;
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY && dx !== 1) { dx = -1; dy = 0; }
    if (keyPressed === UP_KEY && dy !== 1) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT_KEY && dx !== -1) { dx = 1; dy = 0; }
    if (keyPressed === DOWN_KEY && dy !== -1) { dx = 0; dy = 1; }
}

function updateGameBoard() {
    gameBoard.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x * CELL_SIZE + 1}px`; // +1 for grid line
        snakeElement.style.top = `${segmenment.y * CELL_SIZE + 1}px`; // +1 for grid line
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x * CELL_SIZE + 1}px`; // +1 for grid line
    foodElement.style.top = `${food.y * CELL_SIZE + 1}px`; // +1 for grid line
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function gameOver() {
    clearInterval(gameLoop);
    nameInput.style.display = 'block';
}

function submitScore() {
    const playerName = playerNameInput.value.trim() || 'Anonymous';
    updateLeaderboard(playerName, score);
    nameInput.style.display = 'none';
    resetGame();
}

function updateLeaderboard(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
    leaderboard.push({name, score});
    leaderboard.sort((a, b) => b.score - a.score);
    const topScores = leaderboard.slice(0, 5);
    localStorage.setItem('snakeLeaderboard', JSON.stringify(topScores));
    
    leaderboardList.innerHTML = '';
    topScores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

function resetGame() {
    snake = [INITIAL_SNAKE_POSITION];
    createFood();
    score = 0;
    dx = 1;
    dy = 0;
    updateScore();
    updateGameBoard();
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
}

function restartGame() {
    resetGame();
    initGame();
}

// Initialize game
createFood();
updateGameBoard();
updateLeaderboard('', 0);
