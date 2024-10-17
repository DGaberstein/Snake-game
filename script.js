const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
let snake = [{x: 200, y: 200}];
let food = {};
let dx = 20;
let dy = 0;
let score = 0;
let gameSpeed = 200;
let gameLoop;

function startGame() {
    createFood();
    document.addEventListener('keydown', changeDirection);
    gameLoop = setInterval(moveSnake, gameSpeed);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
    const foodElement = document.createElement('div');
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = 'Score: ' + score;
        document.querySelector('.food').remove();
        createFood();
        increaseSpeed();
        // Don't remove the tail to make the snake longer
    } else {
        snake.pop();
    }

    if (isGameOver()) {
        clearInterval(gameLoop);
        alert('Game Over! Your score: ' + score);
        resetGame();
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

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function isGameOver() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= 400 ||
        head.y < 0 || head.y >= 400 ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    );
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 5;
        clearInterval(gameLoop);
        gameLoop = setInterval(moveSnake, gameSpeed);
    }
}

function resetGame() {
    snake = [{x: 200, y: 200}];
    dx = 20;
    dy = 0;
    score = 0;
    gameSpeed = 200;
    scoreElement.textContent = 'Score: 0';
    createFood();
    gameLoop = setInterval(moveSnake, gameSpeed);
}

startGame();
