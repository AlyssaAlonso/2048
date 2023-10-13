// Cached Elements:
const gameBoardEl = document.querySelector("#game-board");
const rowEls = gameBoardEl.children;
const scoreEl = document.querySelector("#score");
const gameEndMessageEl = document.querySelector("#game-end-message");
const undoBtn = document.querySelector(".undo");
const restartBtn = document.querySelector(".restart");

// State:
const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
const newCell = [2, 4];
let score = 0;
let currentScore = 0;
let previousScore = 0;
let winner = false;
let loser = false;

const gameBoard = [
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

const previousBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Event Listeners:
// Checks for when the player releases a key on their keyboard
document.addEventListener("keyup", (e) => {
  // If the player presses a key that isn't one of the arrow buttons OR if the game has ended, then it'll return
  if (!arrowKeys.includes(e.code) || winner || loser) return;

  // Calls the corresponding shift function based on the player's input
  if (e.code === "ArrowUp") {
    shiftUp();
  } else if (e.code === "ArrowRight") {
    shiftRight();
  } else if (e.code === "ArrowDown") {
    shiftDown();
  } else if (e.code === "ArrowLeft") {
    shiftLeft();
  }

  // Checks whether or not any of the tiles shifted
  //   If true, then a new cell (number tile) is generated and the board is rendered
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

  // Randomly picks an empty cell on the game board
  let idx = Math.floor(Math.random() * emptyCells.length);
  let randomEmptyCell = emptyCells[idx];

  // Randomly picks 2 or 4 to be the new cell's value
  gameBoard[randomEmptyCell[0]][randomEmptyCell[1]] =
    newCell[Math.round(Math.random())];
};

const updateCurrentBoard = () => {
  currentScore = score;

  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      currentBoard[rowIdx][cellIdx] = gameBoard[rowIdx][cellIdx];
    });
  });
};

const updatepreviousBoard = () => {
  previousScore = currentScore;

  previousBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      previousBoard[rowIdx][cellIdx] = currentBoard[rowIdx][cellIdx];
    });
  });
};

const shiftUp = () => {
  gameBoard.forEach((col, colIdx) => {
    let colArr = [];

    gameBoard.forEach((row, rowIdx) => {
      colArr.push(gameBoard[rowIdx][colIdx]);
    });

    colArr = shiftCells(colArr.reverse());

    let shifted = addZeros(colArr.length);

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

    let shifted = addZeros(colArr.length);

    colArr = shifted.concat(colArr);

    gameBoard.forEach((row, rowIdx) => {
      gameBoard[rowIdx][colIdx] = colArr[rowIdx];
    });
  });
};

const shiftLeft = () => {
  gameBoard.forEach((row, rowIdx) => {
    let rowArr = shiftCells(gameBoard[rowIdx].reverse());
    rowArr = rowArr.reverse();

    let shifted = addZeros(rowArr.length);

    gameBoard[rowIdx] = rowArr.concat(shifted);
  });
};

const shiftRight = () => {
  gameBoard.forEach((row, rowIdx) => {
    let rowArr = shiftCells(gameBoard[rowIdx]);

    let shifted = addZeros(rowArr.length);

    gameBoard[rowIdx] = shifted.concat(rowArr);
  });
};

const shiftCells = (arr) => {
  arr = removeZeros(arr);

  //   Checks for possible merges
  for (i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === arr[i - 1]) {
      arr[i] *= 2;
      arr[i - 1] = 0;
      //   Adds the sum of the merged tiles to the player's score
      score += arr[i];
    }
  }

  arr = removeZeros(arr);

  return arr;
};

// Removes all empty cells from the inputed row or column to make merging easier
const removeZeros = (arr) => {
  arr = arr.filter((num) => num !== 0);
  return arr;
};

// Re-adds the empty cells
const addZeros = (length) => {
  let zerosArr = [];

  for (let i = 0; i < 4 - length; i++) {
    zerosArr.push(0);
  }

  return zerosArr;
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

const checkGameEnd = () => {
  updateCurrentBoard();

  //   Checks if the user has won
  gameBoard.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (gameBoard[rowIdx][cellIdx] === 2048) {
        winner = true;
      }
    });
  });

  //   Checks if all cells are full and there are no possible merges
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
  // Displays the game board
  const rowElsArr = Array.from(rowEls);

  rowElsArr.forEach(function (row, rowIdx) {
    const cellArr = Array.from(row.children);

    cellArr.forEach(function (cell, cellIdx) {
      cell.textContent = "";
      cell.className = "cell";

      if (gameBoard[rowIdx][cellIdx] !== 0) {
        cell.textContent = `${gameBoard[rowIdx][cellIdx]}`;
        cell.classList.add(`_${gameBoard[rowIdx][cellIdx]}`);
        cell.classList.add("animate");
      }
    });
  });

  //   Displays the player's score
  scoreEl.innerHTML = `score:<br>${score}`;

  //   Displays a message if the player has won or lost the game
  if (winner === true) {
    gameEndMessageEl.textContent = "You Win!";
  }

  if (loser === true) {
    gameEndMessageEl.textContent = "Game Over.";
  }
};

// Restores the previous turn's game board and score
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

// Resets the state variables to allow the player to restart/replay the game
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

// Adds 2 random number tiles (each either of value 2 or 4) to the game board
const gameStart = () => {
  generateNewCell();
  generateNewCell();
  render();
};

gameStart();
