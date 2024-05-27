'use strict';

const themeToggle = document.getElementById("themeToggle");

const toggleTheme = () => {
  document.body.classList.toggle("dark-mode");
};

const removeFocusFromSwitcher = () => {
  themeToggle.blur();
};

themeToggle.addEventListener("change", () => {
  toggleTheme();
  removeFocusFromSwitcher();
});
