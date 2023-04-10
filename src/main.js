const ballHTML = document.querySelector(".circle1");
const boardHTML = document.querySelector(".game");
const platformHTML = document.getElementById("platform");
// test
const ballDirection = { dx: 1, dy: -1 };
const keys = { rightPressed: false, leftPressed: false };

const getDimensions = () => {
  let obj = {};

  obj["ball"] = ballHTML.getBoundingClientRect();
  obj["board"] = boardHTML.getBoundingClientRect();
  obj["platform"] = platformHTML.getBoundingClientRect();

  return obj;
};



const initialize = () => {
  const sizes = getDimensions();
  ballHTML.style.left = `${Math.ceil(sizes.board.right / 2)}px`;
  ballHTML.style.top = `${Math.ceil(sizes.board.bottom) - 100}px`;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
};

const keyDownHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    keys.rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    keys.leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    keys.rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    keys.leftPressed = false;
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
      ballDirection.dy = -dy;
    }  else if (bottom + dy > board.bottom) {
      alert("Game over");
      window.cancelAnimationFrame(renderGame);
      return;
    }
  }

  ballHTML.style.left = `${x + dx}px`;
  ballHTML.style.top = `${y + dy}px`;
};

const drawPlatform = () => {
  let left = platformHTML.style.left;
  let number = +left.slice(0, -2);

  let { board, platform } = getDimensions();

  if (keys.rightPressed && platform.right <= board.right) {
    platformHTML.style.left = `${number + 5}px`;
  } else if (keys.leftPressed && platform.left >= board.left) {
    platformHTML.style.left = `${number - 5}px`;
  }
};

const renderGame = () => {
  drawBall();
  drawPlatform();
  window.requestAnimationFrame(() => renderGame());
};

initialize();

renderGame();
