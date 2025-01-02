"use strict";

const canvasElement = document.getElementById("gameCanvas");
const canvasContext = canvasElement ? canvasElement.getContext("2d") : null;

if (!canvasElement || !canvasContext) {
  console.error("Canvas or its context not found. Game cannot be started.");
}

const blockHeight = 30;
const initialBlockSpeed = 2;
const initialBlockSize = 200;
const blockSpeedIncrement = 0.1;
let currentBlockSpeed = initialBlockSpeed;
let playerScore = 0;
let isGameOver = false;
let isGameStarted = false;
let isGameRunning = false;
let blockStack = [];

const createBlock = (size, isFirstBlock = false) => {
  const yPosition =
      canvasElement.height - (blockStack.length + 1) * blockHeight;
  const blockColor = getNextBlockColor();
  let xPosition, movementDirection;

  if (isFirstBlock) {
    xPosition = canvasElement.width / 2 - size / 2;
    movementDirection = 0;
  } else {
    movementDirection =
        Math.random() < 0.5 ? currentBlockSpeed : -currentBlockSpeed;
    xPosition = movementDirection > 0 ? 0 : canvasElement.width - size;
  }

  blockStack.push(
      new Block(xPosition, yPosition, size, blockColor, movementDirection),
  );
};

const updateBlocks = () => {
  if (isGameOver) return;
  const currentBlock = blockStack[blockStack.length - 1];
  currentBlock.move();

  if (currentBlock.yPosition + blockHeight <= canvasElement.height / 2) {
    blockStack.forEach((block) => (block.yPosition += blockHeight));
    blockStack = blockStack.filter(
        (block) => block.yPosition < canvasElement.height,
    );
  }
};

const drawBlocks = () => {
  canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
  blockStack.forEach((block) => block.draw(canvasContext));
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
    currentBlock.xPosition =
        positionDifference > 0
            ? previousBlock.xPosition + (previousBlock.size - overlap)
            : previousBlock.xPosition;
    currentBlockSpeed += blockSpeedIncrement;
    blockStack.push(currentBlock);
    createBlock(currentBlock.size);
    playerScore++;
    scoreElement.innerText = playerScore;
  } else {
    endGame();
  }
};

const initGameVars = () => {
  blockStack = [];
  playerScore = 0;
  isGameOver = false;
  isGameStarted = true;
  currentBlockSpeed = initialBlockSpeed;
  resetColorIndex();
};

const setupUI = () => {
  scoreElement.innerText = playerScore;
  scoreElement.classList.remove("hidden");
  resultElement.classList.add("hidden");
  createBlock(initialBlockSize, true);
  createBlock(initialBlockSize);
};

const startGameLoop = () => {
  if (!isGameRunning) {
    gameLoop();
    isGameRunning = true;
  }
};

const resetGame = () => {
  initGameVars();
  setupUI();
  startGameLoop();
};

const handleGameOver = () => {
  isGameOver = true;
  isGameStarted = false;
  isGameRunning = false;
  currentBlockSpeed = initialBlockSpeed;
  scoreElement.classList.add("hidden");
  startButton.disabled = false;
};

const endGame = () => {
  handleGameOver();
  finalMessageElement.innerText = "Game Over!";
  finalScoreElement.innerText = playerScore;
  resultElement.classList.remove("hidden");
  restartButton.disabled = false;
};

const stopGame = () => {
  handleGameOver();
  resultElement.classList.add("hidden");
  titleScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  document.querySelector(".title").classList.remove("small");
  restartButton.disabled = true;
};

const gameLoop = () => {
  if (!document.hasFocus()) {
    requestAnimationFrame(gameLoop);
    return;
  }

  updateBlocks();
  drawBlocks();

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
};

const placeBlockHandler = (e) => {
  if (
      e.code === "Space" &&
      isGameStarted &&
      !isGameOver &&
      document.activeElement !== themeToggle
  ) {
    placeBlock();
  }
};

window.addEventListener("keydown", placeBlockHandler);