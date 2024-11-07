export default class Game {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.snake = [{x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2)}];
        this.food = {};
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.gameSpeed = 250;
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
        } else {
            this.snake.pop();
        }

        return true;
    }

    isCollision(position) {
        return this.snake.slice(1).some(part => part.x === position.x && part.y === position.y);
    }

    increaseSpeed() {
        if (this.gameSpeed > 120) {
            this.gameSpeed -= 0.5;
        }
    }

    changeDirection(dx, dy) {
        if (this.dx === -dx || this.dy === -dy) return; // Prevent 180-degree turns
        this.dx = dx;
        this.dy = dy;
    }
}
