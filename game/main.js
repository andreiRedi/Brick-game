let fps;
function calcFPS(opts) {
  let requestFrame = window.requestAnimationFrame
  if (!requestFrame) return true; // Check if "true" is returned; 
  // pick default FPS, show error, etc...
  function checker() {
    if (index--) requestFrame(checker);
    else {
      let result = count * 1000 / (performance.now() - start);
      if (typeof opts.callback === "function") opts.callback(result);
      console.log("Calculated: " + result + " frames per second");
      fps = result;
    }
  }
  if (!opts) opts = {};
  var count = opts.count || 60, index = count, start = performance.now();
  checker();
}
calcFPS()
let ballHTML = document.getElementById("circle1");
const boardHTML = document.querySelector("#game");
const platformHTML = document.getElementById("platform");
const scoreHTML = document.querySelector("#score");
const livesHTML = document.querySelector("#lives");


const showButton = document.getElementById("showDialog");
const favDialog = document.getElementById("favDialog");
const startDialog = document.getElementById("start");
const outputBox = document.querySelector("output");
const continueBtn = favDialog.querySelector("#continue");
const confirmBtn = favDialog.querySelector("#reset");

let isPaused = false;
let gameOVer = false;
let gameStarted = false;
let welcomeScreen = true;


const startGame = () => {
  window.addEventListener("load", () => {
    initialize();
    renderGame();
  });
}


const ballDirection = { dx: 0, dy: 0 };
const keys = {
  rightPressed: false,
  leftPressed: false,
  spacebarPressed: false,
};
let lives = 3;
let score = 0;
let intervalId;
let time = 0;
let timerStarted = false;
let allBricksCleared = false;

const getDimensions = () => {
  let obj = {};

  obj["ball"] = ballHTML.getBoundingClientRect();
  obj["board"] = boardHTML.getBoundingClientRect();
  obj["platform"] = platformHTML.getBoundingClientRect();

  return obj;
};

const initialize = () => {
  ballHTML.style.left = `${Math.ceil(
    platformHTML.getBoundingClientRect().left +
    platformHTML.offsetWidth / 2 -
    ballHTML.offsetWidth / 2
  )}px`;
  ballHTML.style.top = `${Math.ceil(
    platformHTML.getBoundingClientRect().top - ballHTML.offsetHeight
  )}px`;

  build();
  drawTime();
  scoreHTML.innerHTML = `Score: ${score}`;
  livesHTML.innerHTML = `Lives: ${lives}`;

  startDialog.showModal();

};

const keyDownHandler = (e) => {
  if (isPaused || gameOVer) return;

  if (e.key == "Right" || e.key == "ArrowRight") {
    keys.rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    keys.leftPressed = true;
  } else if (e.code === "Space" && !gameStarted) {
    if (startDialog.open) {
      startDialog.close()
      return;
    }


    gameStarted = true;
    keys.spacebarPressed = true;
    ballDirection.dx = -2;
    ballDirection.dy = 2;
    if (!timerStarted) {
      timerStarted = true;
      startTimer();
    }
  }

  if (keys.rightPressed) {
    drawPlatform("right");
  } else if (keys.leftPressed) {
    drawPlatform("left");
  }
};

const keyUpHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    keys.rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    keys.leftPressed = false;
  } else if (e.code === "Space") {
    keys.spacebarPressed = false;
  }
};

const drawBall = () => {
  const { ball, platform, board } = getDimensions();
  const { dx, dy } = ballDirection;
  const { x, y, right, bottom, top } = ball;

  const radius = ball.width / 2;

  if (right + dx > board.width || x + dx < 0) {
    ballDirection.dx = -dx;
  }

  if (y + dy < -radius) {
    ballDirection.dy = -dy;
  }
  if (x == platform.x && y == platform.y) {
    ballDirection.dy = -dy;
  }

  if (y + dy < 0) {
    ballDirection.dy = -dy;
  } else if (bottom + dy > platform.top) {
    if (x > platform.x && x < platform.x + platform.width) {
      if (isNaN(fps)) fps = 100
      let fpsCorrection = fps / 60
      if (x > platform.x + platform.width - platform.width / 6 * 1) {
        ballDirection.dx = 8 / fpsCorrection
        ballDirection.dy = -(2 / fpsCorrection)
      } else if (x > platform.x + platform.width - platform.width / 6 * 2) {
        ballDirection.dx = 6 / fpsCorrection
        ballDirection.dy = -(6 / fpsCorrection)
      } else if (x > platform.x + platform.width - platform.width / 6 * 3) {
        ballDirection.dx = 1 / fpsCorrection
        ballDirection.dy = -(8 / fpsCorrection)
      } else if (x > platform.x + platform.width - platform.width / 6 * 4) {
        ballDirection.dx = -(1 / fpsCorrection)
        ballDirection.dy = -(8 / fpsCorrection)
      } else if (x > platform.x + platform.width - platform.width / 6 * 5) {
        ballDirection.dx = -(6 / fpsCorrection)
        ballDirection.dy = -(6 / fpsCorrection)
      } else {
        ballDirection.dx = -(8 / fpsCorrection)
        ballDirection.dy = -(2 / fpsCorrection)
      }
    } else if (bottom + dy > board.bottom) {
      lives--;
      livesHTML.innerHTML = `Lives: ${lives}`;
      if (lives <= 0) {
        gameOVer = true;
        showFinalScore()
        stopTimer()
        return;
      } else {
        resetBall();
        gameStarted = false;
        return;
      }
    }
  }

  ballHTML.style.left = `${x + dx}px`;
  ballHTML.style.top = `${y + dy}px`;
};

const resetBall = () => {
  ballHTML.style.left = `${Math.ceil(
    platformHTML.getBoundingClientRect().left +
    platformHTML.offsetWidth / 2 -
    ballHTML.offsetWidth / 2
  )}px`;
  ballHTML.style.top = `${Math.ceil(
    platformHTML.getBoundingClientRect().top - ballHTML.offsetHeight
  )}px`;
  ballDirection.dx = 0;
  ballDirection.dy = 0;
};

const drawPlatform = () => {
  const platformRect = platformHTML.getBoundingClientRect();
  const platformLeft = platformRect.left;
  const { board, platform } = getDimensions();
  const radius = ballHTML.offsetWidth / 2;
  const platformCenter = platform.left + platform.width / 2;

  if (keys.rightPressed && platform.right <= board.right) {
    platformHTML.style.left = `${platformLeft + 8}px`;
    if (!gameStarted) {
      ballHTML.style.left = `${platformCenter - radius}px`;
    }
  } else if (keys.leftPressed && platform.left >= board.left) {
    platformHTML.style.left = `${platformLeft - 8}px`;
    if (!gameStarted) {
      ballHTML.style.left = `${platformCenter - radius}px`;
    }
  } else if (!gameStarted) {
    ballHTML.style.left = `${platformCenter - radius}px`;
  }
};

const moveBallWithPlatform = () => {
  const { ball, platform } = getDimensions();
  const radius = ball.width / 2;
  const platformCenter = platform.left + platform.width / 2;

  ballHTML.style.left = `${platformCenter - radius}px`;
  ballHTML.style.top = `${Math.ceil(
    platformHTML.getBoundingClientRect().top - ballHTML.offsetHeight
  )}px`;
};

const build = () => {
  document.querySelectorAll(".brickRow").forEach((e) => e.remove());
  let brickIndex = 0;
  for (let index = 0; index < 15; index++) {
    let element = document.createElement("div");
    element.setAttribute("id", "brickRow" + index);
    element.classList.add("brickRow");
    document.getElementById("game").appendChild(element);

    for (let index2 = 0; index2 < 3 ; index2++) {    
      let element2 = document.createElement("div");
      element2.setAttribute("id", "brick-" + brickIndex++);
      element2.classList.add("brick");  
      if (index === 0 || index === 14) {
        element2.innerHTML = "hidden";
        element.appendChild(element2);
        continue
      }
      element2.classList.add("one");
      element2.innerHTML = "1";
      if (brickIndex % 2 === 1) {
        element2.classList.add("two");
        element2.innerHTML = "2";
      }
      element.appendChild(element2);
    }
  }
};

function collisionDetection() {
  let bricks = document.getElementsByClassName("brick")
  const { ball } = getDimensions();
  const { dx, dy } = ballDirection;
  const { x, y } = ball;
  const radius = ball.width;
  let visibleBricks = 0;
  if (allBricksCleared) {
    return;
  }
  let collisioned = false;
  for (let c = 0; c < bricks.length; c++) {
    let brick = bricks[c].getBoundingClientRect()
    if ((!collisioned && x > brick.x - radius && x < brick.x && y + radius > brick.y && y < brick.y + brick.height && bricks[c].innerHTML !== "hidden" && dx > 0) ||
      (!collisioned && x < brick.x + brick.width && x + radius / 2 > brick.x + brick.width && y + radius > brick.y && y < brick.y + brick.height && bricks[c].innerHTML !== "hidden" && dx < 0)) {
      collisioned = true;
      if (bricks[c].innerHTML === "2") {
        bricks[c].innerHTML = "1"
        bricks[c].classList.remove("two")
      } else {
        bricks[c].innerHTML = "hidden"
        bricks[c].classList.remove("one")
      }
      ballDirection.dx = -dx;
      score += 100;
      scoreHTML.innerHTML = `Score: ${score}`;
    } else if (!collisioned && (x + radius / 2 > brick.x) && (x < brick.x + brick.width) && (y + radius > brick.y) && (y < brick.y + brick.height) && bricks[c].innerHTML !== "hidden") {
      collisioned = true;
      if (bricks[c].innerHTML === "2") {
        bricks[c].innerHTML = "1"
        bricks[c].classList.remove("two")
      } else {
        bricks[c].innerHTML = "hidden"
        bricks[c].classList.remove("one")
      }
      ballDirection.dy = -dy;
      score += 100;
      scoreHTML.innerHTML = `Score: ${score}`;
    }
    if (bricks[c].innerHTML !== "hidden") {
      visibleBricks++;
    }
  }
  if (visibleBricks === 0) {
    allBricksCleared = true;
    score += lives * 500
    stopTimer();
    gameOVer = true;
    showFinalScore();
  }
}

// //cheatmode
// document.addEventListener("mousemove", function (e) {
//   if (document.getElementsByClassName("circleBase circle1").length !== 0) {
//     const { ball } = getDimensions();
//     const radius = ball.width / 2;

//     ballHTML.style.left = `${e.clientX - radius}px`;
//     ballHTML.style.top = `${e.clientY - radius}px`;
//   }
// });

const drawTime = () => {
  const showtimerHTML = document.createElement("div");
  showtimerHTML.id = "timer";
  showtimerHTML.innerHTML = "00:00";
  document.body.appendChild(showtimerHTML);
}

const updateTimer = () => {
  const timerHTML = document.querySelector("#timer");
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerHTML.innerHTML = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  time++;
}

const startTimer = () => {
  intervalId = setInterval(updateTimer, 1000);
};

const stopTimer = () => {
  clearInterval(intervalId);
};

const showFinalScore = () => {
  const finalScoreHTML = document.createElement("div");
  finalScoreHTML.id = "final-score";
  finalScoreHTML.innerHTML = `Final Score: ${score - (time * 10 - 10)}<br><br>Press spacebar to start new game!`;
  document.body.appendChild(finalScoreHTML);
};

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (document.getElementById("final-score")) {
      document.getElementById("final-score").remove();
      resetGame();
      document.location.reload();
    }
  }
});

const resetGame = () => {
  initialize();
  lives = 3;
  gameStarted = false;
};
let animation;

const renderGame = () => {
  if (gameOVer) return
  drawBall();
  drawPlatform();
  collisionDetection();
  animation = window.requestAnimationFrame(() => renderGame());
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

favDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key == "Escape" || e.key == "p") {
      pauseGame();
    }
  },
  false
);

const pauseGame = () => {
  if (!gameStarted) return
  ballHTML = document.getElementById("circle1");
  isPaused = !isPaused;
  if (isPaused) {
    window.cancelAnimationFrame(animation);
    stopTimer();
    favDialog.showModal();
    ballHTML = document.getElementById("circle1");
  } else {
    startTimer();
    favDialog.close();
    renderGame();
  }
}

confirmBtn.addEventListener("click", () => {
  document.location.reload();
});

continueBtn.addEventListener("click", () => {
  isPaused = false;
  favDialog.close();
  renderGame();
});



document.querySelector("#start #continue").addEventListener("cancel", (event) => {
  welcomeScreen = false;
  renderGame();
});

startGame();
// "Confirm" button triggers "close" on dialog because of [method="dialog"]
// favDialog.addEventListener("close", () => {
//   renderGame();
// });
