export function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

export function updateGameBoardSize(gameBoard) {
    const boardSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    const gridSize = 20;
    const cellSize = Math.floor(boardSize / gridSize);
    const actualBoardSize = cellSize * gridSize;
    // Set the board size to exactly the grid (border is inside with border-box)
    gameBoard.style.width = `${actualBoardSize}px`;
    gameBoard.style.height = `${actualBoardSize}px`;
    gameBoard.style.boxSizing = 'border-box'; // <-- important!
    return cellSize;
}

export function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Save dark mode preference to local storage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

export function toggleFullscreen(isFullscreen, fullscreenToggle) {
    isFullscreen = !isFullscreen;
    document.body.classList.toggle('fullscreen-mode', isFullscreen);
    
    fullscreenToggle.innerHTML = isFullscreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
    
    if (isFullscreen) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    
    return isFullscreen;
}
