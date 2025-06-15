import Game from './game.js';
import { updateGameBoard, updateScore, showNameInput, updateLeaderboard } from './ui.js';
import { isMobileDevice, updateGameBoardSize, toggleDarkMode, toggleFullscreen } from './utils.js';
import { setupKeyboardControls, setupTouchControls } from './controls.js';

const GRID_SIZE = 20;
let game;
let cellSize;
let animationId;
let lastRender = 0;
let isFullscreen = false;
let isPaused = false;
let difficulty = 'easy'; // default

// DOM Elements
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const levelElement = document.getElementById('level');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const darkModeToggle = document.getElementById('checkbox');
const submitScoreButton = document.getElementById('submit-score');
const playerNameInput = document.getElementById('player-name');
const nameInputModal = document.getElementById('name-input');
const easyButton = document.getElementById('easy-button');
const hardButton = document.getElementById('hard-button');
const difficultySelect = document.getElementById('difficulty-select');
const modeWarning = document.getElementById('mode-warning');

function updateBoardGridBackground(cellSize) {
    gameBoard.style.backgroundSize = `${cellSize}px ${cellSize}px`;
}

function initGame() {
    cellSize = updateGameBoardSize(gameBoard);
    updateBoardGridBackground(cellSize);
    game = new Game(GRID_SIZE, cellSize, difficulty);

    // Ensure food is present
    if (!game.food) {
        game.createFood();
    }

    updateScore(0);
    updateHighScore();
    updateLevel(1);
    lastRender = 0;
    resetPauseButton();
    isPaused = false;
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';

    if (isMobileDevice()) {
        document.getElementById('mobile-controls').style.display = 'flex';
    }
    
    updateGameBoard(game, gameBoard);
    animationId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
    }

    if (!lastRender || timestamp - lastRender >= game.gameSpeed) {
        if (game.moveSnake()) {
            // Ensure food is present after move
            if (!game.food) {
                game.createFood();
            }
            updateGameBoard(game, gameBoard);
            updateScore(game.score);
            updateLevel(game.level);
            updateHighScore();
            lastRender = timestamp;
        } else {
            gameOver();
            return;
        }
    }
    animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    cancelAnimationFrame(animationId);
    if (game.score > 0) {
        showNameInput(game.score);
    } else {
        resetGame();
    }
}

function resetGame() {
    cancelAnimationFrame(animationId);
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    restartButton.style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
    resetPauseButton();
}

function resetPauseButton() {
    isPaused = false;
    pauseButton.textContent = 'Pause';
}

function submitScore() {
    const playerName = playerNameInput.value.trim() || 'Anonymous';
    let leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
    leaderboard.push({name: playerName, score: game.score});
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // Keep top 5
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
    updateLeaderboard(leaderboard);
    nameInputModal.style.display = 'none';
    resetGame();
}

function updateHighScore() {
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    if (game && game.score > highScore) {
        highScore = game.score;
        localStorage.setItem('snakeHighScore', highScore);
    }
    highScoreElement.textContent = `High Score: ${highScore}`;
}

function updateLevel(level) {
    levelElement.textContent = `Level: ${level}`;
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}

// Difficulty button handlers
easyButton.addEventListener('click', () => {
    difficulty = 'easy';
    easyButton.classList.add('selected');
    hardButton.classList.remove('selected');
    startButton.disabled = false; // Enable Start
});
hardButton.addEventListener('click', () => {
    difficulty = 'hard';
    hardButton.classList.add('selected');
    easyButton.classList.remove('selected');
    startButton.disabled = false; // Enable Start
});

// Event Listeners
function addEventListeners() {
    startButton.addEventListener('click', (e) => {
        if (startButton.disabled) {
            modeWarning.style.display = 'block';
            setTimeout(() => { modeWarning.style.display = 'none'; }, 2000);
            e.preventDefault();
            return;
        }
        modeWarning.style.display = 'none';
        initGame();
    });
    restartButton.addEventListener('click', () => {
        resetGame();
        initGame();
    });
    pauseButton.addEventListener('click', togglePause);
    
    fullscreenToggle.addEventListener('click', () => {
        isFullscreen = toggleFullscreen(isFullscreen, fullscreenToggle);
        cellSize = updateGameBoardSize(gameBoard);
        if (game) updateGameBoard(game, gameBoard);
    });
    
    darkModeToggle.addEventListener('change', toggleDarkMode);
    submitScoreButton.addEventListener('click', submitScore);

    setupKeyboardControls((dx, dy) => {
        if (game && !isPaused) game.changeDirection(dx, dy);
    });
    if (isMobileDevice()) {
        setupTouchControls((dx, dy) => {
            if (game && !isPaused) game.changeDirection(dx, dy);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateGameBoardSize(gameBoard);
    let leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
    updateLeaderboard(leaderboard);
    addEventListeners();
    if (localStorage.getItem('darkMode') === 'true') {
        darkModeToggle.checked = true;
        toggleDarkMode();
    }
});

window.addEventListener('resize', () => {
    if (gameBoard) {
        cellSize = updateGameBoardSize(gameBoard);
        updateBoardGridBackground(cellSize); // <-- Add this line
        if (game) updateGameBoard(game, gameBoard);
    }
});
