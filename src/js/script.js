"use strict";

import VALID_GUESSES from "src/js/validGuesses.js";

const keyboardEl = document.getElementById("keyboard");
const tableCellElements = document.querySelectorAll("td");

let tableRow = 0;
let tableCell = 0;
let word = "";

const enterLetter = function (letter) {
  let cell = tableCellElements[tableCell + tableRow * 5];

  if (letter === "Enter") {
    if (tableCell !== 5) {
      notValidWord();
      return;
    }

    submitWord(word);
    return;
  }

  if (letter === "Backspace") {
    if (tableCell <= 0) return;

    tableCell--;
    cell = tableCellElements[tableCell + tableRow * 5];

    cell.dataset.letter = "";
    cell.textContent = "";
    word.slice(0, -1);
    return;
  }

  if (tableCell >= 5) return;

  cell.dataset.letter = letter;
  cell.textContent = letter;
  word += letter;
  tableCell++;
};

const submitWord = function (word) {
  if (!VALID_GUESSES.includes(word)) {
    notValidWord();
    return;
  }
};

const notValidWord = function () {};

keyboardEl.addEventListener("click", function (e) {
  const keyEl = e.target.closest("li");

  if (!keyEl) return;

  const key = keyEl.dataset.key;
  enterLetter(key);
});

document.addEventListener("keydown", function (e) {
  enterLetter(e.key);
});
