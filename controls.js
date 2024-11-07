export function setupKeyboardControls(changeDirectionCallback) {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowLeft':
            case 'a':
                changeDirectionCallback(-1, 0);
                break;
            case 'ArrowUp':
            case 'w':
                changeDirectionCallback(0, -1);
                break;
            case 'ArrowRight':
            case 'd':
                changeDirectionCallback(1, 0);
                break;
            case 'ArrowDown':
            case 's':
                changeDirectionCallback(0, 1);
                break;
        }
    });
}

export function setupTouchControls(changeDirectionCallback) {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, false);

    document.addEventListener('touchmove', (event) => {
        if (!touchStartX || !touchStartY) return;

        let touchEndX = event.touches[0].clientX;
        let touchEndY = event.touches[0].clientY;

        let dx = touchStartX - touchEndX;
        let dy = touchStartY - touchEndY;

        if (Math.abs(dx) > Math.abs(dy)) {
            changeDirectionCallback(dx > 0 ? -1 : 1, 0);
        } else {
            changeDirectionCallback(0, dy > 0 ? -1 : 1);
        }

        touchStartX = 0;
        touchStartY = 0;
        event.preventDefault();
    }, false);
}
