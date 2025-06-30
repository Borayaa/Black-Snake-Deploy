const movementAudio = new Audio("asset/audio/movement.wav");
const scoreAudio = new Audio("asset/audio/score.wav");
const deathAudio = new Audio("asset/audio/death.flac");
document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.querySelector(".keybind");
  const closeButton = document.querySelector(".keybind button");

  // "Close" button closes the dialog
  closeButton.addEventListener("click", () => {
    startGame();
    dialog.close();
  });

  const startDialog = document.querySelector("dialog#start");
  const startButton = document.querySelector("button#start");
  startButton.addEventListener("click", () => {
    startGame();
    startDialog.close();
  });

  let vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );
  let vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );

  let aspectRatio;
  let isMobile;
  if (vh > vw) {
    aspectRatio = [9, 16];
    isMobile = true;
    dialog.close();
    startDialog.show();
  } else {
    aspectRatio = [16, 9];
    isMobile = false;
  }
  const width = aspectRatio[0] * 3;
  const height = aspectRatio[1] * 3;
  const squareAmount = width * height;

  const grid = document.querySelector(".grid");
  for (let i = 0; i < squareAmount; i++) {
    grid.innerHTML += "<div></div>";
  }

  const squares = document.querySelectorAll(".grid div");
  squares.forEach((square) => {
    square.style.setProperty("width", "calc(100% / " + width + ")");
    square.style.setProperty("height", "calc(100% / " + height + ")");
  });

  const scoreDisplay = document.querySelectorAll("#score");
  const highScoreDisplay = document.querySelectorAll("#highScore");

  let currentIndex = 0; //so first div in our grid
  let appleIndex = 0; //so first div in our grid
  let currentSnake = [2, 1, 0];
  let direction = 1;
  let newDirection = [1];
  let score = 0;
  let highScore = 0;
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;

  //to start, and restart the game
  function startGame() {
    dialog.close();
    startDialog.close();
    document.activeElement.blur();
    currentSnake.forEach((index) => squares[index].classList.remove("snake"));
    squares[currentSnake[0]].classList.remove("head");
    squares[appleIndex].classList.remove("apple");
    clearInterval(interval);
    score = 0;
    scoreDisplay.forEach((scoreDisplayer) => {
      scoreDisplayer.textContent = score;
    });
    randomApple();
    direction = 1;
    newDirection = [1];
    console.log(newDirection);
    scoreDisplay.innerText = score;
    intervalTime = 100;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach((index) => squares[index].classList.add("snake"));
    interval = setInterval(moveOutcomes, intervalTime);
  }

  function gameOver() {
    if (score > highScore) {
      highScore = score;
      highScore.textContent = highScore;
      highScoreDisplay.forEach((highScoreDisplayer) => {
        highScoreDisplayer.textContent = highScore;
      });
    }

    startDialog.show();
    return clearInterval(interval); //this will clear the interval if any of the above happen
  }

  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {
    //deals with snake hitting border and snake hitting self
    if (
      (currentSnake[0] + width >= width * height && direction === width) || //if snake hits bottom
      (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || //if snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) || //if snake hits the top
      squares[currentSnake[0] + direction].classList.contains("snake") //if snake goes into itself
    ) {
      deathAudio.play();
      return gameOver();
    }

    const tail = currentSnake.pop(); //removes last ite of the array and shows it
    squares[tail].classList.remove("snake"); //removes class of snake from the TAIL
    currentSnake.unshift(currentSnake[0] + direction); //gives direction to the head of the array
    // movementAudio.play();

    if (newDirection[0] != null) {
      direction = newDirection.shift();
      console.log(newDirection);
    }

    //deals with snake getting apple
    if (squares[currentSnake[0]].classList.contains("apple")) {
      squares[currentSnake[0]].classList.remove("apple");
      squares[tail].classList.add("snake");
      currentSnake.push(tail);
      randomApple();
      score++;
      scoreAudio.play();
      scoreDisplay.forEach((scoreDisplayer) => {
        scoreDisplayer.textContent = score;
      });
      clearInterval(interval);
      intervalTime = intervalTime * speed;
      interval = setInterval(moveOutcomes, intervalTime);
    }

    squares[currentSnake[0]].classList.add("snake");
    squares[currentSnake[0]].classList.add("head");
    squares[currentSnake[1]].classList.remove("head");
  }

  //generate new apple once apple is eaten
  function randomApple() {
    do {
      if (isMobile) {
        appleIndex = Math.floor(Math.random() * (squares.length - 3 * width));
      } else {
        appleIndex = Math.floor(Math.random() * squares.length);
      }
    } while (squares[appleIndex].classList.contains("snake")); //making sure apples dont appear on the snake
    squares[appleIndex].classList.add("apple");
  }

  function playerInput(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if event already handled
    }

    // input buffer
    if (newDirection.length >= 3) {
      newDirection.shift();
    }

    if (event.code) {
      event = event.code;
    }

    // Player movement control
    switch (event) {
      case "KeyW":
      case "ArrowUp":
        // Handle "forward"
        newDirection.push(-width);
        break;

      case "KeyS":
      case "ArrowDown":
        // Handle "back"
        newDirection.push(width);
        break;

      case "KeyA":
      case "ArrowLeft":
        // Handle "turn left"
        newDirection.push(-1);
        break;

      case "KeyD":
      case "ArrowRight":
        // Handle "turn right"
        newDirection.push(1);
        break;
    }

    // Restart game
    switch (event) {
      case "Enter":
        startGame();
        break;
    }

    // Does not allow a reverse or the same direction
    if (newDirection[newDirection.length - 1] != null) {
      if (Math.abs(newDirection[0]) == Math.abs(direction)) {
        newDirection.shift();
      }
      if (newDirection.length > 1) {
        if (
          Math.abs(newDirection[0]) == Math.abs(newDirection[1]) ||
          Math.abs(newDirection[1]) == Math.abs(newDirection[2])
        ) {
          newDirection.shift();
        }
      }
    }
    console.log("player input registered");
    console.log(event);
  }

  // user input function
  window.addEventListener("keydown", playerInput);
  document.getElementById("arrow-up").addEventListener("click", function () {
    playerInput("ArrowUp");
  });
  document.getElementById("arrow-down").addEventListener("click", function () {
    playerInput("ArrowDown");
  });
  document.getElementById("arrow-left").addEventListener("click", function () {
    playerInput("ArrowLeft");
  });
  document.getElementById("arrow-right").addEventListener("click", function () {
    playerInput("ArrowRight");
  });
});
