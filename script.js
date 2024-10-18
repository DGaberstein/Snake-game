const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');
const nameInput = document.getElementById('name-input');
const playerNameInput = document.getElementById('player-name');
const submitScoreButton = document.getElementById('submit-score');
const finalScoreSpan = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let snake = [{x: 200, y: 200}];
let food = {};
let dx = 20;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameLoop;
let leaderboard = [];

function startGame() {
    createFood();
    addKeyboardListener();
    restartGame();
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
    snake.forEach(part => {
        const snakePart = document.createElement('div');
        snakePart.style.left = part.x + 'px';
        snakePart.style.top = part.y + 'px';
        snakePart.classList.add('snake-part');
        gameBoard.appendChild(snakePart);
    });
    const foodElement = document.createElement('div');
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

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
    if (gameSpeed > 50) {
        gameSpeed -= 2;
        clearInterval(gameLoop);
        gameLoop = setInterval(moveSnake, gameSpeed);
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

function resetGame() {
    restartGame();
}

function restartGame() {
    clearInterval(gameLoop);
    removeKeyboardListener();
    snake = [{x: 200, y: 200}];
    dx = 20;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    scoreElement.textContent = 'Score: 0';
    createFood();
    addKeyboardListener();
    gameLoop = setInterval(moveSnake, gameSpeed);
}

function addKeyboardListener() {
    document.addEventListener('keydown', changeDirection);
}

function removeKeyboardListener() {
    document.removeEventListener('keydown', changeDirection);
}

submitScoreButton.addEventListener('click', submitScore);
restartButton.addEventListener('click', restartGame);
startGame();

const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
