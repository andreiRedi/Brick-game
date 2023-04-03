class Ball {
  constructor(board, platform) {
    this.board = board.dimension();
    this.ball = document.querySelector(".circle1");

    this.platform = platform;
    this.ball.style.left = `${Math.ceil(this.board.right / 2)}px`;
    this.ball.style.top = `${Math.ceil(this.board.bottom) - 100}px`;

    this.dx = 0.5;
    this.dy = -0.5;
  }

  draw() {
    const { style } = this.ball;
    let { x, y } = this.dimension();
    let platform = this.platform.dimension();
    let radius = this.dimension().width / 2;

    if (x + this.dx > this.board.width - radius || x + this.dx < 0) {
      this.dx = -this.dx;
    }
    console.log(x, platform.x, platform.width);
    if (y + this.dy < radius) {
      this.dy = -this.dy;
    }
    if (x == platform.x && y == platform.y) {
      this.dy = -this.dy;
    }
    if (y + this.dy < radius) {
      this.dy = -this.dy;
    } else if (y + this.dy > this.board.height) {
      if (x > platform.x && x < platform.x + platform.width) {
        this.dy = -this.dy;
      } else {
        alert("Game over");
        window.cancelAnimationFrame();
      }
    }

    style.left = `${x + this.dx}px`;
    style.top = `${y + this.dy}px`;
  }

  dimension() {
    return this.ball.getBoundingClientRect();
  }
}

class Platform {
  constructor(board) {
    this.rightPressed = false;
    this.leftPressed = false;

    this.board = board;
    this.platform = document.getElementById("platform");

    document.addEventListener("keydown", (e) => this.keyDownHandler(e), false);
    document.addEventListener("keyup", (e) => this.keyUpHandler(e), false);
  }

  draw() {
    let left = this.platform.style.left;
    let number = +left.slice(0, -2);

    let boardSize = this.board.dimension();
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

  dimension() {
    return this.platform.getBoundingClientRect();
  }
}

class Game {
  constructor(platform) {
    this.board = document.querySelector(".game");
    this.height = this.board.height;
    this.width = this.board.width;

    this.platform = new Platform(this);
    this.ball = new Ball(this, this.platform);
  }

  render() {
    this.ball.draw();
    this.platform.draw();

    window.requestAnimationFrame(() => this.render());
  }

  dimension() {
    return this.board.getBoundingClientRect();
  }
}

const game = new Game();

game.render();
