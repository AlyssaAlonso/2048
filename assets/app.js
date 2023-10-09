// Cached Elements:
const gameBoardEl = document.querySelector("#game-board");
const rowEls = gameBoardEl.children;

// State:
const newCell = [2, 4];
const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

const gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// const gameBoard = [
//   [4, 8, 32, 64],
//   [0, 4, 8, 16],
//   [0, 0, 4, 8],
//   [2, 0, 2, 4],
// ];

const previousTurn = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Event Listener:
document.addEventListener("keyup", (e) => {
  if (!arrowKeys.includes(e.code)) return;

  updatePreviousTurn();
  shiftCells(e.code);
});

// Functions:

// generateNewCell:
const generateNewCell = () => {
  // find all empty cells
  let emptyCells = [];

  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (gameBoard[rowIdx][cellIdx] === 0) {
        emptyCells.push([rowIdx, cellIdx]);
      }
    });
  });

  // pick a random empty cell
  let idx = Math.floor(Math.random() * emptyCells.length);
  let randomEmptyCell = emptyCells[idx];

  // randomly pick 2 or 4 to be the new cell's value
  gameBoard[randomEmptyCell[0]][randomEmptyCell[1]] =
    newCell[Math.round(Math.random())];
};

// updatePreviousTurn
const updatePreviousTurn = () => {
  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      previousTurn[rowIdx][cellIdx] = gameBoard[rowIdx][cellIdx];
    });
  });
};

// shiftCells
const shiftCells = (arrow) => {
  if (arrow === ArrowUp) {
  } else if (arrow === ArrowRight) {
  } else if (arrow === ArrowDown) {
  } else if (arrow === ArrowLeft) {
  } else {
    return;
  }
};

// checkGameEnd
// Win => If any cell equals 2048
// Lose => If there are no possible moves (i.e. nothing can be merged, no empty cells)

// render
const rowElsArr = Array.from(rowEls);
rowElsArr.forEach(function (row, rowIdx) {
  const cellArr = Array.from(row.children);
  cellArr.forEach(function (cell, cellIdx) {
    if (gameBoard[rowIdx][cellIdx] !== 0) {
      cell.textContent = `${gameBoard[rowIdx][cellIdx]}`;
      cell.classList.add(`_${gameBoard[rowIdx][cellIdx]}`);
    }
  });
});

// gameRestart
