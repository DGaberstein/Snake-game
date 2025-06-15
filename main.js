import Game from './game.js';
import { updateGameBoard, updateScore, showNameInput, updateLeaderboard } from './ui.js';
import { isMobileDevice, updateGameBoardSize, toggleDarkMode, toggleFullscreen } from './utils.js';
import { setupKeyboardControls, setupTouchControls } from './controls.js';

const GRID_SIZE = 20;
let game;
let cellSize;
let gameInterval = null;
let isPaused = false;
let isFullscreen = false;

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

function startGame() {
    cellSize = updateGameBoardSize(gameBoard);
    game = new Game(GRID_SIZE, cellSize);
    updateScore(0);
    updateHighScore();
    updateLevel(1);
    isPaused = false;
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
    if (isMobileDevice()) {
        document.getElementById('mobile-controls').style.display = 'flex';
    }
    updateGameBoard(game, gameBoard);
    runGameLoop();
}

function runGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (!isPaused) {
            const prevSpeed = game.gameSpeed;
            const moveResult = game.moveSnake();
            if (moveResult === true) {
                updateGameBoard(game, gameBoard);
                updateScore(game.score);
                updateLevel(game.level);
                updateHighScore();
                if (game.gameSpeed !== prevSpeed) {
                    runGameLoop();
                }
            } else if (moveResult === "win") {
                updateGameBoard(game, gameBoard);
                setTimeout(() => alert("Congratulations! You win!"), 100);
                endGame();
            } else {
                endGame();
            }
        }
    }, game.gameSpeed);
}

function endGame() {
    clearInterval(gameInterval);
    if (game.score > 0) {
        showNameInput(game.score);
    } else {
        resetGame();
    }
}

function resetGame() {
    clearInterval(gameInterval);
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    restartButton.style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
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

function addEventListeners() {
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', () => {
        resetGame();
        startGame();
    });
    pauseButton.addEventListener('click', togglePause);

    fullscreenToggle.addEventListener('click', () => {
        isFullscreen = toggleFullscreen(isFullscreen, fullscreenToggle);
        cellSize = updateGameBoardSize(gameBoard);
        if (game) {
            game.cellSize = cellSize;
            updateGameBoard(game, gameBoard);
        }
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
