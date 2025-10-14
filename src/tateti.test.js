// test-5x5.test.js
const { checkWinner, detectPlayer, bestMove } = require('./tateti');

describe('Ta-Te-Ti 5x5', () => {
  test('detecta correctamente al jugador actual', () => {
    expect(detectPlayer([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0])).toBe(1);
    expect(detectPlayer([1,2,1,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0])).toBe(2);
  });

  test('detecta ganador en una fila', () => {
    const board = [
      1, 1, 1, 1, 1,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ];
    expect(checkWinner(board)).toBe(1);
  });

  test('detecta ganador en una columna', () => {
    const board = [
      2, 0, 0, 0, 0,
      2, 0, 0, 0, 0,
      2, 0, 0, 0, 0,
      2, 0, 0, 0, 0,
      2, 0, 0, 0, 0
    ];
    expect(checkWinner(board)).toBe(2);
  });

  test('detecta ganador en diagonal ↘', () => {
    const board = [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 1, 0,
      0, 0, 0, 0, 1
    ];
    expect(checkWinner(board)).toBe(1);
  });

  test('detecta ganador en diagonal ↙', () => {
    const board = [
      0, 0, 0, 0, 2,
      0, 0, 0, 2, 0,
      0, 0, 2, 0, 0,
      0, 2, 0, 0, 0,
      2, 0, 0, 0, 0
    ];
    expect(checkWinner(board)).toBe(2);
  });

  test('la IA devuelve un movimiento válido', () => {
    const board = [
      1, 2, 1, 2, 0,
      0, 0, 2, 1, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ];
    const move = bestMove(board, 1);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(25);
    expect(board[move]).toBe(0);
  });
});
