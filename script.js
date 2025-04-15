
const maze1 = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,0,1,0,1,0,1,0,1],
  [1,0,0,1,0,1,0,1,0,1],
  [1,0,1,1,0,0,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

const maze2 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,0,1,0,1,0,1],
  [1,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
  [1,0,0,1,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,1,0,1,1,0,1,1,1,0,1,0,1],
  [1,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,0,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

let seen = generateSeenArray(10, 10);
let playerPos = { x: 1, y: 1 };
let goal = { x: 8, y: 8 };

let mazeData = maze1;

const mazeEl = document.getElementById("maze");

function drawMaze() {
  mazeEl.innerHTML = "";
  for (let y = 0; y < mazeData.length; y++) {
    for (let x = 0; x < mazeData[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (mazeData[y][x] === 1 && seen[y][x] === 1) cell.classList.add("wall");
      else if (goal.x === x && goal.y === y) cell.classList.add("goal");
      if (playerPos.x === x && playerPos.y === y) cell.classList.add("player");
      mazeEl.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy) {
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;
  if (mazeData[newY][newX] === 0) {
    for (let y = newY - 1; y <= newY + 1; y++) {
        for (let x = newX - 1; x <= newX + 1; x++) {
            seen[y][x] = 1;
        }
    }
    playerPos = { x: newX, y: newY };

    if (playerPos.x === goal.x && playerPos.y === goal.y) {
        // we reset the game here... 
        setupMazeData(2);
        return;
    }
    drawMaze();
  }
}

function generateSeenArray(width, height) {
  let result = [];
  for (let y = 0; y < height; y++) {
    result[y] = [];
    for (let x = 0; x < width; x++) {
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1 || (x < 3 && y < 3)) {
            result[y][x] = 1;
        } else {
            result[y][x] = 0;
        }
    }
  }
  return result;
}

function setupMazeData(mazeIndex) {
    playerPos = { x: 1, y: 1};

    if (mazeIndex === 1) {
        mazeData = maze1;
    } else {
        mazeData = maze2;
    }

    const height = mazeData.length;
    const width = mazeData[0].length;

    const mazeElement = document.getElementById("maze");
    mazeElement.style.gridTemplateColumns = `repeat(${width}, 40px)`;
    mazeElement.style.gridTemplateRows = `repeat(${height}, 40px)`;

    goal = { x: width - 2, y: height - 2 };
    seen = generateSeenArray(width, height);
    drawMaze();
}

document.addEventListener("keydown", (e) => {

  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (keys.includes(e.key)) e.preventDefault();

  switch (e.key) {
    case "ArrowUp": 
    case "w": movePlayer(0, -1); break;

    case "ArrowDown": 
    case "s": movePlayer(0, 1); break;

    case "ArrowLeft": 
    case "a": movePlayer(-1, 0); break;

    case "ArrowRight": 
    case "d": movePlayer(1, 0); break;
  }
});

setupMazeData(2);
