

import { DOM } from "./dom";
import { Player } from "./player";
import { Gameboard } from "./gameboard";
export class Game {
  constructor() {
    this.draggedShip = null;
    this.isGameStarted = false;
    this.turn = true;
    this.registeredShip = [];
    this.isHorizontal = true;
    // imported classes
    this.dom = new DOM();
    this.player = new Player("Player"); //your board
    this.computer = new Player("Computer"); //computer board;

    //board elements
    this.playerBoardElement = document.querySelector("#playerboard");
    this.computerBoardElement = document.querySelector("#computerboard");

    //Button elements
    this.startGameBtn = document.querySelector("#startGame");
    this.rotateShipBtn = document.querySelector("#rotateShipBtn");
    this.resetShip = document.querySelector("#resetShip");
    this.playAgainBtn = document.querySelector("#btn-playAgain");
    // drag and drop elements
    this.ships = document.querySelectorAll(".ship");

    // other elements
    this.winnerContainer = document.querySelector(".winner-container");
    this.winner = document.querySelector("#winner-text");
    this.turnMsg = document.querySelector("#turnMessage");
    this.draggableShips = document.querySelectorAll(".ships-content");
    this.draggableShipsContainer = document.querySelector(".draggable-ship-container");

  }
  initBoard() {
    //start game
    this.startGameBtn.addEventListener("click", () => this.startGame());
    this.rotateShipBtn.addEventListener("click", () => this.rotateShips());
    this.resetShip.addEventListener("click", (e) => this.reset());
    
    //create initial setup for player drop ship to start the game
    this.dom.createBoard(this.playerBoardElement, this.player.board);
    this.dragAndDropListener();
  }
  dragAndDropListener(){
    this.ships.forEach((ship, index) => {
      ship.dataset.shipId = `ship-${index}`;
      ship.addEventListener("dragstart", () => {
        this.draggedShip = ship;
    
      });
    });
    this.ships.forEach((ship) => {
      ship.addEventListener("dragend", () => {
        this.draggedShip = null;
      
      });
    });
    this.playerBoardElement.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    this.playerBoardElement.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log(this.player.board)
      const cell = e.target.closest(".cell");
      if (!cell) return;
      if (cell.classList.contains("ship-placed")) {
        alert("Cell occupied, place to another cell.");
        return;
      }
      if (this.draggedShip && !this.isGameStarted) {
        const row = parseInt(cell.dataset.row, 10);
        const col = parseInt(cell.dataset.col, 10);
        const length = parseInt(this.draggedShip.dataset.length, 10);
        const shipId = this.draggedShip.dataset.shipId;
        const isHorizontal = this.isHorizontal;
        const isWithinBounds = isHorizontal ? col + length <= 10 : row + length <= 10;

        if (isWithinBounds && this.player.canPlaceShip(this.playerBoardElement, row, col, length, isHorizontal)) {
          this.player.placeShip(
            this.playerBoardElement,
            row,
            col,
            length,
            shipId,
            isHorizontal
          );
        } else {
          alert("Ship placement is out of bounds!");
          return;
        }
        // Store ship details for game start
        this.registeredShip.push({ row, col, length, shipId, isHorizontal});
        

        // Enable start button only when all ships are placed
        if (this.registeredShip.length === this.ships.length) {
          this.startGameBtn.disabled = false;
          this.rotateShipBtn.remove();
          this.draggableShipsContainer.remove();
          this.resetShip.remove();
          document.querySelector(".modal h2").innerHTML = "Alrighty, let set sail!"
        }
        this.draggedShip.style.display = "none";
        this.draggedShip.parentElement.remove();
      }
    });
  }
  reset(){
    this.registeredShip = [];
    this.isHorizontal = true;
    this.player.board = new Gameboard();
    this.player.board.ships = [];
    this.player.board.missedAttacks = [];

    console.log(this.player.board)
    //remove attributs from the cells
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.classList.remove("ship-placed");
        cell.removeAttribute("data-ship-id");

        this.draggableShipsContainer.innerHTML = ""; //clear ship
        this.draggableShipsContainer.innerHTML = `
        <div class="ships-content">  
<h3>Cruisers</h3>
<div id="ship1" class="ship" draggable="true" data-length="5" data-horizontal="true">
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
</div>
</div>

<div class="ships-content"> 
<h3>Destroyer</h3>
<div id="ship2" class="ship" draggable="true" data-length="4" data-horizontal="true">
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
</div>
</div>

<div class="ships-content"> 
<h3>Frigates</h3>
<div id="ship3" class="ship" draggable="true" data-length="3" data-horizontal="true">
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
</div>
</div>
<div class="ships-content"> 
<h3>Submarines</h3>
<div id="ship4" class="ship" draggable="true" data-length="2" data-horizontal="true">
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
</div>
</div>
<div class="ships-content"> 
<h3>Submarines</h3>
<div id="ship5" class="ship" draggable="true" data-length="2" data-horizontal="true">
    <div class="ship-cell"></div>
    <div class="ship-cell"></div>
</div>
</div>
`;
    });
    this.playerBoardElement.replaceWith(this.playerBoardElement.cloneNode(true));
    this.playerBoardElement = document.querySelector("#playerboard");
    this.ships = document.querySelectorAll(".ship");
    this.dragAndDropListener();
  
  }
  startGame() {
    this.isGameStarted = true;
    this.dom.renderLoadingScreen(); //loading screen
    this.dom.main.style.display = "block";
    this.dom.modal.style.display = "none";
    this.turnMsg.textContent = "Player's Turn";

    //create board for player
    this.dom.createBoard(this.dom.ingameBoard, this.player.board);

    // transfer the registered place ship of the player to the gameboard
    this.registeredShip.forEach(({ row, col, length, shipId, isHorizontal }) => {
      this.player.placeShip(this.dom.ingameBoard, row, col, length, shipId, isHorizontal);
    });

    //create board for computer
    this.dom.createBoard(this.computerBoardElement, this.computer.board);
    // random place of computer ships --import the function from gameboard.js
    this.computer.computerPlaceShips(this.computerBoardElement);

    //click attack handler on computer board
    this.computerBoardElement.addEventListener("click", (e) => {
      if (!this.turn) return;
      const cell = e.target.closest(".cell");
      if (
        !cell ||
        cell.classList.contains("hit") ||
        cell.classList.contains("miss")
      )
        return;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);

      this.playerAttack(row, col);
    });
  }
  rotateShips(){
    this.isHorizontal = !this.isHorizontal;
    this.ships.forEach(ship => {
      ship.dataset.horizontal = this.isHorizontal;
      ship.style.flexDirection = this.isHorizontal ? "row" : "column";
    });
  }
  playerAttack(row, col) {
    if (!this.turn || !this.isGameStarted) return; // Prevent attack if it's not player's turn or game is not started

    const hitShip = this.computer.receiveAttack(row, col); // Get the ship that was hitted
  
    const computerCell = document.querySelector(
      `#computerboard .cell[data-row="${row}"][data-col="${col}"]`
    );
    const cellState = this.computer.board.board[row][col];

    if (cellState === "miss") {
        computerCell.classList.add("miss");
        computerCell.textContent = "O";
        this.turnMsg.textContent = "Computer's Turn";
        this.turn = false; // Player's turn is disabled

        // Computer attacks after a delay
        setTimeout(() => {
            this.computerAttack();
        }, 2000);
    } else if (cellState === "hit") {
        computerCell.classList.add("hit");
        computerCell.textContent = "X";
        this.turnMsg.textContent = "Player's Turn";
        this.turn = true; // Player gets another turn

        if (this.computer.board.allShipSunk()) {
          this.winnerContainer.style.display = "flex";
          this.winner.textContent = "You won! All enemy ship sunked."
          this.playAgainBtn.addEventListener("click", () => this.playAgain());
            this.isGameStarted = false;
        }

    }
   
}
playAgain(){
  window.location.reload();

}
computerAttack() {
  let row, col, playerCell;
  do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      playerCell = document.querySelector(
          `#ingameboard .cell[data-row="${row}"][data-col="${col}"]`
      );
  } while (
      playerCell.classList.contains("hit") ||
      playerCell.classList.contains("miss")
  );

  const hitShip = this.player.receiveAttack(row, col); // Get the ship that was hit
  const cellState = this.player.board.board[row][col];

  if (cellState === "miss") {
      playerCell.classList.add("miss");
      playerCell.textContent = "O";
      this.turnMsg.textContent = "Player's Turn";
      this.turn = true; // Restore player's turn after the computer attack
  } else if (cellState === "hit") {
      playerCell.classList.add("hit");
      playerCell.textContent = "X";

      if (this.player.board.allShipSunk()) {
          this.winnerContainer.style.display = "flex";
          this.winner.textContent = "Computer won! All of your ship sunked."
          this.playAgainBtn.addEventListener("click", () => this.playAgain());
          this.isGameStarted = false;
      } else {
          setTimeout(() => {
              this.computerAttack();
          }, 2000);
      }
  }
}
}
