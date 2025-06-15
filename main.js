import Game from './game.js';
import { updateGameBoard, updateScore, showNameInput, updateLeaderboard } from './ui.js';
import { isMobileDevice, updateGameBoardSize, toggleDarkMode, toggleFullscreen } from './utils.js';
import { setupKeyboardControls, setupTouchControls } from './controls.js';

const GRID_SIZE = 20;
let game;
let cellSize;
<<<<<<< HEAD
let gameInterval = null;
let isPaused = false;
let isFullscreen = false;
=======
let animationId;
let lastRender = 0;
let isFullscreen = false;
let isPaused = false;
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559

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

<<<<<<< HEAD
function startGame() {
=======
function initGame() {
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
    cellSize = updateGameBoardSize(gameBoard);
    game = new Game(GRID_SIZE, cellSize);
    updateScore(0);
    updateHighScore();
    updateLevel(1);
<<<<<<< HEAD
=======
    lastRender = 0;
    resetPauseButton();
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
    isPaused = false;
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
<<<<<<< HEAD
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
=======

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
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
    if (game.score > 0) {
        showNameInput(game.score);
    } else {
        resetGame();
    }
}

function resetGame() {
<<<<<<< HEAD
    clearInterval(gameInterval);
=======
    cancelAnimationFrame(animationId);
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    restartButton.style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
<<<<<<< HEAD
=======
    resetPauseButton();
}

function resetPauseButton() {
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
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
<<<<<<< HEAD
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    if (game && game.score > highScore) {
        highScore = game.score;
        localStorage.setItem('snakeHighScore', highScore);
    }
=======
    const highScore = localStorage.getItem('snakeHighScore') || 0;
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
    highScoreElement.textContent = `High Score: ${highScore}`;
}

function updateLevel(level) {
    levelElement.textContent = `Level: ${level}`;
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}

<<<<<<< HEAD
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

=======
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
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
    setupKeyboardControls((dx, dy) => {
        if (game && !isPaused) game.changeDirection(dx, dy);
    });
    if (isMobileDevice()) {
        setupTouchControls((dx, dy) => {
            if (game && !isPaused) game.changeDirection(dx, dy);
        });
    }
}

<<<<<<< HEAD
=======
// Initialize
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
document.addEventListener('DOMContentLoaded', () => {
    updateGameBoardSize(gameBoard);
    let leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
    updateLeaderboard(leaderboard);
    addEventListeners();
<<<<<<< HEAD

=======
    
    // Check for saved dark mode preference
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
    if (localStorage.getItem('darkMode') === 'true') {
        darkModeToggle.checked = true;
        toggleDarkMode();
    }
});
