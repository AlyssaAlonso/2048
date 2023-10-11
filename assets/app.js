// Cached Elements:
const gameBoardEl = document.querySelector("#game-board");
const rowEls = gameBoardEl.children;
const scoreEl = document.querySelector("#score");
const restartBtn = document.querySelector(".restart");
const undoBtn = document.querySelector(".undo");
const gameEndMessageEl = document.querySelector("#game-end-message");

// State:
const newCell = [2, 4];
const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
let score = 0;
let previousScore = 0;
let currentScore = 0;
let winner = false;
let loser = false;

const gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const previousBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const currentBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Event Listeners:
document.addEventListener("keyup", (e) => {
  if (!arrowKeys.includes(e.code) || winner || loser) return;

  if (e.code === "ArrowUp") {
    shiftUp();
  } else if (e.code === "ArrowRight") {
    shiftRight();
  } else if (e.code === "ArrowDown") {
    shiftDown();
  } else if (e.code === "ArrowLeft") {
    shiftLeft();
  }

  let addMoveToBoard = checkShift();

  if (addMoveToBoard === true) {
    updatepreviousBoard();
    generateNewCell();
    checkGameEnd();
    render();
  } else {
    return;
  }
});

undoBtn.onclick = (e) => {
  undoMove();
  render();
};

restartBtn.onclick = (e) => {
  gameRestart();
};

// Functions:
const findEmptyCells = () => {
  let arr = [];

  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (gameBoard[rowIdx][cellIdx] === 0) {
        arr.push([rowIdx, cellIdx]);
      }
    });
  });

  return arr;
};

const generateNewCell = () => {
  let emptyCells = findEmptyCells();

  // pick a random empty cell
  let idx = Math.floor(Math.random() * emptyCells.length);
  let randomEmptyCell = emptyCells[idx];

  // randomly pick 2 or 4 to be the new cell's value
  gameBoard[randomEmptyCell[0]][randomEmptyCell[1]] =
    newCell[Math.round(Math.random())];
};

const updatepreviousBoard = () => {
  previousScore = currentScore;

  previousBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      previousBoard[rowIdx][cellIdx] = currentBoard[rowIdx][cellIdx];
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

const checkGameEnd = () => {
  updateCurrentBoard();

  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (gameBoard[rowIdx][cellIdx] === 2048) {
        winner = true;
      }
    });
  });

  let numEmptyCells = findEmptyCells().length;

  if (numEmptyCells === 0) {
    let possibleUp;
    let possibleDown;
    let possibleLeft;
    let possibleRight;

    shiftUp();
    possibleUp = checkShift();

    if (possibleUp === false) {
      shiftDown();
      possibleDown = checkShift();
    }

    if (possibleDown === false) {
      shiftLeft();
      possibleLeft = checkShift();
    }

    if (possibleLeft === false) {
      shiftRight();
      possibleRight = checkShift();
    }

    if (possibleRight === false) {
      loser = true;
    }

    score = currentScore;

    gameBoard.forEach((row, rowIdx) => {
      row.forEach((cell, cellIdx) => {
        gameBoard[rowIdx][cellIdx] = currentBoard[rowIdx][cellIdx];
      });
    });
  }
};

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

  if (winner === true) {
    gameEndMessageEl.textContent = "You win!";
  }

  if (loser === true) {
    gameEndMessageEl.textContent = "Game Over.";
  }
};

const undoMove = () => {
  gameEndMessageEl.textContent = "";
  winner = false;
  loser = false;
  score = previousScore;
  currentScore = previousScore;
  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      gameBoard[rowIdx][cellIdx] = previousBoard[rowIdx][cellIdx];
      currentBoard[rowIdx][cellIdx] = previousBoard[rowIdx][cellIdx];
    });
  });
};

const checkShift = () => {
  let boardShift = false;

  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (currentBoard[rowIdx][cellIdx] !== gameBoard[rowIdx][cellIdx]) {
        boardShift = true;
      }
    });
  });

  return boardShift;
};

const updateCurrentBoard = () => {
  currentScore = score;

  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      currentBoard[rowIdx][cellIdx] = gameBoard[rowIdx][cellIdx];
    });
  });
};

const gameStart = () => {
  generateNewCell();
  generateNewCell();
  render();
};

const gameRestart = () => {
  gameEndMessageEl.textContent = "";
  winner = false;
  loser = false;
  score = 0;
  currentScore = 0;
  previousScore = 0;

  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      gameBoard[rowIdx][cellIdx] = 0;
      currentBoard[rowIdx][cellIdx] = 0;
      previousBoard[rowIdx][cellIdx] = 0;
    });
  });

  gameStart();
};

gameStart();
