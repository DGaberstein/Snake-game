// Constants
const GRID_SIZE = 20;
const INITIAL_SNAKE_POSITION = { x: 200, y: 200 };
const INITIAL_GAME_SPEED = 250;
const MOBILE_GAME_SPEED = 250;
const SPEED_INCREASE_RATE = 0.0025;
const MOBILE_SPEED_INCREASE_RATE = 0.0025;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');
const nameInput = document.getElementById('name-input');
const playerNameInput = document.getElementById('player-name');
const submitScoreButton = document.getElementById('submit-score');
const finalScoreSpan = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const checkbox = document.getElementById('checkbox');
const mobileControls = document.getElementById('mobile-controls');
const fullscreenToggle = document.getElementById('fullscreen-toggle');

// Game state
let snake = [INITIAL_SNAKE_POSITION];
let food = {};
let dx = GRID_SIZE;
let dy = 0;
let score = 0;
let gameSpeed = INITIAL_GAME_SPEED;
let gameLoop;
let leaderboard = [];
let isFullscreen = false;

// Touch handling
let touchStartX = 0;
let touchStartY = 0;

// Mobile controls
const mobileButtons = {
    up: document.getElementById('up-button'),
    down: document.getElementById('down-button'),
    left: document.getElementById('left-button'),
    right: document.getElementById('right-button')
};

Object.values(mobileButtons).forEach(button => {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection({ keyCode: parseInt(button.dataset.key) });
    });
});

// Event Listeners
document.addEventListener('keydown', changeDirection);
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', restartGame);
submitScoreButton.addEventListener('click', submitScore);
checkbox.addEventListener('change', toggleDarkMode);
fullscreenToggle.addEventListener('click', toggleFullscreen);
window.addEventListener('resize', updateGameBoardSize);

// Utility Functions
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) return;

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let deltaX = touchStartX - touchEndX;
    let deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        changeDirection({ keyCode: deltaX > 0 ? 37 : 39 });
    } else {
        changeDirection({ keyCode: deltaY > 0 ? 38 : 40 });
    }

    touchStartX = 0;
    touchStartY = 0;
    event.preventDefault();
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
    }
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (gameBoard.clientWidth / GRID_SIZE)) * GRID_SIZE,
        y: Math.floor(Math.random() * (gameBoard.clientHeight / GRID_SIZE)) * GRID_SIZE
    };
    // Ensure food doesn't appear on snake
    while (snake.some(part => part.x === food.x && part.y === food.y)) {
        createFood();
    }
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = 'Score: ' + score;
        createFood();
        increaseSpeed();
    } else {
        snake.pop();
    }

    updateGameBoard();
}

function isCollision(position) {
    return position.x < 0 || 
           position.x >= gameBoard.clientWidth || 
           position.y < 0 || 
           position.y >= gameBoard.clientHeight ||
           snake.slice(1).some(part => part.x === position.x && part.y === position.y);
}

function updateGameBoard() {
    // Clear previous state
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    // Draw snake
    snake.forEach((part, index) => {
        const snakePart = document.createElement('div');
        snakePart.style.left = `${part.x}px`;
        snakePart.style.top = `${part.y}px`;
        snakePart.classList.add('snake-part');
        if (index === 0) snakePart.classList.add('snake-head');
        gameBoard.appendChild(snakePart);
    });

    // Draw food
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function gameOver() {
    clearInterval(gameLoop);
    if (score > 0) {
        showNameInput();
    } else {
        resetGame();
    }
}

function increaseSpeed() {
    if (isMobileDevice()) {
        if (gameSpeed > 150) {
            gameSpeed -= MOBILE_SPEED_INCREASE_RATE;
            resetGameLoop();
        }
    } else {
        if (gameSpeed > 120) {
            gameSpeed -= SPEED_INCREASE_RATE;
            resetGameLoop();
        }
    }
}

function resetGameLoop() {
    clearInterval(gameLoop);
    gameLoop = setInterval(moveSnake, gameSpeed);
}

function showNameInput() {
    finalScoreSpan.textContent = score;
    nameInput.style.display = 'block';
}

function submitScore() {
    if (score > 0) {
        const playerName = playerNameInput.value.trim() || 'Anonymous';
        leaderboard.push({name: playerName, score: score});
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5);
        updateLeaderboard();
        // Save leaderboard to local storage
        localStorage.setItem('snakeGameLeaderboard', JSON.stringify(leaderboard));
    }
    nameInput.style.display = 'none';
    resetGame();
}

function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

function initGame() {
    snake = [INITIAL_SNAKE_POSITION];
    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    gameSpeed = isMobileDevice() ? MOBILE_GAME_SPEED : INITIAL_GAME_SPEED;
    
    scoreElement.textContent = 'Score: 0';
    createFood();
    gameLoop = setInterval(moveSnake, gameSpeed);
    startButton.style.display = 'none';
    restartButton.style.display = 'block';

    if (isMobileDevice()) {
        mobileControls.style.display = 'flex';
        // Adjust game board size for mobile
        gameBoard.style.width = '100%';
        gameBoard.style.height = '100vw';
    }
}

function resetGame() {
    clearInterval(gameLoop);
    snake = [INITIAL_SNAKE_POSITION];
    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    gameSpeed = isMobileDevice() ? MOBILE_GAME_SPEED : INITIAL_GAME_SPEED;
    scoreElement.textContent = 'Score: 0';
    createFood();
    updateGameBoard();
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
    mobileControls.style.display = 'none';
    // Reset game board size
    gameBoard.style.width = '';
    gameBoard.style.height = '';
    if (isFullscreen) {
        toggleFullscreen();
    }
}

function restartGame() {
    resetGame();
    initGame();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Save dark mode preference to local storage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    // Redraw the game board to ensure visibility
    updateGameBoard();
}

function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    document.body.classList.toggle('fullscreen-mode', isFullscreen);
    
    fullscreenToggle.innerHTML = isFullscreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
    
    if (isFullscreen) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    
    updateGameBoardSize();
    updateGameBoard();
}

function updateGameBoard() {
    // Clear previous state
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    const cellSize = gameBoard.clientWidth / GRID_SIZE;

    // Draw snake
    snake.forEach((part, index) => {
        const snakePart = document.createElement('div');
        snakePart.style.left = `${part.x / GRID_SIZE * 100}%`;
        snakePart.style.top = `${part.y / GRID_SIZE * 100}%`;
        snakePart.style.width = `${cellSize}px`;
        snakePart.style.height = `${cellSize}px`;
        snakePart.classList.add('snake-part');
        if (index === 0) snakePart.classList.add('snake-head');
        gameBoard.appendChild(snakePart);
    });

    // Draw food
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x / GRID_SIZE * 100}%`;
    foodElement.style.top = `${food.y / GRID_SIZE * 100}%`;
    foodElement.style.width = `${cellSize}px`;
    foodElement.style.height = `${cellSize}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

// Initialize game
function init() {
    // Load leaderboard from local storage
    const savedLeaderboard = localStorage.getItem('snakeGameLeaderboard');
    if (savedLeaderboard) {
        leaderboard = JSON.parse(savedLeaderboard);
        updateLeaderboard();
    }

    // Load dark mode preference
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
        document.body.classList.add('dark-mode');
        checkbox.checked = true;
    }

    createFood();
    updateGameBoard();
}

init();
