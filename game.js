export default class Game {
    constructor(gridSize, cellSize) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.snake = [{x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2)}];
        this.food = {};
<<<<<<< HEAD
        this.dx = 1; // right
=======
        this.dx = 1;
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
        this.dy = 0;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 200;
        this.createFood();
    }

    createFood() {
<<<<<<< HEAD
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
=======
        this.food = {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
        };
        // Ensure food doesn't appear on snake
        while (this.snake.some(part => part.x === this.food.x && part.y === this.food.y)) {
            this.createFood();
        }
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
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

<<<<<<< HEAD
        if (this.food && head.x === this.food.x && head.y === this.food.y) {
=======
        if (head.x === this.food.x && head.y === this.food.y) {
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
            this.score += 10;
            this.createFood();
            this.increaseSpeed();
            this.checkLevelUp();
<<<<<<< HEAD
            if (!this.food) {
                // No more food can be placed, player wins!
                return "win";
            }
=======
>>>>>>> 8811076d44965a501eb3e33bead11c7e22cd5559
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
