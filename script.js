// Add this at the beginning of your script file
document.addEventListener('DOMContentLoaded', () => {
    const toggleRulesBtn = document.getElementById('toggleRulesBtn');
    const rulesBox = document.getElementById('rulesBox');

    toggleRulesBtn.addEventListener('click', () => {
        rulesBox.classList.toggle('collapsed');
        toggleRulesBtn.textContent = rulesBox.classList.contains('collapsed') ? 'Show Rules' : 'Hide Rules';
    });

    // ... rest of your existing code
});

document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        boardSize: 7,
        currentPlayer: 'blue', // 'blue' or 'red'
        selectedDot: null,
        dots: [],
        lines: [],
        gameOver: false,
        playingAgainstAI: true,
        aiThinking: false,
        isFirstMove: true, // Track if it's the first move of the game
        firstMovePosition: null // Store the position of the first move for dynamic strategy
    };

    // DOM elements
    const gameBoard = document.getElementById('gameBoard');
    const currentPlayerDisplay = document.getElementById('currentPlayer');
    const gameMessage = document.getElementById('gameMessage');
    const newGameBtn = document.getElementById('newGameBtn');
    const aiToggleBtn = document.getElementById('aiToggleBtn');
    const boardSizeSelect = document.getElementById('boardSizeSelect');
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeModalBtn = document.querySelector('.close');

    // Initialize the game
    initGame();

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    aiToggleBtn.addEventListener('click', toggleAI);
    boardSizeSelect.addEventListener('change', changeBoardSize);
    helpBtn.addEventListener('click', () => helpModal.style.display = 'block');
    closeModalBtn.addEventListener('click', () => helpModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });

    function initGame() {
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Reset game state
        gameState.currentPlayer = 'blue';
        gameState.selectedDot = null;
        gameState.dots = [];
        gameState.lines = [];
        gameState.gameOver = false;
        gameState.isFirstMove = true;
        gameState.firstMovePosition = null; // Reset first move position
        
        // Update UI
        updatePlayerDisplay();
        gameMessage.textContent = '';
        
        // Create the dots
        createDots();
        
        // If AI is enabled and it's red's turn, make AI move
        if (gameState.playingAgainstAI && gameState.currentPlayer === 'red') {
            makeAIMove();
        }
    }

    function createDots() {
        // Set fixed board dimensions
        gameBoard.style.width = '626px';
        gameBoard.style.height = '617px';
        
        // Define dot positions from pattern maker
        const dotPositions = [
            // Red border dots (top and bottom)
            {x: 45, y: 45, color: 'red'},
            {x: 100, y: 45, color: 'red'},
            {x: 210, y: 45, color: 'red'},
            {x: 320, y: 45, color: 'red'},
            {x: 425, y: 45, color: 'red'},
            {x: 535, y: 45, color: 'red'},
            {x: 590, y: 45, color: 'red'},
            {x: 590, y: 590, color: 'red'},
            {x: 535, y: 590, color: 'red'},
            {x: 425, y: 590, color: 'red'},
            {x: 320, y: 590, color: 'red'},
            {x: 210, y: 590, color: 'red'},
            {x: 100, y: 590, color: 'red'},
            {x: 45, y: 590, color: 'red'},
            // Blue border dots (left and right)
            {x: 590, y: 100, color: 'blue'},
            {x: 590, y: 200, color: 'blue'},
            {x: 590, y: 315, color: 'blue'},
            {x: 590, y: 425, color: 'blue'},
            {x: 590, y: 530, color: 'blue'},
            {x: 45, y: 530, color: 'blue'},
            {x: 45, y: 425, color: 'blue'},
            {x: 45, y: 315, color: 'blue'},
            {x: 45, y: 200, color: 'blue'},
            {x: 45, y: 100, color: 'blue'},
            // Blue inner dots
            {x: 154, y: 95, color: 'blue'},
            {x: 259, y: 95, color: 'blue'},
            {x: 373, y: 95, color: 'blue'},
            {x: 478, y: 97, color: 'blue'},
            {x: 478, y: 206, color: 'blue'},
            {x: 369, y: 205, color: 'blue'},
            {x: 260, y: 203, color: 'blue'},
            {x: 153, y: 205, color: 'blue'},
            {x: 153, y: 316, color: 'blue'},
            {x: 259, y: 311, color: 'blue'},
            {x: 370, y: 312, color: 'blue'},
            {x: 475, y: 312, color: 'blue'},
            {x: 153, y: 423, color: 'blue'},
            {x: 261, y: 426, color: 'blue'},
            {x: 370, y: 423, color: 'blue'},
            {x: 480, y: 424, color: 'blue'},
            {x: 480, y: 531, color: 'blue'},
            {x: 370, y: 530, color: 'blue'},
            {x: 261, y: 533, color: 'blue'},
            {x: 153, y: 529, color: 'blue'},
            // Red inner dots
            {x: 99, y: 151, color: 'red'},
            {x: 205, y: 149, color: 'red'},
            {x: 316, y: 151, color: 'red'},
            {x: 424, y: 151, color: 'red'},
            {x: 531, y: 150, color: 'red'},
            {x: 101, y: 261, color: 'red'},
            {x: 205, y: 260, color: 'red'},
            {x: 320, y: 259, color: 'red'},
            {x: 424, y: 260, color: 'red'},
            {x: 533, y: 259, color: 'red'},
            {x: 532, y: 367, color: 'red'},
            {x: 424, y: 366, color: 'red'},
            {x: 314, y: 370, color: 'red'},
            {x: 206, y: 367, color: 'red'},
            {x: 98, y: 368, color: 'red'},
            {x: 100, y: 477, color: 'red'},
            {x: 206, y: 476, color: 'red'},
            {x: 315, y: 476, color: 'red'},
            {x: 426, y: 475, color: 'red'},
            {x: 534, y: 477, color: 'red'}
        ];
        
        // Create dots based on pattern
        dotPositions.forEach((position, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${position.color}`;
            dot.style.left = `${position.x}px`;
            dot.style.top = `${position.y}px`;
            
            // Store dot data
            const dotData = {
                element: dot,
                x: position.x,
                y: position.y,
                color: position.color,
                connections: []
            };
            
            gameState.dots.push(dotData);
            
            // Add click event
            dot.addEventListener('click', () => handleDotClick(dotData));
            
            // Add to the board
            gameBoard.appendChild(dot);
        });
        
        // Draw initial boundary lines
        // Top red lines
        for (let i = 0; i < 6; i++) {
            const dot1 = gameState.dots[i];
            const dot2 = gameState.dots[i + 1];
            connectDots(dot1, dot2);
        }
        
        // Bottom red lines
        for (let i = 7; i < 13; i++) {
            const dot1 = gameState.dots[i];
            const dot2 = gameState.dots[i + 1];
            connectDots(dot1, dot2);
        }
        
        // Left and right blue lines
        for (let i = 14; i < 18; i++) {
            const dot1 = gameState.dots[i];
            const dot2 = gameState.dots[i + 1];
            connectDots(dot1, dot2);
        }
        for (let i = 19; i < 23; i++) {
            const dot1 = gameState.dots[i];
            const dot2 = gameState.dots[i + 1];
            connectDots(dot1, dot2);
        }
    }

    function handleDotClick(dot) {
        // Ignore clicks if game is over or AI is thinking
        if (gameState.gameOver || gameState.aiThinking) return;
        
        // Ignore clicks on dots that don't match current player's color
        if (dot.color !== gameState.currentPlayer) return;
        
        if (!gameState.selectedDot) {
            // First dot selection
            gameState.selectedDot = dot;
            dot.element.style.transform = 'translate(-50%, -50%) scale(1.3)';
            dot.element.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        } else if (gameState.selectedDot === dot) {
            // Deselect the dot
            gameState.selectedDot.element.style.transform = 'translate(-50%, -50%)';
            gameState.selectedDot.element.style.boxShadow = '';
            gameState.selectedDot = null;
        } else {
            // Try to connect dots
            if (canConnect(gameState.selectedDot, dot)) {
                connectDots(gameState.selectedDot, dot);
                
                // Reset selection
                gameState.selectedDot.element.style.transform = 'translate(-50%, -50%)';
                gameState.selectedDot.element.style.boxShadow = '';
                gameState.selectedDot = null;
                
                // Check for win
                if (checkWin()) {
                    gameState.gameOver = true;
                    gameMessage.textContent = `${gameState.currentPlayer.toUpperCase()} wins!`;
                    return;
                }
                
                // Switch player
                gameState.currentPlayer = gameState.currentPlayer === 'blue' ? 'red' : 'blue';
                updatePlayerDisplay();
                
                // AI move if enabled
                if (gameState.playingAgainstAI && gameState.currentPlayer === 'red') {
                    makeAIMove();
                }
            } else {
                // Invalid connection
                gameMessage.textContent = 'Invalid move! Dots must be adjacent and not already connected.';
                setTimeout(() => {
                    gameMessage.textContent = '';
                }, 2000);
            }
        }
    }

    function canConnect(dot1, dot2) {
        // Check if dots are of the same color
        if (dot1.color !== dot2.color) return false;
        
        // Calculate distance between dots
        const dx = Math.abs(dot1.x - dot2.x);
        const dy = Math.abs(dot1.y - dot2.y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if dots are too far apart (more than 120px)
        if (distance > 120) {
            return false;
        }
        
        // Check if connection already exists
        if (dot1.connections.includes(dot2) || dot2.connections.includes(dot1)) {
            return false;
        }
        
        // Check if the new line would cross any existing line
        return !wouldLineCross(dot1, dot2);
    }

    function wouldLineCross(dot1, dot2) {
        // Check if the new line would cross any existing line
        for (const line of gameState.lines) {
            if (doLineSegmentsIntersect(
                dot1.x, dot1.y, dot2.x, dot2.y,
                line.start.x, line.start.y, line.end.x, line.end.y
            )) {
                return true;
            }
        }
        return false;
    }

    function connectDots(dot1, dot2) {
        // Add connection to both dots
        dot1.connections.push(dot2);
        dot2.connections.push(dot1);
        
        // Create visual line
        const line = document.createElement('div');
        line.className = `line ${dot1.color}`;
        
        // Calculate line position and dimensions
        const dx = dot2.x - dot1.x;
        const dy = dot2.y - dot1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        line.style.width = `${length}px`;
        line.style.left = `${(dot1.x / gameBoard.clientWidth) * 100}%`;
        line.style.top = `${(dot1.y / gameBoard.clientWidth) * 100}%`;
        line.style.transform = `translate(-0%, -50%) rotate(${angle}deg)`;
        
        // Store line data
        const lineData = {
            element: line,
            start: dot1,
            end: dot2,
            color: dot1.color
        };
        
        gameState.lines.push(lineData);
        
        // Add to the board
        gameBoard.appendChild(line);
    }

    function checkWin() {
        if (gameState.currentPlayer === 'blue') {
            // Blue wins by connecting left to right
            // Find all blue dots on the leftmost side (x = 45)
            const leftDots = gameState.dots.filter(dot => dot.color === 'blue' && dot.x === 45);
            
            // Check if any of them can reach the rightmost side (x = 590)
            for (const dot of leftDots) {
                if (canReachRightSide(dot, new Set())) {
                    return true;
                }
            }
        } else {
            // Red wins by connecting top to bottom
            // Find all red dots on the top side (y = 45)
            const topDots = gameState.dots.filter(dot => dot.color === 'red' && dot.y === 45);
            
            // Check if any of them can reach the bottom side (y = 590)
            for (const dot of topDots) {
                if (canReachBottomSide(dot, new Set())) {
                    return true;
                }
            }
        }
        
        return false;
    }

    function canReachRightSide(dot, visited) {
        // Mark current dot as visited
        visited.add(dot);
        
        // Check if dot is on the right edge (x = 590)
        if (dot.x === 590) {
            return true;
        }
        
        // Check all connected dots
        for (const connectedDot of dot.connections) {
            if (!visited.has(connectedDot)) {
                if (canReachRightSide(connectedDot, visited)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    function canReachBottomSide(dot, visited) {
        // Mark current dot as visited
        visited.add(dot);
        
        // Check if dot is on the bottom edge (y = 590)
        if (dot.y === 590) {
            return true;
        }
        
        // Check all connected dots
        for (const connectedDot of dot.connections) {
            if (!visited.has(connectedDot)) {
                if (canReachBottomSide(connectedDot, visited)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    function updatePlayerDisplay() {
        const playerSpan = document.createElement('span');
        playerSpan.className = `${gameState.currentPlayer}-player`;
        playerSpan.textContent = gameState.currentPlayer.charAt(0).toUpperCase() + gameState.currentPlayer.slice(1);
        
        currentPlayerDisplay.innerHTML = 'Current Player: ';
        currentPlayerDisplay.appendChild(playerSpan);
    }

    function toggleAI() {
        gameState.playingAgainstAI = !gameState.playingAgainstAI;
        aiToggleBtn.textContent = gameState.playingAgainstAI ? 'Play vs Human' : 'Play vs AI';
        
        // If toggling AI on and it's red's turn, make AI move
        if (gameState.playingAgainstAI && gameState.currentPlayer === 'red' && !gameState.gameOver) {
            makeAIMove();
        }
    }

    function changeBoardSize() {
        gameState.boardSize = parseInt(boardSizeSelect.value);
        initGame();
    }

    function makeAIMove() {
        // Prevent multiple AI moves
        if (gameState.aiThinking) return;
        
        gameState.aiThinking = true;
        gameMessage.textContent = 'AI is thinking...';
        
        // Add a small delay to make it seem like the AI is "thinking"
        setTimeout(() => {
            const move = findBestMove();
            
            if (move) {
                connectDots(move.from, move.to);
                
                // Check for win
                if (checkWin()) {
                    gameState.gameOver = true;
                    gameMessage.textContent = 'Red (AI) wins!';
                    gameState.aiThinking = false;
                    return;
                }
                
                // Switch back to player
                gameState.currentPlayer = 'blue';
                updatePlayerDisplay();
                gameMessage.textContent = '';
            } else {
                gameMessage.textContent = 'AI could not find a valid move!';
                setTimeout(() => {
                    gameMessage.textContent = '';
                }, 2000);
            }
            
            gameState.aiThinking = false;
        }, 500);
    }

    // Cache for evaluated positions
    const evaluationCache = new Map();

    function findBestMove() {
        const redDots = gameState.dots.filter(dot => dot.color === 'red');
        
        // For the first move, make a random valid move
        if (gameState.isFirstMove) {
            const validMoves = [];
            
            // Find all valid moves
            for (const dot1 of redDots) {
                for (const dot2 of redDots) {
                    if (dot1 !== dot2 && canConnect(dot1, dot2)) {
                        validMoves.push({from: dot1, to: dot2});
                    }
                }
            }
            
            // Select a random valid move
            if (validMoves.length > 0) {
                gameState.isFirstMove = false;
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                // Store the first move's position for future reference
                gameState.firstMovePosition = {
                    from: { x: randomMove.from.x, y: randomMove.from.y },
                    to: { x: randomMove.to.x, y: randomMove.to.y }
                };
                return randomMove;
            }
        }
        
        let bestMove = null;
        let bestScore = -Infinity;
        
        // Use existing redDots array that was already sorted
        // Check for immediate winning moves
        for (const dot1 of redDots) {
            if (dot1.y === 45) { // Top row dot
                for (const dot2 of redDots) {
                    if (dot2.y === 590 && canConnect(dot1, dot2)) { // Can connect to bottom
                        return {from: dot1, to: dot2};
                    }
                }
            }
        }
        
        // Check for opponent's winning moves to block
        const blueDots = gameState.dots.filter(dot => dot.color === 'blue')
            .sort((a, b) => b.x - a.x);
        
        for (const dot1 of blueDots) {
            if (dot1.x === 45) { // Left side dot
                for (const dot2 of blueDots) {
                    if (dot2.x === 590) { // Right side dot
                        // Find red dots that could block this potential connection
                        for (const redDot1 of redDots) {
                            for (const redDot2 of redDots) {
                                if (redDot1 === redDot2) continue;
                                if (canConnect(redDot1, redDot2) && 
                                    wouldBlockConnection(redDot1, redDot2, dot1, dot2)) {
                                    return {from: redDot1, to: redDot2};
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Strategic move evaluation
        const maxMoves = 20; // Increased move evaluation limit
        let movesChecked = 0;
        
        for (const dot1 of redDots) {
            for (const dot2 of redDots) {
                if (dot1 === dot2 || dot1.connections.includes(dot2)) continue;
                
                if (canConnect(dot1, dot2)) {
                    // Enhanced position evaluation
                    const score = evaluateMove(dot1, dot2);
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {from: dot1, to: dot2};
                    }
                    
                    movesChecked++;
                    if (movesChecked >= maxMoves) break;
                }
            }
            if (movesChecked >= maxMoves) break;
        }
        
        return bestMove;
    }

    function prelimEvaluate(dot1, dot2) {
        // Quick preliminary evaluation for move ordering
        let score = 0;
        const newDotY = Math.min(dot1.y, dot2.y);
        score += (590 - newDotY) * 2; // Prioritize moves closer to bottom
        score += (dot1.connections.length + dot2.connections.length) * 30; // Favor branching
        return score;
    }

    function alphaBeta(depth, alpha, beta, isMaximizing) {
        if (depth === 0) return evaluatePosition();

        const key = getPositionKey();
        if (evaluationCache.has(key)) return evaluationCache.get(key);

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const move of getValidMoves('red')) {
                const [dot1, dot2] = move;
                dot1.connections.push(dot2);
                dot2.connections.push(dot1);
                maxScore = Math.max(maxScore, alphaBeta(depth - 1, alpha, beta, false));
                dot1.connections.pop();
                dot2.connections.pop();
                alpha = Math.max(alpha, maxScore);
                if (beta <= alpha) break;
            }
            evaluationCache.set(key, maxScore);
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const move of getValidMoves('blue')) {
                const [dot1, dot2] = move;
                dot1.connections.push(dot2);
                dot2.connections.push(dot1);
                minScore = Math.min(minScore, alphaBeta(depth - 1, alpha, beta, true));
                dot1.connections.pop();
                dot2.connections.pop();
                beta = Math.min(beta, minScore);
                if (beta <= alpha) break;
            }
            evaluationCache.set(key, minScore);
            return minScore;
        }
    }

    function getValidMoves(color) {
        const moves = [];
        const dots = gameState.dots.filter(dot => dot.color === color);
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dot1 = dots[i];
                const dot2 = dots[j];
                if (!dot1.connections.includes(dot2)) {
                    const distance = Math.sqrt(
                        Math.pow(dot1.x - dot2.x, 2) + 
                        Math.pow(dot1.y - dot2.y, 2)
                    );
                    if (distance <= 120) moves.push([dot1, dot2]);
                }
            }
        }
        return moves;
    }

    function getPositionKey() {
        // Create a unique key for the current board position
        return gameState.dots.map(dot => 
            `${dot.x},${dot.y}:${dot.connections.map(c => `${c.x},${c.y}`).join(';')}`
        ).join('|');
    }

    function evaluatePosition() {
        let score = 0;
        
        // Check for win conditions
        const redWin = gameState.dots.some(dot => 
            dot.color === 'red' && dot.y === 45 && canReachBottomSide(dot, new Set())
        );
        const blueWin = gameState.dots.some(dot => 
            dot.color === 'blue' && dot.x === 45 && canReachRightSide(dot, new Set())
        );
        
        if (redWin) return 1000;
        if (blueWin) return -1000;
        
        // Evaluate position based on progress towards goals
        const redProgress = evaluateProgress('red');
        const blueProgress = evaluateProgress('blue');
        
        score = redProgress - blueProgress;
        return score;
    }

    function evaluateMove(dot1, dot2) {
        let score = 0;
        
        // Early game strategy - prioritize key positions and blocking
        const moveNumber = gameState.lines.length;
        const isEarlyGame = moveNumber < 6;
        
        if (isEarlyGame && gameState.firstMovePosition) {
            // Consider the first move's position for subsequent moves
            const distanceFromFirstMove = Math.min(
                Math.sqrt(
                    Math.pow(dot1.x - gameState.firstMovePosition.from.x, 2) +
                    Math.pow(dot1.y - gameState.firstMovePosition.from.y, 2)
                ),
                Math.sqrt(
                    Math.pow(dot2.x - gameState.firstMovePosition.to.x, 2) +
                    Math.pow(dot2.y - gameState.firstMovePosition.to.y, 2)
                )
            );
            
            // Favor moves that build upon the random first move
            score += Math.max(0, (150 - distanceFromFirstMove)) * 2;
            
            // Early blocking strategy with consideration of first move
            const earlyBlockingValue = evaluateEarlyBlocking(dot1, dot2);
            score += earlyBlockingValue * 2; // Double importance in early game
        }
        
        // Prioritize vertical progress with enhanced weighting
        const avgY = (dot1.y + dot2.y) / 2;
        const progressWeight = Math.pow((590 - avgY) / 590, 1.5) * 300; // Stronger emphasis on forward progress
        score += progressWeight;
        
        // Check for immediate winning moves or critical blocks
        if (wouldCreatePath(dot1, dot2, 'red')) {
            score += 1000; // Highest priority for winning moves
        }
        
        // Enhanced blocking strategy with path analysis
        const blockingValue = evaluateBlocking(dot1, dot2);
        score += blockingValue * (isEarlyGame ? 1.5 : 1); // More blocking emphasis in early game
        
        // Improved position control with dynamic territory analysis
        score += evaluatePositionControl(dot1, dot2) * (isEarlyGame ? 1.2 : 1);
        
        // Strategic connectivity with context awareness
        const connectivityBonus = Math.sqrt(dot1.connections.length + dot2.connections.length) * 25;
        score += connectivityBonus;
        
        // Deeper evaluation for critical moves
        const futureScore = alphaBeta(isEarlyGame ? 4 : 3, -Infinity, Infinity, false);
        score += futureScore * (isEarlyGame ? 0.7 : 0.5); // Higher weight in early game
        
        return score;
    }
    
    function evaluateOpeningPosition(dot1, dot2) {
        let score = 0;
        
        // Prefer moves that create strong vertical connections early
        const verticalDistance = Math.abs(dot1.y - dot2.y);
        if (verticalDistance > 80) {
            score += 150; // Bonus for creating long vertical connections
        }
        
        // Bonus for moves near the center vertical line
        const centerX = 320;
        const distanceToCenter = Math.min(
            Math.abs(dot1.x - centerX),
            Math.abs(dot2.x - centerX)
        );
        score += Math.max(0, (100 - distanceToCenter)) * 1.5;
        
        return score;
    }
    
    function evaluateEarlyBlocking(dot1, dot2) {
        let score = 0;
        const blueDots = gameState.dots.filter(d => d.color === 'blue');
        
        // Check for potential early horizontal paths
        for (const blueDot1 of blueDots) {
            for (const blueDot2 of blueDots) {
                if (blueDot1 === blueDot2) continue;
                
                // Check if blue dots could form a strong horizontal connection
                if (Math.abs(blueDot1.y - blueDot2.y) < 60 && 
                    Math.abs(blueDot1.x - blueDot2.x) > 100) {
                    
                    // If our move intersects this potential path
                    if (wouldIntersectPath(dot1, dot2, blueDot1, blueDot2)) {
                        score += 200;
                    }
                }
            }
        }
        
        return score;
    }
    
    function wouldIntersectPath(red1, red2, blue1, blue2) {
        // Simple line intersection check
        const ccw = (A, B, C) => {
            return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
        };
        
        return ccw(red1, blue1, blue2) !== ccw(red2, blue1, blue2) &&
               ccw(red1, red2, blue1) !== ccw(red1, red2, blue2);
    }
    
    function wouldCreatePath(dot1, dot2, color) {
        // Temporarily connect dots
        dot1.connections.push(dot2);
        dot2.connections.push(dot1);
        
        let createsPath = false;
        if (color === 'red') {
            const topDots = gameState.dots.filter(d => d.color === 'red' && d.y === 45);
            createsPath = topDots.some(dot => canReachBottomSide(dot, new Set()));
        } else {
            const leftDots = gameState.dots.filter(d => d.color === 'blue' && d.x === 45);
            createsPath = leftDots.some(dot => canReachRightSide(dot, new Set()));
        }
        
        // Undo temporary connection
        dot1.connections.pop();
        dot2.connections.pop();
        
        return createsPath;
    }
    
    function evaluateBlocking(dot1, dot2) {
        let blockingScore = 0;
        const blueDots = gameState.dots.filter(d => d.color === 'blue' && d.x === 45);
        
        // Temporarily connect the dots
        dot1.connections.push(dot2);
        dot2.connections.push(dot1);
        
        for (const blueDot of blueDots) {
            const beforePaths = countPotentialPaths(blueDot, 590, new Set());
            const afterPaths = countPotentialPaths(blueDot, 590, new Set(), [dot1, dot2]);
            
            // Score based on how many paths are blocked
            if (beforePaths > afterPaths) {
                const pathReduction = beforePaths - afterPaths;
                blockingScore += pathReduction * 150;
                
                // Extra bonus for blocking critical paths
                if (afterPaths === 0 && beforePaths > 0) {
                    blockingScore += 250; // Bonus for completely blocking a path
                }
            }
        }
        
        // Undo temporary connection
        dot1.connections.pop();
        dot2.connections.pop();
        
        return blockingScore;
    }
    
    function countPotentialPaths(startDot, targetX, visited, blockedConnection = null) {
        if (visited.has(startDot)) return 0;
        if (startDot.x === targetX) return 1;
        
        visited.add(startDot);
        let pathCount = 0;
        
        for (const connectedDot of startDot.connections) {
            if (!visited.has(connectedDot)) {
                // Skip if this connection is blocked
                if (blockedConnection && 
                    ((blockedConnection[0] === startDot && blockedConnection[1] === connectedDot) ||
                     (blockedConnection[1] === startDot && blockedConnection[0] === connectedDot))) {
                    continue;
                }
                pathCount += countPotentialPaths(connectedDot, targetX, new Set(visited), blockedConnection);
            }
        }
        
        return pathCount;
    }
    
    function evaluatePositionControl(dot1, dot2) {
        let score = 0;
        
        // Dynamic territory control evaluation
        const centerX = 320;
        const centerY = 315;
        const distanceToCenter = Math.min(
            Math.sqrt(Math.pow(dot1.x - centerX, 2) + Math.pow(dot1.y - centerY, 2)),
            Math.sqrt(Math.pow(dot2.x - centerX, 2) + Math.pow(dot2.y - centerY, 2))
        );
        
        // Weighted center control based on game progress
        const gameProgress = gameState.lines.length / (gameState.dots.length * 2);
        const centerWeight = Math.max(0, (300 - distanceToCenter) / 3);
        score += centerWeight * (1 - gameProgress); // Center control matters more early game
        
        // Evaluate vertical territory control for red
        const avgY = (dot1.y + dot2.y) / 2;
        const verticalControl = Math.abs(avgY - centerY) / centerY;
        score += (1 - verticalControl) * 100; // Prefer controlling middle rows
        
        // Strategic point bonus
        const isStrategicPoint = (dot) => {
            const nearbyDots = gameState.dots.filter(d => 
                d.color === 'red' && 
                Math.sqrt(Math.pow(d.x - dot.x, 2) + Math.pow(d.y - dot.y, 2)) <= 120
            );
            return nearbyDots.length >= 3;
        };
        
        if (isStrategicPoint(dot1) || isStrategicPoint(dot2)) {
            score += 80; // Bonus for connecting strategic points
        }
        
        return score;
    }
    
    function wouldBlockConnection(redDot1, redDot2, blueDot1, blueDot2) {
        // Check if the red line would intersect with potential blue connection
        return doLineSegmentsIntersect(
            redDot1.x, redDot1.y, redDot2.x, redDot2.y,
            blueDot1.x, blueDot1.y, blueDot2.x, blueDot2.y
        );
    }
    
    function wouldBlockPath(startDot, targetX, visited) {
        if (visited.has(startDot)) return false;
        if (startDot.x === targetX) return true;
        
        visited.add(startDot);
        
        for (const connectedDot of startDot.connections) {
            if (wouldBlockPath(connectedDot, targetX, visited)) {
                return true;
            }
        }
        
        return false;
    }

    function findLongestPath(dot, visited) {
        visited.add(dot);
        
        let maxLength = 0;
        for (const connectedDot of dot.connections) {
            if (!visited.has(connectedDot)) {
                const pathLength = 1 + findLongestPath(connectedDot, new Set([...visited]));
                maxLength = Math.max(maxLength, pathLength);
            }
        }
        
        return maxLength;
    }

    // Helper function for line intersection check
    function ccw(p1x, p1y, p2x, p2y, p3x, p3y) {
        return (p3y - p1y) * (p2x - p1x) > (p2y - p1y) * (p3x - p1x);
    }

    function doLineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Check if the line segments share an endpoint
        if ((x1 === x3 && y1 === y3) || (x1 === x4 && y1 === y4) || 
            (x2 === x3 && y2 === y3) || (x2 === x4 && y2 === y4)) {
            return false;
        }
        
        return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) && 
               ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
    }
});