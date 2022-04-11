"use strict";

import { VALID_INPUTS } from "./validInputs.js";
import { VALID_GUESSES } from "./validGuesses.js";
import { WORD_LIST } from "./wordList.js";

const keyboardEl = document.getElementById("keyboard");
const tableRowElements = document.querySelectorAll("tr");
const tableCellElements = document.querySelectorAll("td");
const messageEl = document.getElementById("message");
const statsModalEl = document.querySelector(".statistics-modal");
const statsOverlayEl = document.querySelector(".statistics-overlay");

const statsPlayedEl = document.querySelector(".statistics-played");
const statsWinPercentageEl = document.querySelector(
  ".statistics-win-percentage"
);
const statsCurrentStreakEl = document.querySelector(
  ".statistics-current-streak"
);
const statsMaxStreakEl = document.querySelector(".statistics-max-streak");

const distributionBars = document.querySelectorAll(".distribution-bar");
const distributionCounts = document.querySelectorAll(".distribution-count");

const WIN_MESSAGES = ["Incredible!", "Genius!", "Amazing!"];

let tableRow = 0;
let tableCell = 0;
let wordGuess = "";
let correctWord;

const startGame = function () {
  correctWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  window.localStorage.removeItem("board");
  window.localStorage.setItem("solution", correctWord);
};

const enterLetter = function (letter) {
  let cell = tableCellElements[tableCell + tableRow * 5];

  if (letter === "enter") {
    if (tableCell !== 5) {
      notValidWord();
      return;
    }

    submitWord(wordGuess);
    return;
  }

  if (letter === "backspace") {
    if (tableCell <= 0) return;

    tableCell--;
    cell = tableCellElements[tableCell + tableRow * 5];

    cell.classList.remove("put-letter");

    cell.dataset.letter = "";
    cell.textContent = "";
    wordGuess = wordGuess.slice(0, -1);
    return;
  }

  if (tableCell >= 5) return;

  cell.classList.add("put-letter");

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

  const board = JSON.parse(localStorage.getItem("board")) || [];
  board.push(wordGuess);
  localStorage.setItem("board", JSON.stringify(board));

  if (wordGuess === correctWord) {
    winGame();
  }

  checkWord();

  if (tableRow === 5) {
    setTimeout(function () {
      looseGame();
      return;
    }, 1000);
  }

  tableRow++;
  tableCell = 0;
  wordGuess = "";
};

const notValidWord = function () {
  tableRowElements[tableRow].classList.add("not-valid-word");
  tableRowElements[tableRow].addEventListener("animationend", function () {
    tableRowElements[tableRow].classList.remove("not-valid-word");
  });

  messageEl.textContent = "Not in word list";
  messageEl.classList.add("fade-out");
  messageEl.addEventListener("animationend", function () {
    messageEl.classList.remove("fade-out");
  });
};

const showPlayAgain = function () {};

// statsModalEl.classList.remove("hidden");
// statsOverlayEl.classList.remove("hidden");

const updateStatistics = function () {
  const board = JSON.parse(localStorage.getItem("board")) || [];
  const statistics = JSON.parse(localStorage.getItem("statistics")) || {
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    currentStreak: 0,
    maxStreak: 0,
  };

  if (board.length === 6 && board[5] !== correctWord) {
    statistics.guesses.fail++;
    statistics.currentStreak = 0;
  } else {
    statistics.guesses[board.length]++;
    statistics.currentStreak++;
    statistics.maxStreak =
      statistics.maxStreak < statistics.currentStreak
        ? statistics.currentStreak
        : statistics.maxStreak;
  }

  localStorage.setItem("statistics", JSON.stringify(statistics));

  return statistics;
};

const showStatistics = function (statistics) {
  statsModalEl.classList.remove("hidden");
  statsOverlayEl.classList.remove("hidden");

  const gamesPlayed = getGamesPlayed(statistics);

  statsPlayedEl.textContent = gamesPlayed;
  statsWinPercentageEl.textContent = (
    ((gamesPlayed - statistics.guesses.fail) / gamesPlayed) *
    100
  ).toFixed(0);
  statsCurrentStreakEl.textContent = statistics.currentStreak;
  statsMaxStreakEl.textContent = statistics.maxStreak;

  distributionCounts.forEach((count, i) => {
    count.textContent = statistics.guesses[i + 1];
  });

  distributionBars.forEach((bar, i) => {
    bar.style.paddingRight = `${
      (statistics.guesses[i + 1] / gamesPlayed) * 100
    }%`;
    if (statistics.guesses[i + 1] !== 0) bar.style.backgroundColor = "#648c50";
  });
};

const gameEnd = function (message) {
  document.removeEventListener("keydown", keyboardCallback);
  keyboardEl.removeEventListener("click", screenKeyboardCallback);

  const statistics = updateStatistics();

  setTimeout(function () {
    messageEl.textContent = message;
    messageEl.classList.add("fade-out");
    messageEl.addEventListener("animationend", function () {
      messageEl.classList.remove("fade-out");
    });
  }, 1000);

  setTimeout(() => showStatistics(statistics), 2500);
};

const getGamesPlayed = function (statistics) {
  let gamesPlayed = 0;
  for (const label in statistics.guesses) {
    gamesPlayed += statistics.guesses[label];
  }
  return gamesPlayed;
};

const looseGame = function () {
  gameEnd(correctWord);
};

const winAnimation = function () {
  let animationDelay = 0;

  for (let i = 0; i < 5; i++) {
    setTimeout(
      () =>
        tableCellElements[+i + (tableRow - 1) * 5].classList.add("flip-green"),
      animationDelay
    );
    animationDelay += 100;
  }

  animationDelay = 0;

  setTimeout(function () {
    for (let i = 0; i < 5; i++) {
      setTimeout(
        () =>
          tableCellElements[+i + (tableRow - 1) * 5].classList.add(
            "win-animation"
          ),
        animationDelay
      );
      animationDelay += 100;
    }
  }, 1000);
};

const winGame = function () {
  gameEnd(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);

  winAnimation();
};

const checkWord = function () {
  const wordGuessArr = wordGuess.split("");
  const correctWordArr = correctWord.split("");
  const lettersInfo = {};

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
    setTimeout(() => {
      tableCellElements[+i + (tableRow - 1) * 5].style.borderColor = "white";
      tableCellElements[+i + (tableRow - 1) * 5].classList.remove("put-letter");

      tableCellElements[+i + (tableRow - 1) * 5].classList.add(`flip-${value}`);
    }, flipDelay);
    flipDelay += 100;
  }
};

const screenKeyboardCallback = function (e) {
  const keyEl = e.target.closest("li");

  if (!keyEl) return;

  const key = keyEl.dataset.key;
  enterLetter(key.toLowerCase);
};

keyboardEl.addEventListener("click", screenKeyboardCallback);

const keyboardCallback = function (e) {
  if (!VALID_INPUTS.includes(e.key.toLowerCase())) return;

  enterLetter(e.key.toLowerCase());
};

document.addEventListener("keydown", keyboardCallback);

const init = function () {
  startGame();
  console.log(correctWord);
};
init();
