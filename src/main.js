const ballHTML = document.querySelector(".circle1");
const boardHTML = document.querySelector(".game");
const platformHTML = document.getElementById("platform");

window.addEventListener('load', () => {
  initialize();
});

const ballDirection = { dx: 2, dy: -2 };
const keys = { rightPressed: false, leftPressed: false };
let lives = 3;

const getDimensions = () => {
  let obj = {};

  obj["ball"] = ballHTML.getBoundingClientRect();
  obj["board"] = boardHTML.getBoundingClientRect();
  obj["platform"] = platformHTML.getBoundingClientRect();

  return obj;
};



const initialize = () => {
  const sizes = getDimensions();

  ballHTML.style.left = `${Math.ceil(platformHTML.getBoundingClientRect().left + platformHTML.offsetWidth / 2 - ballHTML.offsetWidth / 2)}px`;
  ballHTML.style.top = `${Math.ceil(platformHTML.getBoundingClientRect().top - ballHTML.offsetHeight)}px`;

  // ballHTML.style.left = `${Math.ceil(sizes.board.right / 2)}px`;
  // ballHTML.style.top = `${Math.ceil(sizes.board.bottom) - 100}px`;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  build();
};

const keyDownHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    keys.rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    keys.leftPressed = true;
  } else if (e.key == "Escape") {
    alert("Escape")
    window.cancelAnimationFrame(renderGame);
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
    } else if (bottom + dy > board.bottom) {
      lives--;
      if (lives <= 0) {
        alert("Game over");
        window.cancelAnimationFrame(renderGame);
        resetGame();
        document.location.reload();
        return;
      } else {
        alert("You lost a life. You have " + lives + " lives left.");
        resetBall();
        return;
      }
    }
  }

  ballHTML.style.left = `${x + dx}px`;
  ballHTML.style.top = `${y + dy}px`;
};

const resetBall = () => {

  ballHTML.style.left = `${Math.ceil(platformHTML.getBoundingClientRect().left + platformHTML.offsetWidth / 2 - ballHTML.offsetWidth / 2)}px`;
  ballHTML.style.top = `${Math.ceil(platformHTML.getBoundingClientRect().top - ballHTML.offsetHeight)}px`;

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

const build = () => {
  document.querySelectorAll('.brickRow').forEach(e => e.remove());
  let brickIndex = 0
  for (let index = 0; index < 9; index++) {
    let element = document.createElement('div')
    element.setAttribute("id", "brickRow" + index)
    element.classList.add('brickRow');
    document.getElementById("game").appendChild(element)
    for (let index2 = 0; index2 < 4; index2++) {
      let element2 = document.createElement('div')
      element2.setAttribute("id", "brick-" + brickIndex++)
      element2.classList.add('brick');
      element2.innerHTML = "visible"
      element.appendChild(element2)
    }
  }
}

function collisionDetection() {
  let bricks = document.getElementsByClassName("brick")
  const { ball } = getDimensions();
  const { dy } = ballDirection;
  const { x, y } = ball;
  let visibleBricks = 0;
  for (let c = 0; c < bricks.length; c++) {
    let brick = bricks[c].getBoundingClientRect()
    if (x > brick.x && x < brick.x + brick.width && y > brick.y && y < brick.y + brick.height && bricks[c].innerHTML === "visible") {
      bricks[c].innerHTML = "hidden"
      bricks[c].style.opacity = "0"
      ballDirection.dy = -dy;
      visibleBricks++;
    }
    if (bricks[c].innerHTML === "visible") {
      visibleBricks++;
    }
  }
  if (visibleBricks === 0) {
    alert("You Win!");
    resetGame()
  }
}

const resetGame = () => {
  // ballHTML.style.left = `${Math.ceil(sizes.board.right / 2)}px`;
  // ballHTML.style.top = `${Math.ceil(sizes.board.bottom) - 100}px`;
  initialize();
  ballDirection.dx = 2;
  ballDirection.dy = -2;
  //build();
  // keys.rightPressed = false;
  // keys.leftPressed = false;
};

const renderGame = () => {
  drawBall();
  drawPlatform();
  collisionDetection()

  window.requestAnimationFrame(() => renderGame());
};

initialize();
// build();
renderGame();
