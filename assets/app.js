// Cached Elements:
const gameBoardEl = document.querySelector("#game-board");
const rowEls = gameBoardEl.children;
const scoreEl = document.querySelector("#score");
const restartBtn = document.querySelector(".restart");
const undoBtn = document.querySelector(".undo");

// State:
const newCell = [2, 4];
const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
let score = 0;

const gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const previousTurn = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Event Listeners:
document.addEventListener("keyup", (e) => {
  if (!arrowKeys.includes(e.code)) return;

  updatePreviousTurn();

  if (e.code === "ArrowUp") {
    shiftUp();
  } else if (e.code === "ArrowRight") {
    shiftRight();
  } else if (e.code === "ArrowDown") {
    shiftDown();
  } else if (e.code === "ArrowLeft") {
    shiftLeft();
  }

  generateNewCell();
  render();
});

undoBtn.onclick = (e) => {
  undoMove();
  render();
};

// Functions:

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

const removeZeros = (arr) => {
  arr = arr.filter((num) => num !== 0);
  return arr;
};

const shiftCells = (arr) => {
  arr = removeZeros(arr);

  //   checks for possible merges
  for (i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === arr[i - 1]) {
      arr[i] *= 2;
      arr[i - 1] = 0;
      score += arr[i];
    }
  }

  arr = removeZeros(arr);

  return arr;
};

const shiftRight = () => {
  gameBoard.forEach((row, rowIdx) => {
    let rowArr = shiftCells(gameBoard[rowIdx]);
    let shifted = [];

    for (let i = 0; i < 4 - rowArr.length; i++) {
      shifted.push(0);
    }

    gameBoard[rowIdx] = shifted.concat(rowArr);
  });
};

const shiftLeft = () => {
  gameBoard.forEach((row, rowIdx) => {
    let rowArr = shiftCells(gameBoard[rowIdx].reverse());
    rowArr = rowArr.reverse();

    let shifted = [];

    for (let i = 0; i < 4 - rowArr.length; i++) {
      shifted.push(0);
    }

    gameBoard[rowIdx] = rowArr.concat(shifted);
  });
};

const shiftUp = () => {
  gameBoard.forEach((col, colIdx) => {
    let colArr = [];

    gameBoard.forEach((row, rowIdx) => {
      colArr.push(gameBoard[rowIdx][colIdx]);
    });

    colArr = shiftCells(colArr.reverse());

    let shifted = [];

    for (let i = 0; i < 4 - colArr.length; i++) {
      shifted.push(0);
    }

    colArr = shifted.concat(colArr).reverse();

    gameBoard.forEach((row, rowIdx) => {
      gameBoard[rowIdx][colIdx] = colArr[rowIdx];
    });
  });
};

const shiftDown = () => {
  gameBoard.forEach((col, colIdx) => {
    let colArr = [];

    gameBoard.forEach((row, rowIdx) => {
      colArr.push(gameBoard[rowIdx][colIdx]);
    });

    colArr = shiftCells(colArr);

    let shifted = [];

    for (let i = 0; i < 4 - colArr.length; i++) {
      shifted.push(0);
    }

    colArr = shifted.concat(colArr);

    gameBoard.forEach((row, rowIdx) => {
      gameBoard[rowIdx][colIdx] = colArr[rowIdx];
    });
  });
};

// checkGameEnd
// Win => If any cell equals 2048
// Lose => If there are no possible moves (i.e. nothing can be merged, no empty cells)

const render = () => {
  const rowElsArr = Array.from(rowEls);

  rowElsArr.forEach(function (row, rowIdx) {
    const cellArr = Array.from(row.children);

    cellArr.forEach(function (cell, cellIdx) {
      cell.textContent = "";
      cell.classList.remove(cell.classList.item(1));

      if (gameBoard[rowIdx][cellIdx] !== 0) {
        cell.textContent = `${gameBoard[rowIdx][cellIdx]}`;
        cell.classList.add(`_${gameBoard[rowIdx][cellIdx]}`);
      }
    });
  });

  scoreEl.textContent = `Score: ${score}`;
};

const undoMove = () => {
  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      gameBoard[rowIdx][cellIdx] = previousTurn[rowIdx][cellIdx];
    });
  });
};

const gameStart = () => {
  generateNewCell();
  generateNewCell();
  render();
};

gameStart();
