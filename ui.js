export function updateGameBoard(game, gameBoard, cellSize) {
    // Clear previous state
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChildild);
    }

    // Draw snake
    game.snake.forEach((part, index) => {
        const snakePart = document.createElement('div');
        snakePart.style.left = `${part.x * cellSize}px`;
        snakePart.style.top = `${part.y * cellSize}px`;
        snakePart.style.width = `${cellSize}px`;
        snakePart.style.height = `${cellSize}px`;
        snakePart.classList.add('snake-part');
        if (index === 0) snakePart.classList.add('snake-head');
        gameBoard.appendChild(snakePart);
    });

    // Draw food
    const foodElement = document.createElement('div');
    foodElement.style.left = `${game.food.x * cellSize}px`;
    foodElement.style.top = `${game.food.y * cellSize}px`;
    foodElement.style.width = `${cellSize}px`;
    foodElement.style.height = `${cellSize}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

export function updupdateScore(score) {
    document.getElementById('score').textContent = 'Score: ' + score;
}

export function showNameInput(score) {
    document.getElementById('final-score').textContent = score;
    documeument.getElementById('name-input').style.display = 'block';
}

export function updateLeaderboard(leaderboard) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}
