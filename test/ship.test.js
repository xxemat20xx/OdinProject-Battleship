import { Ship } from "../src/ship";

test("Ship records hits correctly", () => {
  const ship = new Ship(3, "A1");
  expect(ship.recordHit()).toBe(1);
  expect(ship.recordHit()).toBe(2);
  expect(ship.recordHit()).toBe(3);
});

test("Ship sinks when hit count equals its length", () => {
  const ship = new Ship(2, "B2");
  ship.recordHit();
  ship.recordHit();
  expect(ship.isSunk()).toBe(true);
});

test("Ship does not sink before hit count equals its length", () => {
  const ship = new Ship(4, "C3");
  ship.recordHit();
  ship.recordHit();
  ship.recordHit();
  expect(ship.isSunk()).toBe(false);
});

test("Ship initializes with correct properties", () => {
  const ship = new Ship(5, "D4");
  expect(ship.length).toBe(5);
  expect(ship.id).toBe("D4");
  expect(ship.hitCounts).toBe(0);
});
