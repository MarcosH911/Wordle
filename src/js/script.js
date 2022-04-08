"use strict";

import { VALID_INPUTS } from "./validInputs.js";
import { VALID_GUESSES } from "./validGuesses.js";
import { WORD_LIST } from "./wordList.js";

const keyboardEl = document.getElementById("keyboard");
const tableRowElements = document.querySelectorAll("tr");
const tableCellElements = document.querySelectorAll("td");
const errorMsgEl = document.getElementById("error-msg");

let tableRow = 0;
let tableCell = 0;
let wordGuess = "";
let correctWord;

const createCorrectWord = function () {
  correctWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
};

const enterLetter = function (letter) {
  let cell = tableCellElements[tableCell + tableRow * 5];

  if (letter === "Enter") {
    if (tableCell !== 5) {
      notValidWord();
      return;
    }

    submitWord(wordGuess);
    return;
  }

  if (letter === "Backspace") {
    if (tableCell <= 0) return;

    tableCell--;
    cell = tableCellElements[tableCell + tableRow * 5];

    cell.dataset.letter = "";
    cell.textContent = "";
    wordGuess = wordGuess.slice(0, -1);
    return;
  }

  if (tableCell >= 5) return;

  cell.dataset.letter = letter;
  cell.textContent = letter;
  wordGuess += letter;
  tableCell++;
};

const submitWord = function () {
  console.log(wordGuess);

  if (!VALID_GUESSES.includes(wordGuess)) {
    notValidWord();
    return;
  }

  if (wordGuess === correctWord) {
    winGame();
  }

  checkLetter();

  tableRow++;
  tableCell = 0;
  wordGuess = "";
};

const notValidWord = function () {
  tableRowElements[tableRow].classList.add("not-valid-word");
  tableRowElements[tableRow].addEventListener("animationend", function () {
    tableRowElements[tableRow].classList.remove("not-valid-word");
  });

  errorMsgEl.classList.add("fade-out");
  errorMsgEl.addEventListener("animationend", function () {
    errorMsgEl.classList.remove("fade-out");
  });
};

const winGame = function () {};

const checkLetter = function () {
  const wordGuessArr = wordGuess.split("");
  const correctWordArr = correctWord.split("");
  for (let i = 0; i < 5; i++) {
    if (wordGuessArr[i] === correctWordArr[i]) {
      tableCellElements[i + tableRow * 5].style.backgroundColor = "green";
      tableCellElements[i + tableRow * 5].style.borderColor = "green";
      correctWordArr[i] = "";
    }
  }
  for (let i = 0; i < 5; i++)
    if (correctWordArr.includes(wordGuessArr[i]) && wordGuessArr[i]) {
      tableCellElements[i + tableRow * 5].style.backgroundColor = "yellow";
      tableCellElements[i + tableRow * 5].style.borderColor = "yellow";
      correctWordArr[correctWordArr.indexOf(wordGuessArr[i])] = "";
    }
};

keyboardEl.addEventListener("click", function (e) {
  const keyEl = e.target.closest("li");

  if (!keyEl) return;

  const key = keyEl.dataset.key;
  enterLetter(key);
});

document.addEventListener("keydown", function (e) {
  if (!VALID_INPUTS.includes(e.key)) return;

  enterLetter(e.key);
});

const init = function () {
  createCorrectWord();
  console.log(correctWord);
};
init();
