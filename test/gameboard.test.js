import { Gameboard } from "../src/gameboard";
import { Ship } from "../src/ship";

describe("Gameboard", () => {
  let gameboard;
  let boardElement;

  beforeEach(() => {
    gameboard = new Gameboard();
    boardElement = document.createElement("div");
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", i);
        cell.setAttribute("data-col", j);
        boardElement.appendChild(cell);
      }
    }
  });

  test("should create a 10x10 grid", () => {
    expect(gameboard.board.length).toBe(10);
    expect(gameboard.board[0].length).toBe(10);
  });

  test("should place a ship horizontally", () => {
    gameboard.placeShip(boardElement, 0, 0, 3, "ship-1", true);
    expect(gameboard.board[0][0]).toBeInstanceOf(Ship);
    expect(gameboard.board[0][1]).toBeInstanceOf(Ship);
    expect(gameboard.board[0][2]).toBeInstanceOf(Ship);
  });

  test("should place a ship vertically", () => {
    gameboard.placeShip(boardElement, 0, 0, 3, "ship-1", false);
    expect(gameboard.board[0][0]).toBeInstanceOf(Ship);
    expect(gameboard.board[1][0]).toBeInstanceOf(Ship);
    expect(gameboard.board[2][0]).toBeInstanceOf(Ship);
  });

  test("should not place a ship if it overlaps", () => {
    gameboard.placeShip(boardElement, 0, 0, 3, "ship-1", true);
    expect(gameboard.canPlaceShip(boardElement, 0, 1, 3, true)).toBe(false);
  });

  test("should receive an attack and record a miss", () => {
    gameboard.receiveAttack(0, 0);
    expect(gameboard.board[0][0]).toBe("miss");
    expect(gameboard.missedAttacks).toContainEqual([0, 0]);
  });

  test("should receive an attack and record a hit", () => {
    gameboard.placeShip(boardElement, 0, 0, 3, "ship-1", true);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.board[0][0]).toBe("hit");
  });

  test("should sink a ship when all its parts are hit", () => {
    gameboard.placeShip(boardElement, 0, 0, 2, "ship-1", true);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    expect(gameboard.ships.length).toBe(0);
  });

  test("should report all ships sunk", () => {
    gameboard.placeShip(boardElement, 0, 0, 2, "ship-1", true);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    expect(gameboard.allShipSunk()).toBe(true);
  });
});
