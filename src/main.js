const board = document.querySelector(".game");


class Platform {
  constructor(board) {
    this.rightPressed = false;
    this.leftPressed = false;

    this.board = board;
    this.platform = document.getElementById("platform");
  }

  draw() {
    let left = this.platform.style.left;
    let number = +left.slice(0, -2);

    let boardSize = this.board.getBoundingClientRect();
    let platformSize = this.platform.getBoundingClientRect();
    
    if (this.rightPressed && platformSize.right <= boardSize.right) {
      this.platform.style.left = `${number + 5}px`;
    } else if (this.leftPressed && platformSize.left >= boardSize.left) {
      this.platform.style.left = `${number - 5}px`;
    }
  }

  keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = false;
    }
  }
}

class Game {
  constructor(board) {
    this.board = board;
    this.height = board.height;
    this.width = board.width;

    this.platform = new Platform(this);
  }

  render() {
    platform.draw();
    window.requestAnimationFrame(() => this.render());
  }
}

const game = new Game(board);
const platform = new Platform(board);

document.addEventListener("keydown", (e) => platform.keyDownHandler(e), false);
document.addEventListener("keyup", (e) => platform.keyUpHandler(e), false);

game.render();
