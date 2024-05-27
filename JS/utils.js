'use strict';

let colorIndex = 0;
const blockColors = [
  "#FF5F6D",
  "#f3a941",
  "#fff412",
  "#ADFF2F",
  "#00CED1",
  "#1E90FF",
  "#DA70D6",
];

const getNextBlockColor = () => blockColors[colorIndex++ % blockColors.length];

const resetColorIndex = () => {
  colorIndex = 0;
};
