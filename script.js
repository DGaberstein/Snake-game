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
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const mobileControls = document.getElementById('mobile-controls');

let snake = [{x: 200, y: 200}];
let food = {};
let dx = 20;
let dy = 0;
let score = 0;
let gameSpeed = 250;
let gameLoop;
let leaderboard = [];
let touchStartX = 0;
let touchStartY = 0;
let initialGameSpeed = 250;
let mobileGameSpeed = 250;
let speedIncreaseRate = 0.0025; 
let mobileSpeedIncreaseRate = 0.0025;
let currentGameSpeed;

upButton.addEventListener('touchstart', () => changeDirection({keyCode: 38}));
downButton.addEventListener('touchstart', () => changeDirection({keyCode: 40}));
leftButton.addEventListener('touchstart', () => changeDirection({keyCode: 37}));
rightButton.addEventListener('touchstart', () => changeDirection({keyCode: 39}));

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let deltaX = touchStartX - touchEndX;
    let deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            changeDirection({keyCode: 37}); // Left
        } else {
            changeDirection({keyCode: 39}); // Right
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            changeDirection({keyCode: 38}); // Up
        } else {
            changeDirection({keyCode: 40}); // Down
        }
    }

    // Reset touch start coordinates
    touchStartX = 0;
    touchStartY = 0;

    event.preventDefault();
}

document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, false);

document.addEventListener('touchmove', function(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let dx = touchStartX - touchEndX;
    let dy = touchStartY - touchEndY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            changeDirection({keyCode: 37}); // Left
        } else {
            changeDirection({keyCode: 39}); // Right
        }
    } else {
        if (dy > 0) {
            changeDirection({keyCode: 38}); // Up
        } else {
            changeDirection({keyCode: 40}); // Down
        }
    }

    touchStartX = 0;
    touchStartY = 0;

    event.preventDefault();
}, false);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = 'Score: ' + score;
        createFood();
        increaseSpeed();
    } else {
        snake.pop();
    }

    if (isGameOver()) {
        return;
    }

    updateGameBoard();
}

function updateGameBoard() {
    gameBoard.innerHTML = '';
    snake.forEach((part, index) => {
        const snakePart = document.createElement('div');
        snakePart.style.left = part.x + 'px';
        snakePart.style.top = part.y + 'px';
        snakePart.classList.add('snake-part');
        if (index === 0) {
            snakePart.classList.add('snake-head');
        }
        gameBoard.appendChild(snakePart);

        // Add trail effect
        const trail = document.createElement('div');
        trail.style.left = part.x + 'px';
        trail.style.top = part.y + 'px';
        trail.style.width = trail.style.height = `${20 - index * 2}px`;
        trail.classList.add('snake-trail');
        gameBoard.appendChild(trail);
    });
    const foodElement = document.createElement('div');
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function isGameOver() {
    const head = snake[0];
    if (
        head.x < 0 || head.x >= 400 ||
        head.y < 0 || head.y >= 400 ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        clearInterval(gameLoop);
        removeKeyboardListener();
        if (score > 0) {
            showNameInput();
        } else {
            resetGame();
        }
        return true;
    }
    return false;
}

function increaseSpeed() {
    if (isMobileDevice()) {
        if (gameSpeed > 150) {
            gameSpeed -= mobileSpeedIncreaseRate;
            clearInterval(gameLoop);
            gameLoop = setInterval(moveSnake, gameSpeed);
        }
    } else {
        if (gameSpeed > 120) {
            gameSpeed -= speedIncreaseRate;
            clearInterval(gameLoop);
            gameLoop = setInterval(moveSnake, gameSpeed);
        }
    }
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
    snake = [{x: 200, y: 200}];
    dx = 20;
    dy = 0;
    score = 0;
    
    currentGameSpeed = isMobileDevice() ? mobileGameSpeed : initialGameSpeed;
    
    scoreElement.textContent = 'Score: 0';
    createFood();
    addKeyboardListener();
    gameLoop = setInterval(moveSnake, currentGameSpeed);
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
    removeKeyboardListener();
    snake = [{x: 200, y: 200}];
    dx = 20;
    dy = 0;
    score = 0;
    currentGameSpeed = isMobileDevice() ? mobileGameSpeed : initialGameSpeed;
    scoreElement.textContent = 'Score: 0';
    createFood();
    updateGameBoard();
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
    mobileControls.style.display = 'none';
    // Reset game board size
    gameBoard.style.width = '';
    gameBoard.style.height = '';
}

function restartGame() {
    resetGame();
    initGame();
}

function addKeyboardListener() {
    document.addEventListener('keydown', changeDirection);
}

function removeKeyboardListener() {
    document.removeEventListener('keydown', changeDirection);
}

startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', restartGame);
submitScoreButton.addEventListener('click', submitScore);

checkbox.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

createFood();
updateGameBoard();
