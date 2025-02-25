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

function initGame() {
    cellSize = updateGameBoardSize(gameBoard);
    game = new Game(GRID_SIZE, cellSize);
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
    console.log('gameLoop called'); // Add this
    if (isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
    }

    if (!lastRender || timestamp - lastRender >= game.gameSpeed) {
        console.log('Moving snake'); // Add this
        if (game.moveSnake()) {
            console.log('Snake:', game.snake); // Add this
            updateGameBoard(game, gameBoard, cellSize);
            updateScore(game.score);
            updateLevel(game.level);
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
    const highScore = localStorage.getItem('snakeHighScore') || 0;
    highScoreElement.textContent = `High Score: ${highScore}`;
}

function updateLevel(level) {
    levelElement.textContent = `Level: ${level}`;
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}

// Event Listeners
function addEventListeners() {
    startButton.addEventListener('click', initGame);
    restartButton.addEventListener('click', () => {
        resetGame();
        initGame();
    });
    pauseButton.addEventListener('click', togglePause);
    
    fullscreenToggle.addEventListener('click', () => {
        isFullscreen = toggleFullscreen(isFullscreen, fullscreenToggle);
        cellSize = updateGameBoardSize(gameBoard);
        if (game) updateGameBoard(game, gameBoard, cellSize);
    });
    
    darkModeToggle.addEventListener('change', toggleDarkMode);
    submitScoreButton.addEventListener('click', submitScore);

    // Setup controls
    setupKeyboardControls((dx, dy) => {
        if (game && !isPaused) game.changeDirection(dx, dy);
    });
    if (isMobileDevice()) {
        setupTouchControls((dx, dy) => {
            if (game && !isPaused) game.changeDirection(dx, dy);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateGameBoardSize(gameBoard);
    let leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
    updateLeaderboard(leaderboard);
    addEventListeners();
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        darkModeToggle.checked = true;
        toggleDarkMode();
    }
});
