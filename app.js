document.addEventListener('DOMContentLoaded', () => {

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog button");

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});


  const squares = document.querySelectorAll('.grid div')
  const scoreDisplay = document.querySelector('span')
  const startBtn = document.querySelector('.start')

  const width = 48
  const height = 27
  let currentIndex = 0 //so first div in our grid
  let appleIndex = 0 //so first div in our grid
  let currentSnake = [100,99,98] 
  let direction = 1
  let newDirection = [1]
  newDirection.length = 2
  let score = 0
  let speed = 0.9
  let intervalTime = 0
  let interval = 0

  //to start, and restart the game
  function startGame() {
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[appleIndex].classList.remove('apple')
    clearInterval(interval)
    score = 0
    randomApple()
    direction = 1
    newDirection = [1]
    console.log(newDirection)
    scoreDisplay.innerText = score
    intervalTime = 100
    currentSnake = [100,99,88]
    currentIndex = 0
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    interval = setInterval(moveOutcomes, intervalTime)
  }


  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {

    //deals with snake hitting border and snake hitting self
    if (
      (currentSnake[0] + width >= (width * height) && direction === width ) || //if snake hits bottom
      (currentSnake[0] % width === width -1 && direction === 1) || //if snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || //if snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) ||  //if snake hits the top
      squares[currentSnake[0] + direction].classList.contains('snake') //if snake goes into itself
    ) {
      return clearInterval(interval) //this will clear the interval if any of the above happen
    }

    const tail = currentSnake.pop() //removes last ite of the array and shows it
    squares[tail].classList.remove('snake')  //removes class of snake from the TAIL
    currentSnake.unshift(currentSnake[0] + direction) //gives direction to the head of the array

    // Does not allow a reverse or the same direction
    if (newDirection[0] != null) {

      if (Math.abs(newDirection[0]) !== Math.abs(direction)) { 
        direction = newDirection.shift();
        console.log(newDirection)
      } else {
        newDirection.shift()
      }
    }

    //deals with snake getting apple
    if(squares[currentSnake[0]].classList.contains('apple')) {
      squares[currentSnake[0]].classList.remove('apple')
      squares[tail].classList.add('snake')
      currentSnake.push(tail)
      randomApple()
      score++
      scoreDisplay.textContent = score
      clearInterval(interval)
      intervalTime = intervalTime * speed
      interval = setInterval(moveOutcomes, intervalTime)
    }
    squares[currentSnake[0]].classList.add('snake')
  }


  //generate new apple once apple is eaten
  function randomApple() {
    do{
      appleIndex = Math.floor(Math.random() * squares.length)
    } while(squares[appleIndex].classList.contains('snake')) //making sure apples dont appear on the snake
    squares[appleIndex].classList.add('apple')
  }
  
  function playerInput (event) {
      if (event.defaultPrevented) {
        return; // Do nothing if event already handled
      }
      
      // Player movement control
      switch (event.code) {

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
      switch (event.code) {
        case "Enter":
          startGame();
          break;
      }
      console.log(newDirection)
  }
  
  // user input function
  if (newDirection.length <= 2) {
    window.addEventListener("keydown", playerInput)
  } 
  startBtn.addEventListener('click', startGame)
})
