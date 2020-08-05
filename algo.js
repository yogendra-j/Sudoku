let board = [
  [3, -1, -1, 2, -1, -1, -1, -1, -1],
  [2, -1, 7, -1, -1, -1, 4, 5, 8],
  [-1, -1, 4, -1, 6, -1, 7, -1, -1],
  [-1, 5, -1, -1, -1, 6, -1, 1, -1],
  [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  [1, -1, -1, -1, -1, -1, 3, -1, -1],
  [7, -1, 9, -1, -1, 5, -1, 6, -1],
  [-1, -1, -1, -1, 9, 3, 5, -1, -1],
  [-1, -1, -1, -1, 7, -1, -1, 2, -1],
];

// [
//   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//   [-1, -1, -1, -1, -1, 3, -1, 8, 5],
//   [-1, -1, 1, -1, 2, -1, -1, -1, -1],
//   [-1, -1, -1, 5, -1, 7, -1, -1, -1],
//   [-1, -1, 4, -1, -1, -1, 1, -1, -1],
//   [-1, 9, -1, -1, -1, -1, -1, -1, -1],
//   [5, -1, -1, -1, -1, -1, -1, 7, 3],
//   [-1, -1, 2, -1, 1, -1, -1, -1, -1],
//   [-1, -1, -1, -1, 4, -1, -1, -1, 9],
// ];
//solve a board
//mode can be solver or generator, in case of generator, it conts possible solutions
export const solveSudoku = (board, generator = false) => {
  //get pssible valid options for a tile
  const validOptions = (row, col) => {
    const options = [1, 1, 1, 1, 1, 1, 1, 1, 1]; //length 9

    //check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] != -1) {
        options[board[row][c] - 1] = 0;
      }
    }
    //check col
    for (let r = 0; r < 9; r++) {
      if (board[r][col] != -1) {
        options[board[r][col] - 1] = 0;
      }
    }

    //check 3 x 3 grid
    let row_start = Math.floor(row / 3) * 3;
    let col_start = Math.floor(col / 3) * 3;
    for (let r = row_start; r < row_start + 3; r++) {
      for (let c = col_start; c < col_start + 3; c++) {
        if (board[r][c] != -1) {
          options[board[r][c] - 1] = 0;
        }
      }
    }

    //turn into num array
    let nums = [];
    for (let i = 0; i < 9; i++) {
      if (options[i] === 1) {
        nums.push(i + 1);
      }
    }
    return nums;
  };

  //solve one choice tiles ie tiles with one valid choice without recusion
  const solveOneValid = () => {
    //continuesly loop and check for one choice tiles till no more change possible
    let didChange = true;
    let solved;
    while (didChange) {
      didChange = false;
      solved = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] != -1) {
            solved++;
            continue;
          }
          let nums = validOptions(r, c);
          if (nums.length === 1) {
            board[r][c] = nums[0];
            didChange = true;
          }
        }
      }
    }
    if (solved === 81) {
      numSolutions++;
      return true;
    }
  };

  //solve using backtracking
  const solveBacktrack = (row = 0, col = 0) => {
    if (row === 9) {
      numSolutions++; //conting possible solution
      return true;
    }
    if (board[row][col] != -1) {
      return solveBacktrack(
        row + (col === 8 ? 1 : 0),
        col + (col === 8 ? -8 : 1)
      );
    }

    const nums = validOptions(row, col);

    //backtreckking
    while (nums.length) {
      let i = Math.floor(Math.random() * nums.length);
      board[row][col] = nums[i];
      if (
        solveBacktrack(
          row + (col === 8 ? 1 : 0),
          col + (col === 8 ? -8 : 1)
        ) === true &&
        !generator //for countng possible solutions while generating puzzles
      ) {
        return true;
      }
      nums[i] = nums[nums.length - 1];
      nums.pop();
    }
    board[row][col] = -1;
  };
  let numSolutions = 0;
  if (solveOneValid() && generator) return numSolutions;
  solveBacktrack();
  return generator ? numSolutions : board;
};

//generate new puzzle
export const generator = (time = 20000) => {
  //empty board
  let board = [];
  for (let i = 0; i < 9; i++) {
    board.push([]);
    for (let j = 0; j < 9; j++) {
      board[board.length - 1].push(-1);
    }
  }
  //fill diagonal 3x3 squares
  let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let r = 0; r < 9; r++) {
    let x = Math.floor(r / 3) * 3;
    for (let c = x; c < x + 3; c++) {
      let i = Math.floor(Math.random() * nums.length);
      board[r][c] = nums[i];
      nums[i] = nums[nums.length - 1];
      nums.pop();
      if (nums.length === 0) {
        nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
    }
  }

  //solve to get full board

  solveSudoku(board);
  //deleting a num at a time to make puzzle for time secs
  let deleteCells = 2;
  let timeStart = Date.now();
  while (Date.now() - timeStart < time) {
    let r = [];
    let c = [];
    let temp = [];

    for (let i = 0; i < deleteCells; i++) {
      let randR = Math.floor(Math.random() * 9);
      let randC = Math.floor(Math.random() * 9);
      while (board[randR][randC] == -1) {
        randC = Math.floor(Math.random() * 9);
        randR = Math.floor(Math.random() * 9);
      }
      r.push(randR);
      c.push(randC);
      temp.push(board[r[i]][c[i]]);
      board[r[i]][c[i]] = -1;
    }
    //if not unique solution, get previous iteration back
    let checkBoard = JSON.parse(JSON.stringify(board));
    if (solveSudoku(checkBoard, true) != 1) {
      for (let i = 0; i < deleteCells; i++) {
        board[r.pop()][c.pop()] = temp.pop();
      }
    }
  }
  return board;
};

//testing
// console.log(generator());
// console.time();
// solveSudoku(board);
// console.log(board);
// console.timeEnd();
