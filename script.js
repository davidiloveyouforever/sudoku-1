class SudokuGame {
    constructor() {
        this.board = [];
        this.solution = [];
        this.originalBoard = [];
        this.selectedCell = null;
        this.mistakes = 0;
        this.startTime = Date.now();
        this.timerInterval = null;
        
        this.initializeGame();
        this.setupEventListeners();
        this.startTimer();
    }
    
    initializeGame() {
        this.generateHardPuzzle();
        this.renderBoard();
    }
    
    generateHardPuzzle() {
        // 隨機選擇一個數獨題目模板
        this.solution = this.getRandomPuzzle();
        
        // 創建困難題目（只保留約25-30個數字）
        this.board = this.solution.map(function(row) { return row.slice(); });
        this.originalBoard = this.solution.map(function(row) { return row.slice(); });
        
        // 隨機移除數字，創建困難題目
        var cellsToRemove = 55; // 困難模式：移除55個數字
        var removed = 0;
        
        while (removed < cellsToRemove) {
            var row = Math.floor(Math.random() * 9);
            var col = Math.floor(Math.random() * 9);
            
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                this.originalBoard[row][col] = 0;
                removed++;
            }
        }
    }
    
    getRandomPuzzle() {
        // 多個預定義的數獨題目模板
        var puzzles = [
            // 模板1
            [
                [5, 3, 4, 6, 7, 8, 9, 1, 2],
                [6, 7, 2, 1, 9, 5, 3, 4, 8],
                [1, 9, 8, 3, 4, 2, 5, 6, 7],
                [8, 5, 9, 7, 6, 1, 4, 2, 3],
                [4, 2, 6, 8, 5, 3, 7, 9, 1],
                [7, 1, 3, 9, 2, 4, 8, 5, 6],
                [9, 6, 1, 5, 3, 7, 2, 8, 4],
                [2, 8, 7, 4, 1, 9, 6, 3, 5],
                [3, 4, 5, 2, 8, 6, 1, 7, 9]
            ],
            // 模板2
            [
                [8, 1, 2, 7, 5, 3, 6, 4, 9],
                [9, 4, 3, 6, 8, 2, 1, 7, 5],
                [6, 7, 5, 4, 9, 1, 2, 8, 3],
                [1, 5, 4, 2, 3, 7, 8, 9, 6],
                [3, 6, 9, 8, 4, 5, 7, 2, 1],
                [2, 8, 7, 1, 6, 9, 5, 3, 4],
                [5, 2, 1, 9, 7, 4, 3, 6, 8],
                [4, 3, 8, 5, 2, 6, 9, 1, 7],
                [7, 9, 6, 3, 1, 8, 4, 5, 2]
            ],
            // 模板3
            [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [2, 3, 1, 5, 6, 4, 8, 9, 7],
                [5, 6, 4, 8, 9, 7, 2, 3, 1],
                [8, 9, 7, 2, 3, 1, 5, 6, 4],
                [3, 1, 2, 6, 4, 5, 9, 7, 8],
                [6, 4, 5, 9, 7, 8, 3, 1, 2],
                [9, 7, 8, 3, 1, 2, 6, 4, 5]
            ],
            // 模板4
            [
                [9, 8, 7, 6, 5, 4, 3, 2, 1],
                [6, 5, 4, 3, 2, 1, 9, 8, 7],
                [3, 2, 1, 9, 8, 7, 6, 5, 4],
                [8, 7, 9, 5, 4, 6, 2, 1, 3],
                [5, 4, 6, 2, 1, 3, 8, 7, 9],
                [2, 1, 3, 8, 7, 9, 5, 4, 6],
                [7, 9, 8, 4, 6, 5, 1, 3, 2],
                [4, 6, 5, 1, 3, 2, 7, 9, 8],
                [1, 3, 2, 7, 9, 8, 4, 6, 5]
            ],
            // 模板5
            [
                [2, 4, 6, 8, 1, 3, 5, 7, 9],
                [8, 1, 3, 5, 7, 9, 2, 4, 6],
                [5, 7, 9, 2, 4, 6, 8, 1, 3],
                [4, 6, 8, 1, 3, 5, 7, 9, 2],
                [1, 3, 5, 7, 9, 2, 4, 6, 8],
                [7, 9, 2, 4, 6, 8, 1, 3, 5],
                [6, 8, 1, 3, 5, 7, 9, 2, 4],
                [3, 5, 7, 9, 2, 4, 6, 8, 1],
                [9, 2, 4, 6, 8, 1, 3, 5, 7]
            ],
            // 模板6
            [
                [7, 2, 4, 9, 6, 1, 3, 8, 5],
                [3, 8, 5, 2, 4, 7, 6, 1, 9],
                [6, 1, 9, 5, 3, 8, 2, 7, 4],
                [8, 5, 2, 1, 9, 4, 7, 3, 6],
                [4, 9, 6, 7, 2, 3, 1, 5, 8],
                [1, 7, 3, 6, 8, 5, 9, 4, 2],
                [5, 4, 7, 3, 1, 2, 8, 9, 6],
                [9, 6, 1, 8, 5, 7, 4, 2, 3],
                [2, 3, 8, 4, 7, 9, 5, 6, 1]
            ],
            // 模板7
            [
                [4, 7, 2, 1, 9, 6, 8, 3, 5],
                [9, 5, 8, 3, 4, 2, 1, 6, 7],
                [6, 1, 3, 7, 8, 5, 4, 2, 9],
                [2, 8, 7, 4, 1, 9, 6, 5, 3],
                [5, 3, 1, 6, 2, 8, 9, 7, 4],
                [8, 4, 6, 9, 5, 3, 2, 1, 8],
                [7, 2, 4, 8, 6, 1, 3, 9, 5],
                [1, 9, 5, 2, 3, 4, 7, 8, 6],
                [3, 6, 9, 5, 7, 8, 1, 4, 2]
            ],
            // 模板8
            [
                [6, 3, 1, 9, 4, 7, 2, 5, 8],
                [9, 4, 7, 2, 5, 8, 6, 3, 1],
                [2, 5, 8, 6, 3, 1, 9, 4, 7],
                [1, 6, 3, 7, 9, 4, 8, 2, 5],
                [7, 9, 4, 8, 2, 5, 1, 6, 3],
                [8, 2, 5, 1, 6, 3, 7, 9, 4],
                [3, 1, 6, 4, 7, 9, 5, 8, 2],
                [4, 7, 9, 5, 8, 2, 3, 1, 6],
                [5, 8, 2, 3, 1, 6, 4, 7, 9]
            ]
        ];
        
        // 隨機選擇一個題目模板
        var randomIndex = Math.floor(Math.random() * puzzles.length);
        var selectedPuzzle = puzzles[randomIndex];
        
        // 隨機變換題目（行交換、列交換、數字替換等）
        return this.transformPuzzle(selectedPuzzle);
    }
    
    transformPuzzle(puzzle) {
        var transformed = puzzle.map(function(row) { return row.slice(); });
        
        // 隨機行交換（在3x3宮格內）
        for (var i = 0; i < 3; i++) {
            var startRow = i * 3;
            if (Math.random() > 0.5) {
                // 交換相鄰兩行
                var temp = transformed[startRow].slice();
                transformed[startRow] = transformed[startRow + 1].slice();
                transformed[startRow + 1] = temp;
            }
            if (Math.random() > 0.5) {
                // 交換第一行和第三行
                var temp = transformed[startRow].slice();
                transformed[startRow] = transformed[startRow + 2].slice();
                transformed[startRow + 2] = temp;
            }
        }
        
        // 隨機列交換（在3x3宮格內）
        for (var j = 0; j < 3; j++) {
            var startCol = j * 3;
            if (Math.random() > 0.5) {
                // 交換相鄰兩列
                for (var row = 0; row < 9; row++) {
                    var temp = transformed[row][startCol];
                    transformed[row][startCol] = transformed[row][startCol + 1];
                    transformed[row][startCol + 1] = temp;
                }
            }
            if (Math.random() > 0.5) {
                // 交換第一列和第三列
                for (var row = 0; row < 9; row++) {
                    var temp = transformed[row][startCol];
                    transformed[row][startCol] = transformed[row][startCol + 2];
                    transformed[row][startCol + 2] = temp;
                }
            }
        }
        
        // 隨機數字替換（保持數獨規則）
        if (Math.random() > 0.5) {
            var num1 = Math.floor(Math.random() * 9) + 1;
            var num2 = Math.floor(Math.random() * 9) + 1;
            if (num1 !== num2) {
                for (var row = 0; row < 9; row++) {
                    for (var col = 0; col < 9; col++) {
                        if (transformed[row][col] === num1) {
                            transformed[row][col] = num2;
                        } else if (transformed[row][col] === num2) {
                            transformed[row][col] = num1;
                        }
                    }
                }
            }
        }
        
        return transformed;
    }
    
    renderBoard() {
        var boardElement = document.getElementById('sudokuBoard');
        boardElement.innerHTML = '';
        
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                var cell = document.createElement('input');
                cell.type = 'text';
                cell.className = 'sudoku-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.originalBoard[row][col] !== 0) {
                    cell.value = this.originalBoard[row][col];
                    cell.classList.add('original');
                    cell.readOnly = true;
                } else if (this.board[row][col] !== 0) {
                    cell.value = this.board[row][col];
                    cell.classList.add('user-input');
                }
                
                var self = this;
                cell.addEventListener('click', function() { self.selectCell(this); });
                cell.addEventListener('input', function(e) { self.handleCellInput(e, row, col); });
                cell.addEventListener('keydown', function(e) { self.handleKeyDown(e, row, col); });
                
                boardElement.appendChild(cell);
            }
        }
    }
    
    selectCell(cell) {
        if (this.selectedCell) {
            this.selectedCell.classList.remove('selected');
        }
        
        if (!cell.classList.contains('original')) {
            cell.classList.add('selected');
            this.selectedCell = cell;
            cell.focus();
        }
    }
    
    handleCellInput(e, row, col) {
        var value = e.target.value;
        
        if (value === '' || (value >= '1' && value <= '9')) {
            this.board[row][col] = value === '' ? 0 : parseInt(value);
            
            if (value !== '') {
                e.target.classList.add('user-input');
                e.target.classList.remove('error', 'correct');
                
                // 檢查輸入是否正確
                if (this.board[row][col] !== this.solution[row][col]) {
                    this.showError(e.target);
                } else {
                    this.showCorrect(e.target);
                }
            } else {
                e.target.classList.remove('user-input', 'error', 'correct');
            }
        } else {
            e.target.value = '';
        }
    }
    
    handleKeyDown(e, row, col) {
        if (e.key >= '1' && e.key <= '9') {
            this.board[row][col] = parseInt(e.key);
            e.target.value = e.key;
            e.target.classList.add('user-input');
            e.target.classList.remove('error', 'correct');
            
            if (this.board[row][col] !== this.solution[row][col]) {
                this.showError(e.target);
            } else {
                this.showCorrect(e.target);
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            this.board[row][col] = 0;
            e.target.value = '';
            e.target.classList.remove('user-input', 'error', 'correct');
        }
    }
    
    showError(cell) {
        cell.classList.remove('correct');
        cell.classList.add('error');
        this.playErrorSound();
        this.mistakes++;
        this.updateMistakes();
    }
    
    showCorrect(cell) {
        cell.classList.remove('error');
        cell.classList.add('correct');
    }
    
    playErrorSound() {
        var audio = document.getElementById('errorSound');
        audio.currentTime = 0;
        audio.play().catch(function(e) { console.log('音頻播放失敗:', e); });
    }
    
    updateMistakes() {
        document.getElementById('mistakes').textContent = '錯誤: ' + this.mistakes;
    }
    
    startTimer() {
        var self = this;
        this.timerInterval = setInterval(function() {
            var elapsed = Math.floor((Date.now() - self.startTime) / 1000);
            var minutes = Math.floor(elapsed / 60);
            var seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                '時間: ' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }, 1000);
    }
    
    setupEventListeners() {
        var self = this;
        
        // 數字按鈕
        var numBtns = document.querySelectorAll('.num-btn');
        for (var i = 0; i < numBtns.length; i++) {
            numBtns[i].addEventListener('click', function() {
                if (self.selectedCell && !self.selectedCell.classList.contains('original')) {
                    var number = this.dataset.number;
                    var row = parseInt(self.selectedCell.dataset.row);
                    var col = parseInt(self.selectedCell.dataset.col);
                    
                    self.board[row][col] = parseInt(number);
                    self.selectedCell.value = number;
                    self.selectedCell.classList.add('user-input');
                    self.selectedCell.classList.remove('error', 'correct');
                    
                    if (self.board[row][col] !== self.solution[row][col]) {
                        self.showError(self.selectedCell);
                    } else {
                        self.showCorrect(self.selectedCell);
                    }
                }
            });
        }
        
        // 清除按鈕
        document.getElementById('clearBtn').addEventListener('click', function() {
            if (self.selectedCell && !self.selectedCell.classList.contains('original')) {
                var row = parseInt(self.selectedCell.dataset.row);
                var col = parseInt(self.selectedCell.dataset.col);
                
                self.board[row][col] = 0;
                self.selectedCell.value = '';
                self.selectedCell.classList.remove('user-input', 'error', 'correct');
            }
        });
        
        // 新遊戲按鈕
        document.getElementById('newGameBtn').addEventListener('click', function() {
            self.resetGame();
        });
        
        // 檢查按鈕
        document.getElementById('checkBtn').addEventListener('click', function() {
            self.checkSolution();
        });
    }
    
    resetGame() {
        clearInterval(this.timerInterval);
        this.mistakes = 0;
        this.startTime = Date.now();
        this.initializeGame();
        this.startTimer();
        this.updateMistakes();
    }
    
    checkSolution() {
        var isComplete = true;
        var isCorrect = true;
        
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    isComplete = false;
                } else if (this.board[row][col] !== this.solution[row][col]) {
                    isCorrect = false;
                }
            }
        }
        
        if (!isComplete) {
            alert('請先完成所有格子！');
        } else if (!isCorrect) {
            alert('解答不正確，請檢查！');
        } else {
            alert('恭喜！數獨解答正確！');
            clearInterval(this.timerInterval);
        }
    }
}

// 當頁面加載完成後初始化遊戲
document.addEventListener('DOMContentLoaded', function() {
    new SudokuGame();
});
