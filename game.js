export default class Game {
    constructor(gridSize, cellSize) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.snake = [{x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2)}];
        this.food = {};
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 200;
        this.createFood();
    }

    createFood() {
        this.food = {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
        };
        // Ensure food doesn't appear on snake
        while (this.snake.some(part => part.x === this.food.x && part.y === this.food.y)) {
            this.createFood();
        }
    }

    moveSnake() {
        const head = { 
            x: this.snake[0].x + this.dx, 
            y: this.snake[0].y + this.dy 
        };
        
        // Check for wall collision
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            return false;
        }
        
        if (this.isCollision(head)) {
            return false;
        }
        
        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.createFood();
            this.increaseSpeed();
            this.checkLevelUp();
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
        if (this.dx === -dx || this.dy === -dy) return; // Prevent 180-degree turns
        this.dx = dx;
        this.dy = dy;
    }
}
