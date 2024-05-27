const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const exitButton = document.getElementById("exitButton");
const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const scoreElement = document.getElementById("score");
const resultElement = document.getElementById("result");
const finalMessageElement = document.getElementById("finalMessage");
const finalScoreElement = document.getElementById("finalScore");
const restartConfirmation = document.getElementById("restartConfirmation");
const confirmRestartButton = document.getElementById("confirmRestartButton");
const cancelRestartButton = document.getElementById("cancelRestartButton");

startButton.addEventListener("click", () => {
  resetGame();
  startButton.blur();
  startButton.disabled = true;
  restartButton.disabled = false;
  titleScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
});

restartButton.addEventListener("click", () => {
  if (isGameOver) {
    resetGame();
    restartButton.blur();
    startButton.disabled = true;
  } else {
    restartConfirmation.classList.add("show");
  }
});

confirmRestartButton.addEventListener("click", () => {
  resetGame();
  restartConfirmation.classList.remove("show");
  restartButton.blur();
  startButton.disabled = true;
});

cancelRestartButton.addEventListener("click", () => {
  restartConfirmation.classList.remove("show");
});

exitButton.addEventListener("click", () => {
  stopGame();
});

document.getElementById("instructionButton").addEventListener("click", () => {
  document.getElementById("instructionContainer").classList.add("show");
});

document
  .getElementById("closeInstructionButton")
  .addEventListener("click", () => {
    document.getElementById("instructionContainer").classList.remove("show");
  });
