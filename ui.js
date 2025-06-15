export function updateGameBoard(game, gameBoard) {
    gameBoard.innerHTML = '';
    const cellSize = game.cellSize;

    // Draw walls
    if (game.walls) {
        game.walls.forEach(wall => {
            const wallElement = document.createElement('div');
            wallElement.style.left = `${wall.x * cellSize}px`;
            wallElement.style.top = `${wall.y * cellSize}px`;
            wallElement.style.width = `${cellSize}px`;
            wallElement.style.height = `${cellSize}px`;
            wallElement.classList.add('wall');
            gameBoard.appendChild(wallElement);
        });
    }

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

    if (game.food) {
        const foodElement = document.createElement('div');
        foodElement.style.left = `${game.food.x * cellSize}px`;
        foodElement.style.top = `${game.food.y * cellSize}px`;
        foodElement.style.width = `${cellSize}px`;
        foodElement.style.height = `${cellSize}px`;
        foodElement.classList.add('food');
        if (game.food.color) {
            foodElement.style.backgroundColor = game.food.color;
            foodElement.style.boxShadow = `0 0 5px ${game.food.color}`;
        }
        gameBoard.appendChild(foodElement);
    }
}

export function updateScore(score) {
    document.getElementById('score').textContent = `Score: ${score}`;
}

export function showNameInput(score) {
    document.getElementById('final-score').textContent = score;
    document.getElementById('name-input').style.display = 'block';
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
