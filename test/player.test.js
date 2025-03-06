import { Player } from "../src/player";
import { Gameboard } from "../src/gameboard";

jest.mock("../src/gameboard");

describe("Player", () => {
  let player;
  let mockBoard;

  beforeEach(() => {
    mockBoard = new Gameboard();
    player = new Player("Test Player");
    player.board = mockBoard;
  });

  test("should create a player with a name and a gameboard", () => {
    expect(player.name).toBe("Test Player");
    expect(player.board).toBeInstanceOf(Gameboard);
  });

  test("should check if a ship can be placed", () => {
    mockBoard.canPlaceShip.mockReturnValue(true);
    const result = player.canPlaceShip("boardElement", 0, 0, 3, true);
    expect(result).toBe(true);
    expect(mockBoard.canPlaceShip).toHaveBeenCalledWith(
      "boardElement",
      0,
      0,
      3,
      true,
    );
  });

  test("should place a ship on the board", () => {
    player.placeShip("boardElement", 0, 0, 3, "shipId", true);
    expect(mockBoard.placeShip).toHaveBeenCalledWith(
      "boardElement",
      0,
      0,
      3,
      "shipId",
      true,
    );
  });

  test("should place ships for computer", () => {
    player.computerPlaceShips("boardElement");
    expect(mockBoard.computerPlaceShips).toHaveBeenCalledWith("boardElement");
  });

  test("should receive an attack", () => {
    mockBoard.receiveAttack.mockReturnValue("hit");
    const result = player.receiveAttack(0, 0);
    expect(result).toBe("hit");
    expect(mockBoard.receiveAttack).toHaveBeenCalledWith(0, 0);
  });

  test("should log an error if board is not an instance of Gameboard", () => {
    console.error = jest.fn();
    player.board = {};
    player.computerPlaceShips("boardElement");
    expect(console.error).toHaveBeenCalledWith(
      "ERROR: board is not a Gameboard instance",
      player.board,
    );
  });
});
