import { solveSudoku, generator } from "./algo.js";

let board;

let timer, timeRemaining, selectedNum, selectedTile, disableSelect;

window.onload = function () {
  id("start-btn").addEventListener("click", startGame);
  id("solve-btn").addEventListener("click", solveGame);
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      if (!disableSelect) {
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
};

function id(id) {
  return document.getElementById(id);
}
function qs(selector) {
  return document.querySelector(selector);
}
function qsa(selector) {
  return document.querySelectorAll(selector);
}

function startGame() {
  const timeToGenerate = id("Easy").checked
    ? 3
    : id("Medium").checked
    ? 800
    : 2000;

  board = generator(timeToGenerate);
  disableSelect = false;
  generateBoard(board);
  startTimer();
  if (id("Light").checked) {
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }
  //show solution and number-container after game starts
  id("number-container").classList.remove("hidden");
  id("solve-btn").classList.remove("hidden");
  //hide game options after games starts
  id("difficulty").classList.add("hidden");
  id("theme").classList.add("hidden");
  id("time").classList.add("hidden");
}

function solveGame() {
  let solution = solveSudoku(board);

  for (let i = 0; i < 81; i++) {
    if (!id(i).classList.contains("fixed")) {
      id(i).value == solution[Math.floor(i / 9)][i - Math.floor(i / 9) * 9]
        ? id(i).classList.add("correct")
        : id(i).classList.add("incorrect");
      id(i).value = solution[Math.floor(i / 9)][i - Math.floor(i / 9) * 9];
    }
  }
  id("solve-btn").classList.remove("hidden");

  endGame();
}

function startTimer() {
  if (id("3 Min").checked) timeRemaining = 180;
  else if (id("5 Min").checked) timeRemaining = 300;
  else if (id("Unlimited").checked) timeRemaining = 9999999;
  else timeRemaining = 600;
  id("timer").textContent = timeConversion(timeRemaining);
  timer = setInterval(function () {
    timeRemaining--;
    if (timeRemaining === 0) solveGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}

function timeConversion(time) {
  let min = Math.floor(time / 60);
  if (min < 10) min = "0" + min;
  let sec = time % 60;
  if (sec < 10) sec = "0" + sec;
  return min + ":" + sec;
}

function generateBoard(board) {
  clearPrevios();

  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    let tile = document.createElement("input");
    if (board[Math.floor(i / 9)][i - Math.floor(i / 9) * 9] != -1) {
      tile.value = board[Math.floor(i / 9)][i - Math.floor(i / 9) * 9];
      tile.disabled = true;
      tile.classList.add("fixed");
    } else {
      tile.addEventListener("click", function () {
        if (!disableSelect) {
          if (tile.classList.contains("selected")) {
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    tile.id = idCount;
    idCount++;
    tile.classList.add("tile");
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6) {
      tile.classList.add("rightBorder");
    }
    id("board").appendChild(tile);
  }
}

function updateMove() {
  if (selectedTile && selectedNum) {
    selectedTile.value = selectedNum.textContent;
    selectedTile.classList.remove("selected");
    selectedNum.classList.remove("selected");
    selectedNum = null;
    selectedTile = null;
  }
}

function endGame() {
  disableSelect = true;
  //show elements again
  id("number-container").classList.remove("hidden");
  id("difficulty").classList.remove("hidden");
  id("theme").classList.remove("hidden");
  id("time").classList.remove("hidden");
  clearInterval(timer);
}

function clearPrevios() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  if (timer) clearTimeout(timer);

  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }
  selectedNum = null;
  selectedTile = null;
}
