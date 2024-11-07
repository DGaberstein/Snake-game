export function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

export function updateGameBoardSize(gameBoard) {
    const boardSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    gameBoard.style.width = `${boardSize}px`;
    gameBoard.style.height = `${boardSize}px`;
    return boardSize / 20; // Assuming GRID_SIZE is 20
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
