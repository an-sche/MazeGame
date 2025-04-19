import { mazes, generateSeenArray } from './mazes.js'
import { showNextStep, isRulesStep, isGameStep, isExplainStep, goToGameStep, isScoreStep } from './state.js'

// This way the functions are available to me in the console / html
window.showNextStep = showNextStep;
window.goToGameStep = goToGameStep;

let currentMazeIndex = -1; // start at -1 because we add 1 when generating next maze
let playerPos = { x: 1, y: 1 };
let goal = { x: 8, y: 8 };
let mazeData = [];
let seen = [];

let completedMazesCount = 0;
let totalPlayerMoves = 0;
let currentMazeMoves = 0;
let hasAskedYet = false;


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
        totalPlayerMoves++;
        currentMazeMoves++;

        // When they are on maze 2, we will distract them with messages from their boss
        if (completedMazesCount == 0) {
            const distFromEnd = (goal.x - playerPos.x) + (goal.y - playerPos.y);
            if (currentMazeMoves == 10) {
                // First we just say hi!
                playerPos = { x: 1, y: 1 };
                blockUserForInput("Boss: Hey!\n\n (Type 'hi' to continue)", "hi");
            }
            else if (currentMazeMoves == 30) {
                // Message them again!
                playerPos = { x: 1, y: 1 };
                blockUserForInput("Boss: You got a sec?\n\n (type 'yes' to continue)", "yes");
            } else if (!hasAskedYet && distFromEnd == 4) {
                // We eventually get to the point right before they finish the maze...
                // This will reset their progress, very frustrating! 
                hasAskedYet = true;
                playerPos = { x: 1, y: 1 };
                seen = generateSeenArray(mazeData.length, mazeData[0].length);
                blockUserForInput("Boss: I need you to copy and paste this text into the\nprompt. Thanks, always super helpful!\n\nsuper_secret_message_fhqwhgads", "super_secret_message_fhqwhgads");
            }
        }

        // TODO: halfway through maze 4, we should alert them that they have a meeting soon!
        //       then we can start a timer, and then end the game in like 15 seconds or something
        // TODO: Try to show the timer?

        // TODO: Try to set the mazes up so that they kinda give up on the last one because the timer is going to run out
        //       before they can finish the maze

        if (playerPos.x === goal.x && playerPos.y === goal.y) {
            // we reset the game here... 
            completedMazesCount++;
            currentMazeMoves = 0;
            generateNextMaze();
            return;
        }
        drawMaze();
    }
}

function blockUserForInput(displayText, requiredInput) {
    let input = null;
    while (input !== requiredInput) {
        input = prompt(displayText);
        if (input) {
            input = input.toLocaleLowerCase();
        }
    }
}

function generateNextMaze() {
    playerPos = { x: 1, y: 1 };

    currentMazeIndex = (currentMazeIndex + 1) % mazes.length;
    mazeData = mazes[currentMazeIndex];

    // const mazeTitleEl = document.getElementById("maze-title");
    // mazeTitleEl.textContent = "Maze: " + (currentMazeIndex + 1);

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

const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
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

    if (e.key === "Enter" && (isRulesStep() || isScoreStep())) {
        const beginGameEl = document.getElementById("begin-game")
        if (beginGameEl) beginGameEl.click();
        return;
    }

    const mazeGameElement = document.getElementById("step2-game")
    if (mazeGameElement && !mazeGameElement.classList.contains("active")) {
        return;
    }
    if (arrowKeys.includes(e.key)) e.preventDefault();

    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "k": movePlayer(0, -1); break;

        case "ArrowDown":
        case "s": 
        case "j": movePlayer(0, 1); break;

        case "ArrowLeft":
        case "a":
        case "h": movePlayer(-1, 0); break;

        case "ArrowRight":
        case "d":
        case "l": movePlayer(1, 0); break;
    }
});

//#endregion