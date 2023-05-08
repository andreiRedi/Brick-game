let ballHTML = document.querySelector(".circle1");
const boardHTML = document.querySelector(".game");
const platformHTML = document.getElementById("platform");

const showButton = document.getElementById("showDialog");
const favDialog = document.getElementById("favDialog");
const outputBox = document.querySelector("output");
const selectEl = favDialog.querySelector("cancel");
const confirmBtn = favDialog.querySelector("#reset");

let isPaused = false;

window.addEventListener("load", () => {
  initialize();
});

const ballDirection = { dx: 0, dy: 0 };
const keys = {
  rightPressed: false,
  leftPressed: false,
  spacebarPressed: false,
};
let lives = 3;
let gameStarted = false;
let score = 0;
let time = 0;
let timerStarted = false;

const getDimensions = () => {
  let obj = {};

  obj["ball"] = ballHTML.getBoundingClientRect();
  obj["board"] = boardHTML.getBoundingClientRect();
  obj["platform"] = platformHTML.getBoundingClientRect();

  return obj;
};

const initialize = () => {
  const sizes = getDimensions();

  ballHTML.style.left = `${Math.ceil(
    platformHTML.getBoundingClientRect().left +
    platformHTML.offsetWidth / 2 -
    ballHTML.offsetWidth / 2
  )}px`;
  ballHTML.style.top = `${Math.ceil(
    platformHTML.getBoundingClientRect().top - ballHTML.offsetHeight
  )}px`;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  build();
  drawScore()
  drawLives()

  // "Show the dialog" button opens the <dialog> modally
  // showButton.addEventListener("click", () => {
  //   favDialog.showModal();
  // });
};

const keyDownHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    keys.rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    keys.leftPressed = true;
  } else if (e.code === "Space" && !gameStarted) {
    gameStarted = true;
    keys.spacebarPressed = true;
    ballDirection.dx = -2;
    ballDirection.dy = 2;
    if (!timerStarted) {
      timerStarted = true;
      setInterval(updateTimer, 1000);
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
      if (x > platform.x + platform.width - platform.width / 6 * 1) {
        ballDirection.dx = 4
        ballDirection.dy = -1
      } else if (x > platform.x + platform.width - platform.width / 6 * 2) {
        ballDirection.dx = 2.5
        ballDirection.dy = -1.5
      } else if (x > platform.x + platform.width - platform.width / 6 * 3) {
        ballDirection.dx = 1
        ballDirection.dy = -3
      } else if (x > platform.x + platform.width - platform.width / 6 * 4) {
        ballDirection.dx = -1
        ballDirection.dy = -3
      } else if (x > platform.x + platform.width - platform.width / 6 * 5) {
        ballDirection.dx = -2.5
        ballDirection.dy = -1.5
      } else {
        ballDirection.dx = -4
        ballDirection.dy = -1
      }
      //ballDirection.dy = -dy;
    } else if (bottom + dy > board.bottom) {
      lives--;
      drawLives();
      if (lives <= 0) {
        // alert("Game over");
        window.cancelAnimationFrame(renderGame);
        resetGame();
        document.location.reload();
        return;
      } else {
        // alert("You lost a life. You have " + lives + " lives left.");
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

/* const drawPlatform = () => {
  const platformRect = platformHTML.getBoundingClientRect();
  const platformWidth = platformHTML.offsetWidth;
  const platformCenter = platformRect.left + platformWidth / 2;

  const { board, platform } = getDimensions();
  const radius = ballHTML.offsetWidth / 2;

  if (keys.rightPressed && platform.right <= board.right) {
    platformHTML.style.left = `${platformRect.left + 5}px`;
    if (!gameStarted) {
      ballHTML.style.left = `${platformCenter - radius}px`;
    }
  } else if (keys.leftPressed && platform.left >= board.left) {
    platformHTML.style.left = `${platformRect.left - 5}px`;
    if (!gameStarted) {
      ballHTML.style.left = `${platformCenter - radius}px`;
    }
  } else if (!gameStarted) {
    ballHTML.style.left = `${platformCenter - radius}px`;
  }
}; */


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
    for (let index2 = 0; index2 < 6; index2++) {
      let element2 = document.createElement("div");
      element2.setAttribute("id", "brick-" + brickIndex++);
      element2.classList.add("brick");
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
  let visibleBricks = 0;
  for (let c = 0; c < bricks.length; c++) {
    let brick = bricks[c].getBoundingClientRect()
    if ((x > brick.x - 20 && x < brick.x && y + 40 > brick.y && y < brick.y + brick.height && bricks[c].innerHTML !== "hidden" && dx > 0) ||
      (x < brick.x + brick.width && x + 15 > brick.x + brick.width && y + 40 > brick.y && y < brick.y + brick.height && bricks[c].innerHTML !== "hidden" && dx < 0)) {
      if (bricks[c].innerHTML === "2") {
        bricks[c].innerHTML = "1"
        bricks[c].classList.remove("two")
      } else {
        bricks[c].innerHTML = "hidden"
        bricks[c].classList.remove("one")
      }
      ballDirection.dx = -dx;
      score += 100;
      drawScore();
    } else if ((x > brick.x || x - 20 > brick.x) && (x < brick.x + brick.width || x + 40 < brick.x + brick.width) && (y > brick.y || y + 40 > brick.y) && (y < brick.y + brick.height || y + 40 < brick.y + brick.height) && bricks[c].innerHTML !== "hidden") {
      if (bricks[c].innerHTML === "2") {
        bricks[c].innerHTML = "1"
        bricks[c].classList.remove("two")
      } else {
        bricks[c].innerHTML = "hidden"
        bricks[c].classList.remove("one")
      }
      ballDirection.dy = -dy;
      score += 100;
      drawScore();
    }
    if (bricks[c].innerHTML !== "hidden") {
      visibleBricks++;
    }
  }
  if (visibleBricks === 0) {
    score += lives * 500
    alert("You Win!");
    resetGame()
    document.location.reload();
  }
}

//cheatmode
/* document.addEventListener('mousemove', function (e) {
  if (document.getElementsByClassName('circleBase circle1').length !== 0) {
    const { ball } = getDimensions();
    const radius = ball.width / 2;

    ballHTML.style.left = `${e.clientX - radius}px`;
    ballHTML.style.top = `${e.clientY - radius}px`;
  }
}) */

const drawScore = () => {
  const scoreHTML = document.querySelector("#score");
  scoreHTML.innerHTML = `Score: ${score}`;
}

const drawLives = () => {
  const scoreHTML = document.querySelector("#lives");
  scoreHTML.innerHTML = `Lives: ${lives}`;
}

const updateTimer = () => {
  const timerHTML = document.querySelector("#timer");
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerHTML.innerHTML = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  time++;
}

const resetGame = () => {
  initialize();
  lives = 3;
  gameStarted = false;
};

let animation;
const renderGame = () => {
  drawBall();
  drawPlatform();
  collisionDetection();
  animation = window.requestAnimationFrame(() => renderGame());
};

// setInterval(updateTimer, 1000);
initialize();
renderGame();

document.addEventListener(
  "keydown",
  (e) => {
    ballHTML = document.querySelector(".circle1");

    if (e.key == "p") {
      window.cancelAnimationFrame(animation);

      isPaused = !isPaused;
      if (isPaused) {
        favDialog.showModal();
        ballHTML = document.querySelector(".circle1");
        console.log(ballHTML.getBoundingClientRect(), ballDirection);
      } else {
        console.log(ballHTML.getBoundingClientRect(), ballDirection);
        favDialog.close();
        renderGame();
      }
    }
  },
  false
);

confirmBtn.addEventListener("click", () => {
  document.location.reload();
});

// "Confirm" button triggers "close" on dialog because of [method="dialog"]
// favDialog.addEventListener("close", () => {
//   renderGame();
// });
