# 🎮 Ta-Te-Ti 5×5 con IA (Minimax + Alfa-Beta)

Este proyecto implementa un **Ta-Te-Ti** de **5x5** donde gana quien logra **4 en raya**, con una **IA fuerte** basada en *Minimax con poda alfa-beta* y heurística avanzada.

---

## 🚀 Tecnologías
- **Node.js** + **Express**: servidor local
- **Jest**: testing unitario
- **IA**: Minimax limitado (profundidad 5) con heurística de líneas

---

## 🧠 Lógica de IA
El algoritmo usa:
- **Evaluación heurística** que pondera líneas con fichas propias y del oponente.
- **Profundidad máxima = 5** (puede tardar un poco, pero juega con estrategia real).
- **Poda alfa-beta** para optimizar ramas no prometedoras.

---

## 📦 Instalación

1. Clonar o descargar el proyecto.
2. Instalar dependencias:
   ```bash
   npm install


3. Ejecutar el servidor:

   ```bash
   node server-5x5.js


Servidor disponible en:
👉 [http://localhost:3001](http://localhost:3001)

---

## 🧩 Endpoints disponibles

### `GET /`

Verifica que el servidor esté activo.
**Respuesta:**

```
Servidor Ta-Te-Ti 5x5 con IA fuerte funcionando ✔️
```

---

### `GET /move`

Devuelve el mejor movimiento para la IA.

**Parámetros:**

* `board`: array de 25 números (`0 = vacío`, `1 = X`, `2 = O`)
* `player` *(opcional)*: 1 o 2 (si no se pasa, se detecta automáticamente)

**Ejemplo:**

```
GET /move?board=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]&player=1
```

**Respuesta:**

```json
{ "movimiento": 12 }
```

*(índice del tablero donde la IA jugaría)*

---

### `POST /move`

Mismo comportamiento, pero enviando un JSON:

```json
{
  "board": [0,0,0,...],
  "player": 2
}
```

---

### `GET /check`

Devuelve el estado del juego.

**Ejemplo:**

```
GET /check?board=[1,1,1,1,1,0,0,...]
```

**Respuesta:**

```json
{ "ganador": 1 }
```

> `1 = gana X`, `2 = gana O`, `0 = empate`, `null = sigue`

---

## 🧪 Tests

Los tests están en `test-5x5.test.js` e incluyen:

* Detección de ganador (filas, columnas, diagonales)
* Empates
* Detección del jugador actual
* Movimiento válido de la IA

Ejecutar con:

```bash
npm test
```

---

## 🧱 Estructura del proyecto

```
📁 ta-te-ti-5x5-sinnombre
 ┣ 📄 tateti.js
 ┣ 📄 tateti.test.js
 ┣ 📄 package.json
 ┗ 📄 README.md
```

---

## 👨‍💻 Autores

Proyecto adaptado por Fabricio Coledani, Nicolas Moreno, Dillan Perez Diaz y Tomas Urquia (Estudiantes de Programación FullStack - UPC).

---

## 🧩 Notas

* El algoritmo puede tardar unos segundos en tableros muy llenos (por la profundidad 5).
* Se puede ajustar la dificultad bajando `maxDepth` dentro de `bestMove()`.

---

