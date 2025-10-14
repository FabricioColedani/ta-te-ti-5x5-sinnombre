// ===============================
// 🎮 Ta-Te-Ti 5x5 (4 en raya) con IA fuerte
// Compatible con Vercel (sin app.listen)
// ===============================

const express = require('express');
const app = express();
app.use(express.json());

// ===============================
// 🔹 Configuración general
// ===============================
const SIZE = 5;
const WIN_LEN = 4; // 🔥 Gana con 4 en línea

function cell(board, r, c) {
  return board[r * SIZE + c];
}

// ===============================
// 🔹 Detección de ganador
// ===============================
function checkWinner(board) {
  // Filas
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c <= SIZE - WIN_LEN; c++) {
      const first = cell(board, r, c);
      if (
        first &&
        Array.from({ length: WIN_LEN }, (_, k) => cell(board, r, c + k)).every(
          (v) => v === first
        )
      )
        return first;
    }
  }
  // Columnas
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r <= SIZE - WIN_LEN; r++) {
      const first = cell(board, r, c);
      if (
        first &&
        Array.from({ length: WIN_LEN }, (_, k) => cell(board, r + k, c)).every(
          (v) => v === first
        )
      )
        return first;
    }
  }
  // Diagonales ↘
  for (let r = 0; r <= SIZE - WIN_LEN; r++) {
    for (let c = 0; c <= SIZE - WIN_LEN; c++) {
      const first = cell(board, r, c);
      if (
        first &&
        Array.from({ length: WIN_LEN }, (_, k) => cell(board, r + k, c + k)).every(
          (v) => v === first
        )
      )
        return first;
    }
  }
  // Diagonales ↙
  for (let r = 0; r <= SIZE - WIN_LEN; r++) {
    for (let c = WIN_LEN - 1; c < SIZE; c++) {
      const first = cell(board, r, c);
      if (
        first &&
        Array.from({ length: WIN_LEN }, (_, k) => cell(board, r + k, c - k)).every(
          (v) => v === first
        )
      )
        return first;
    }
  }
  // Empate o sin ganador
  return board.includes(0) ? null : 0;
}

// ===============================
// 🔹 Detección de jugador actual
// ===============================
function detectPlayer(board) {
  const x = board.filter((v) => v === 1).length;
  const o = board.filter((v) => v === 2).length;
  return x <= o ? 1 : 2;
}

// ===============================
// 🔹 Evaluación del tablero
// ===============================
function evalLine(line, player) {
  const opponent = player === 1 ? 2 : 1;
  const pCount = line.filter((v) => v === player).length;
  const oCount = line.filter((v) => v === opponent).length;
  if (pCount > 0 && oCount > 0) return 0;
  if (pCount === WIN_LEN) return 100000;
  if (oCount === WIN_LEN) return -100000;
  return pCount * pCount - oCount * oCount;
}

function evaluate(board, player) {
  let score = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c <= SIZE - WIN_LEN; c++) {
      score += evalLine(Array.from({ length: WIN_LEN }, (_, k) => cell(board, r, c + k)), player);
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r <= SIZE - WIN_LEN; r++) {
      score += evalLine(Array.from({ length: WIN_LEN }, (_, k) => cell(board, r + k, c)), player);
    }
  }
  for (let r = 0; r <= SIZE - WIN_LEN; r++) {
    for (let c = 0; c <= SIZE - WIN_LEN; c++) {
      score += evalLine(Array.from({ length: WIN_LEN }, (_, k) => cell(board, r + k, c + k)), player);
    }
  }
  for (let r = 0; r <= SIZE - WIN_LEN; r++) {
    for (let c = WIN_LEN - 1; c < SIZE; c++) {
      score += evalLine(Array.from({ length: WIN_LEN }, (_, k) => cell(board, r + k, c - k)), player);
    }
  }
  return score;
}

// ===============================
// 🔹 Minimax con poda alfa-beta
// ===============================
function minimax(board, depth, isMax, player, opponent, alpha, beta, maxDepth) {
  const result = checkWinner(board);
  if (result === player) return 100000 - depth;
  if (result === opponent) return depth - 100000;
  if (result === 0 || depth === maxDepth) return evaluate(board, player);

  const moves = board.map((v, i) => (v === 0 ? i : -1)).filter((i) => i !== -1);

  if (isMax) {
    let best = -Infinity;
    for (const i of moves) {
      board[i] = player;
      const val = minimax(board, depth + 1, false, player, opponent, alpha, beta, maxDepth);
      board[i] = 0;
      best = Math.max(best, val);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of moves) {
      board[i] = opponent;
      const val = minimax(board, depth + 1, true, player, opponent, alpha, beta, maxDepth);
      board[i] = 0;
      best = Math.min(best, val);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

// ===============================
// 🔹 IA — elegir mejor movimiento
// ===============================
function bestMove(board, player) {
  const opponent = player === 1 ? 2 : 1;
  let bestScore = -Infinity;
  let move = -1;
  const maxDepth = 4; // para rendimiento en Vercel

  for (let i = 0; i < board.length; i++) {
    if (board[i] === 0) {
      board[i] = player;
      const score = minimax(board, 0, false, player, opponent, -Infinity, Infinity, maxDepth);
      board[i] = 0;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

// ===============================
// 🔹 Middleware y endpoints
// ===============================
function validateBoard(req, res, next) {
  let board = req.method === 'POST' ? req.body.board : req.query.board;
  if (typeof board === 'string') {
    try {
      board = JSON.parse(board);
    } catch {
      board = board.split(',').map(Number);
    }
  }
  if (!Array.isArray(board) || board.length !== 25)
    return res.status(400).json({ error: 'El tablero debe tener 25 posiciones.' });
  req.board = board;
  next();
}

// Raíz
app.get('/', (_, res) => {
  res.send('Servidor Ta-Te-Ti 5x5 (4 en raya) funcionando ✔️');
});

// Verificar ganador
app.get('/check', validateBoard, (req, res) => {
  res.json({ ganador: checkWinner(req.board) });
});

// Obtener jugada óptima (GET o POST)
app.get('/move', validateBoard, (req, res) => {
  const player = req.query.player ? Number(req.query.player) : detectPlayer(req.board);
  const move = bestMove(req.board, player);
  res.json({ movimiento: move });
});

app.post('/move', validateBoard, (req, res) => {
  const player = req.body.player ? Number(req.body.player) : detectPlayer(req.board);
  const move = bestMove(req.board, player);
  res.json({ movimiento: move });
});

// ===============================
// 🔹 Exportar para Vercel
// ===============================
module.exports = app;
