const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gameTitle = document.getElementById('gameTitle');
const startButton = document.getElementById('startButton');

let stack = [];
let initialSpeed = 2;
const initialSize = 150;
let speedIncrement = 0.1;
let score = 0;
let gameOver = false;
let gameStarted = false;
let colorIndex = 0;

const colors = [
    '#FF5F6D',
    '#f3a941',
    '#fff412',
    '#ADFF2F',
    '#00CED1',
    '#1E90FF',
    '#DA70D6'
];

const getNextColor = () => colors[colorIndex++ % colors.length];

const createBlock = (size, isFirstBlock = false) => {
    const y = canvas.height - (stack.length + 1) * 30;
    const color = getNextColor();
    let x, direction;
    if (isFirstBlock) {
        x = canvas.width / 2 - size / 2;
        direction = 0;
    } else {
        direction = Math.random() < 0.5 ? initialSpeed : -initialSpeed;
        x = direction > 0 ? 0 : canvas.width - size;
    }
    stack.push({ x, y, size, color, direction });
};

const update = () => {
    if (gameOver) return;
    const block = stack[stack.length - 1];
    block.x += block.direction;
    if (block.x <= 0 || block.x + block.size >= canvas.width) {
        block.direction *= -1;
    }
    if (block.y + 30 <= canvas.height / 2) {
        stack.forEach(b => b.y += 30);
        stack = stack.filter(b => b.y < canvas.height);
    }
};

const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    stack.forEach(block => {
        context.fillStyle = block.color;
        context.fillRect(block.x, block.y, block.size, 30);
    });
};

const placeBlock = () => {
    if (stack.length < 2) {
        createBlock(initialSize);
        return;
    }
    const block = stack.pop();
    const previousBlock = stack[stack.length - 1];
    const dx = block.x - previousBlock.x;
    const overlap = previousBlock.size - Math.abs(dx);

    if (overlap > 0) {
        block.size = overlap;
        block.x = dx > 0 ? previousBlock.x + (previousBlock.size - overlap) : previousBlock.x;
        initialSpeed += speedIncrement;
        stack.push(block);
        createBlock(block.size);
        score++;
        document.getElementById('score').innerText = score;
    } else {
        gameOver = true;
        gameStarted = false;
        document.getElementById('score').classList.add('hidden');
        document.getElementById('finalMessage').innerText = "Game Over!";
        document.getElementById('finalScore').innerText = score;
        document.getElementById('result').classList.remove('hidden');
        startButton.disabled = false;
    }
};

const resetGame = () => {
    stack = [];
    score = 0;
    gameOver = false;
    gameStarted = true;
    colorIndex = 0;
    initialSpeed = 2;
    document.getElementById('score').innerText = score;
    document.getElementById('score').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('stackContainer').classList.remove('hidden');
    createBlock(initialSize, true);
    createBlock(initialSize);
    gameLoop();
    gameTitle.classList.add('small');
};

const gameLoop = () => {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
};

startButton.addEventListener('click', () => {
    gameStarted = true;
    resetGame();
    startButton.blur();
    startButton.disabled = true;
});

document.getElementById('instructionButton').addEventListener('click', () => {
    document.getElementById('instructionContainer').classList.add('show');
});

document.getElementById('closeInstructionButton').addEventListener('click', () => {
    document.getElementById('instructionContainer').classList.remove('show');
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameStarted && !gameOver) {
        placeBlock();
    }
});
