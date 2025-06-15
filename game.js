export default class Game {
    constructor(gridSize, cellSize, difficulty = 'easy') {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.snake = [{x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2)}];
        this.food = {};
        this.dx = 1; // right
        this.dy = 0;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 150;
        this.walls = (difficulty === 'hard') ? this.generateWalls(15) : []; // Only generate walls on hard
        this.createFood();
    }

    generateWalls(count) {
        const walls = [];
        while (walls.length < count) {
            const x = Math.floor(Math.random() * this.gridSize);
            const y = Math.floor(Math.random() * this.gridSize);
            // Don't place on snake or food or duplicate
            if (
                !this.snake.some(part => part.x === x && part.y === y) &&
                !(this.food && this.food.x === x && this.food.y === y) &&
                !walls.some(w => w.x === x && w.y === y)
            ) {
                walls.push({x, y});
            }
        }
        return walls;
    }

    createFood() {
        const colors = ['#FF5722', '#FFEB3B', '#2196F3', '#E91E63', '#4CAF50', '#9C27B0', '#FFC107', '#00BCD4'];
        const emptyCells = [];
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                if (
                    !this.snake.some(part => part.x === x && part.y === y) &&
                    !this.walls.some(w => w.x === x && w.y === y)
                ) {
                    emptyCells.push({ x, y });
                }
            }
        }
        if (emptyCells.length === 0) {
            this.food = null;
            return;
        }
        const pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        let lastColor = this.food?.color;
        let colorChoices = colors.filter(c => c !== lastColor);
        let color = colorChoices.length > 0 ? colorChoices[Math.floor(Math.random() * colorChoices.length)] : colors[0];
        this.food = {
            x: pos.x,
            y: pos.y,
            color: color,
            effect: true
        };
    }

    moveSnake() {
        const head = { 
            x: this.snake[0].x + this.dx, 
            y: this.snake[0].y + this.dy 
        };

        // Wall collision (map border)
        if (
            head.x < 0 || head.x >= this.gridSize ||
            head.y < 0 || head.y >= this.gridSize
        ) {
            return false;
        }

        // Self collision
        if (this.isCollision(head)) {
            return false;
        }

        // Wall collision (random walls)
        if (this.walls.some(w => w.x === head.x && w.y === head.y)) {
            return false;
        }

        this.snake.unshift(head);

        if (this.food && head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.createFood();
            this.increaseSpeed();
            this.checkLevelUp();
            if (!this.food) {
                return false;
            }
        } else {
            this.snake.pop();
        }

        return true;
    }

    isCollision(position) {
        return this.snake.slice(1).some(part => part.x === position.x && part.y === position.y);
    }

    increaseSpeed() {
        if (this.gameSpeed > 50) {
            this.gameSpeed -= 5;
        }
    }

    checkLevelUp() {
        if (this.score % 50 === 0) {
            this.level++;
        }
    }

    changeDirection(dx, dy) {
        if (this.dx === -dx || this.dy === -dy) return;
        this.dx = dx;
        this.dy = dy;
    }
}
