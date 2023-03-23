const board = document.querySelector(".game");
var rightPressed = false;
var leftPressed = false;

// class Platform {
//   constructor(board) {
//     this.board = board;
//   }

//   draw;
// }

// class Game {
//   constructor(game) {
//     this.game = game;
//     this.height = game.height;
//     this.width = game.width;
//     this.player = new Platform(this);
//   }

//   render() {}
// }

// const game = new Game(board);dsff
// game.style.minHeight = "100vh";
// game.style.maxWidth = "400px";
const platform = document.getElementById("platform");
platform.style.left = "60px";
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  console.log(e.key);
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  console.log(e.key);

  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

let i = 0;
function draw() {
  let left = platform.style.left;
  let number = +left.slice(0, -2);

  if (rightPressed) {
    platform.style.left = `${number + 2}px`;
  } else if (leftPressed) {
    platform.style.left = `${number - 2}px`;
  }
  i++;

  if (i >= 1000) {
    window.cancelAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
}

draw();
