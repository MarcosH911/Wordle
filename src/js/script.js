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
  // correctWord = "folly";
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
  const lettersInfo = {};
  const tempRow = tableRow;

  wordGuessArr.forEach(function (l, i) {
    lettersInfo[l + i] = null;
  });

  for (let i = 0; i < 5; i++) {
    if (wordGuessArr[i] === correctWordArr[i]) {
      const keyEl = keyboardEl.querySelector(
        `li[data-key='${wordGuessArr[i]}']`
      );

      lettersInfo[wordGuessArr[i] + i] = "green";
      keyEl.style.backgroundColor = "green";
      keyEl.style.borderColor = "green";

      correctWordArr[i] = "";
      wordGuessArr[i] = "";
    }
  }
  for (let i = 0; i < 5; i++) {
    if (correctWordArr.includes(wordGuessArr[i]) && wordGuessArr[i]) {
      const keyEl = keyboardEl.querySelector(
        `li[data-key='${wordGuessArr[i]}']`
      );
      if (keyEl.style.backgroundColor === "") {
        keyEl.style.backgroundColor = "#b59f3b";
        keyEl.style.borderColor = "#b59f3b";
      }
      lettersInfo[wordGuessArr[i] + i] = "yellow";

      correctWordArr[correctWordArr.indexOf(wordGuessArr[i])] = "";
      wordGuessArr[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    const keyEl = keyboardEl.querySelector(
      `li[data-key='${wordGuess.charAt(i)}']`
    );

    if (
      keyEl.style.backgroundColor === "" ||
      keyEl.style.backgroundColor === "rgb(51, 51, 51)"
    ) {
      keyEl.style.backgroundColor = "#333333";
      keyEl.style.borderColor = "#333333";
    }

    if (!lettersInfo[wordGuessArr[i]] && wordGuessArr[i]) {
      lettersInfo[wordGuessArr[i] + i] = "grey";
    }
  }

  let flipDelay = 0;

  for (const [i, [_, value]] of Object.entries(Object.entries(lettersInfo))) {
    if (+i === 5) return;
    setTimeout(
      () => tableCellElements[+i + tempRow * 5].classList.add(`flip-${value}`),
      flipDelay
    );
    flipDelay += 100;
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
