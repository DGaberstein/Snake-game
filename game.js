export default class Game {
    constructor(gridSize, cellSize) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.snake = [{x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2)}];
        this.food = {};
        this.dx = 1; // right
        this.dy = 0;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 200;
        this.createFood();
    }

    createFood() {
        const colors = ['#FF5722', '#FFEB3B', '#2196F3', '#E91E63', '#4CAF50', '#9C27B0', '#FFC107', '#00BCD4'];
        const emptyCells = [];
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                if (!this.snake.some(part => part.x === x && part.y === y)) {
                    emptyCells.push({ x, y });
                }
            }
        }
        if (emptyCells.length === 0) {
            this.food = null;
            console.log('No empty cells left. Game won!');
            return;
        }
        const pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.food = {
            x: pos.x,
            y: pos.y,
            color: colors[Math.floor(Math.random() * colors.length)],
            effect: true
        };
        console.log('New food at', this.food.x, this.food.y, 'snake length:', this.snake.length);
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

        if (this.food && head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.createFood();
            this.increaseSpeed();
            this.checkLevelUp();
            if (!this.food) {
                // No more food can be placed, player wins!
                return "win";
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
        if (this.dx === -dx || this.dy === -dy) return; // Prevent 180-degree turns
        this.dx = dx;
        this.dy = dy;
    }
}
