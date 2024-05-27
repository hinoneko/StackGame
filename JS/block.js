'use strict';

class Block {
  constructor(xPosition, yPosition, size, blockColor, movementDirection = 0) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.size = size;
    this.blockColor = blockColor;
    this.movementDirection = movementDirection;
  }

  move() {
    this.xPosition += this.movementDirection;
    if (
      this.xPosition <= 0 ||
      this.xPosition + this.size >= canvasElement.width
    ) {
      this.movementDirection *= -1;
    }
  }

  draw(context) {
    context.fillStyle = this.blockColor;
    context.fillRect(this.xPosition, this.yPosition, this.size, blockHeight);
  }
}
