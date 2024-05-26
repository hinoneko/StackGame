const canvasElement = document.getElementById('gameCanvas');
const canvasContext = canvasElement.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const exitButton = document.getElementById('exitButton');
const titleScreen = document.getElementById('titleScreen');
const gameScreen = document.getElementById('gameScreen');
const scoreElement = document.getElementById('score');
const resultElement = document.getElementById('result');
const finalMessageElement = document.getElementById('finalMessage');
const finalScoreElement = document.getElementById('finalScore');
const restartConfirmation = document.getElementById('restartConfirmation');
const confirmRestartButton = document.getElementById('confirmRestartButton');
const cancelRestartButton = document.getElementById('cancelRestartButton');

const blockHeight = 30;
const initialBlockSpeed = 2;
let currentBlockSpeed = initialBlockSpeed;
const initialBlockSize = 200;
const blockSpeedIncrement = 0.1;
let playerScore = 0;
let isGameOver = false;
let isGameStarted = false;
let colorIndex = 0;
let blockStack = [];

const blockColors = [
    '#FF5F6D',
    '#f3a941',
    '#fff412',
    '#ADFF2F',
    '#00CED1',
    '#1E90FF',
    '#DA70D6'
];

const getNextBlockColor = () => blockColors[colorIndex++ % blockColors.length];

const createBlock = (size, isFirstBlock = false) => {
    const yPosition = canvasElement.height - (blockStack.length + 1) * blockHeight;
    const blockColor = getNextBlockColor();
    let xPosition, movementDirection;
    if (isFirstBlock) {
        xPosition = canvasElement.width / 2 - size / 2;
        movementDirection = 0;
    } else {
        movementDirection = Math.random() < 0.5 ? currentBlockSpeed : -currentBlockSpeed;
        xPosition = movementDirection > 0 ? 0 : canvasElement.width - size;
    }
    blockStack.push({ xPosition, yPosition, size, blockColor, movementDirection });
};

const updateBlocks = () => {
    if (isGameOver) return;
    const currentBlock = blockStack[blockStack.length - 1];
    currentBlock.xPosition += currentBlock.movementDirection;
    if (currentBlock.xPosition <= 0 || currentBlock.xPosition + currentBlock.size >= canvasElement.width) {
        currentBlock.movementDirection *= -1;
    }
    if (currentBlock.yPosition + blockHeight <= canvasElement.height / 2) {
        blockStack.forEach(block => block.yPosition += blockHeight);
        blockStack = blockStack.filter(block => block.yPosition < canvasElement.height);
    }
};

const drawBlocks = () => {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    blockStack.forEach(block => {
        canvasContext.fillStyle = block.blockColor;
        canvasContext.fillRect(block.xPosition, block.yPosition, block.size, blockHeight);
    });
};

const placeBlock = () => {
    if (blockStack.length < 2) {
        createBlock(initialBlockSize);
        return;
    }
    const currentBlock = blockStack.pop();
    const previousBlock = blockStack[blockStack.length - 1];
    const positionDifference = currentBlock.xPosition - previousBlock.xPosition;
    const overlap = previousBlock.size - Math.abs(positionDifference);

    if (overlap > 0) {
        currentBlock.size = overlap;
        currentBlock.xPosition = positionDifference > 0 ? previousBlock.xPosition + (previousBlock.size - overlap) : previousBlock.xPosition;
        currentBlockSpeed += blockSpeedIncrement;
        blockStack.push(currentBlock);
        createBlock(currentBlock.size);
        playerScore++;
        scoreElement.innerText = playerScore;
    } else {
        endGame();
    }
};

const resetGame = () => {
    blockStack = [];
    playerScore = 0;
    isGameOver = false;
    isGameStarted = true;
    colorIndex = 0;
    currentBlockSpeed = initialBlockSpeed; // Reset the block speed here
    scoreElement.innerText = playerScore;
    scoreElement.classList.remove('hidden');
    resultElement.classList.add('hidden');
    createBlock(initialBlockSize, true);
    createBlock(initialBlockSize);
    gameLoop();
};

const endGame = () => {
    isGameOver = true;
    isGameStarted = false;
    currentBlockSpeed = initialBlockSpeed; // Reset the block speed here
    scoreElement.classList.add('hidden');
    finalMessageElement.innerText = "Game Over!";
    finalScoreElement.innerText = playerScore;
    resultElement.classList.remove('hidden');
    startButton.disabled = false;
    restartButton.disabled = false;
};

const stopGame = () => {
    isGameOver = true;
    isGameStarted = false;
    currentBlockSpeed = initialBlockSpeed; // Reset the block speed here as well
    scoreElement.classList.add('hidden');
    resultElement.classList.add('hidden');
    startButton.disabled = false;
    restartButton.disabled = false;
};

const gameLoop = () => {
    updateBlocks();
    drawBlocks();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
};

startButton.addEventListener('click', () => {
    resetGame();
    startButton.blur();
    startButton.disabled = true;
    restartButton.disabled = false;
    titleScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});

restartButton.addEventListener('click', () => {
    if (isGameOver) {
        resetGame();
        restartButton.blur();
        startButton.disabled = true;
    } else {
        restartConfirmation.classList.add('show');
    }
});

confirmRestartButton.addEventListener('click', () => {
    resetGame();
    restartConfirmation.classList.remove('show');
    restartButton.blur();
    startButton.disabled = true;
});

cancelRestartButton.addEventListener('click', () => {
    restartConfirmation.classList.remove('show');
});

exitButton.addEventListener('click', () => {
    stopGame();
    titleScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    document.querySelector('.title').classList.remove('small');
    scoreElement.classList.add('hidden');
    resultElement.classList.add('hidden');
    startButton.disabled = false;
    restartButton.disabled = true;
});

document.getElementById('instructionButton').addEventListener('click', () => {
    document.getElementById('instructionContainer').classList.add('show');
});

document.getElementById('closeInstructionButton').addEventListener('click', () => {
    document.getElementById('instructionContainer').classList.remove('show');
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && isGameStarted && !isGameOver) {
        placeBlock();
    }
});

