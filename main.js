import Game from './game.js';
import { updateGameBoard, updateScore, showNameInput, updateLeaderboard } from './ui.js';
import { isMobileDevice, updateGameBoardSize, toggleDarkMode, toggleFullscreen } from './utils.js';
import { setupKeyboardControls, setupTouchControls } from './controls.js';

console.log("main.js loaded");

const GRID_SIZE = 20;
let game;
let cellSize;
let animationId;
let lastRender = 0;
let isFullscreen = false;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const darkModeToggle = document.getElementById('checkbox');
const submitScoreButton = document.getElementById('submit-score');
const playerNameInput = document.getElementById('player-name');
const nameInputModal = document.getElementById('name-input');

function initGame() {
    console.log("initGame called");
    game = new Game(GRID_SIZE);
    cellSize = updateGameBoardSize(gameBoard);
    updateScore(0);
    animationId = requestAnimationFrame(gameLoop);
    startButton.style.display = 'none';
    restartButton.style.display = 'block';

    if (isMobileDevice()) {
        document.getElementById('mobile-controls').style.display = 'flex';
    }
    
    updateGameBoard(game, gameBoard, cellSize);
}

function gameLoop(timestamp) {
    if (timestamp - lastRender >= game.gameSpeed) {
        if (game.moveSnake()) {
            updateGameBoard(game, gameBoard, cellSize);
            updateScore(game.score);
            lastRender = timestamp;
        } else {
            gameOver();
            return;
        }
    }
    animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    console.log("Game Over");
    cancelAnimationFrame(animationId);
    if (game.score > 0) {
        showNameInput(game.score);
    } else {
        resetGame();
    }
}

function resetGame() {
    console.log("resetGame called");
    cancelAnimationFrame(animationId);
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
}

function submitScore() {
    console.log("submitScore called");
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

// Event Listeners
function addEventListeners() {
    console.log("Adding event listeners");
    if (startButton) {
        console.log("Start button found");
        startButton.addEventListener('click', () => {
            console.log("Start button clicked");
            initGame();
        });
    } else {
        console.log("Start button not found");
    }
    
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            console.log("Restart button clicked");
            resetGame();
            initGame();
        });
    }
    
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', () => {
            console.log("Fullscreen toggle clicked");
            isFullscreen = toggleFullscreen(isFullscreen, fullscreenToggle);
            cellSize = updateGameBoardSize(gameBoard);
            if (game) updateGameBoard(game, gameBoard, cellSize);
        });
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            console.log("Dark mode toggle changed");
            toggleDarkMode();
        });
    }
    
    if (submitScoreButton) {
        submitScoreButton.addEventListener('click', submitScore);
    }

    // Setup controls
    setupKeyboardControls((dx, dy) => {
        if (game) game.changeDirection(dx, dy);
    });
    if (isMobileDevice()) {
        setupTouchControls((dx, dy) => {
            if (game) game.changeDirection(dx, dy);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");
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
