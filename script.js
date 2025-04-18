import { mazes, generateSeenArray } from './mazes.js'
import { showNextStep } from './state.js'

// This way the functions are available to me in the console / html
window.showNextStep = showNextStep;

let currentMazeIndex = -1; // start at -1 because we add 1 when generating next maze
let playerPos = { x: 1, y: 1 };
let goal = { x: 8, y: 8 };
let mazeData = [];
let seen = [];
let completedMazesCount = 0;
const mazeEl = document.getElementById("maze");

generateNextMaze();

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
            completedMazesCount++;
            generateNextMaze();
            return;
        }
        drawMaze();
    }
}


function generateNextMaze() {
    playerPos = { x: 1, y: 1 };

    currentMazeIndex = (currentMazeIndex + 1) % mazes.length;
    mazeData = mazes[currentMazeIndex];

    const mazeTitleEl = document.getElementById("maze-title");
    mazeTitleEl.textContent = "Maze: " + (currentMazeIndex + 1);

    const completedMazesEl = document.getElementById("completed-count");
    completedMazesEl.textContent = "Completed: " + completedMazesCount;

    const height = mazeData.length;
    const width = mazeData[0].length;

    const mazeElement = document.getElementById("maze");
    mazeElement.style.gridTemplateColumns = `repeat(${width}, 20px)`;
    mazeElement.style.gridTemplateRows = `repeat(${height}, 20px)`;

    goal = { x: width - 2, y: height - 2 };
    seen = generateSeenArray(width, height);
    drawMaze();
}


//#region Controls

const dirMap = {
  up:    [0, -1],
  down:  [0, 1],
  left:  [-1, 0],
  right: [1, 0],
};

document.querySelectorAll("#dpad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    const [dx, dy] = dirMap[dir];
    movePlayer(dx, dy);
  });
});

document.addEventListener("keydown", (e) => {

    const mazeGameElement = document.getElementById("step2-game")
    if (mazeGameElement && !mazeGameElement.classList.contains("active")) {
        return;
    }
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

//#endregion