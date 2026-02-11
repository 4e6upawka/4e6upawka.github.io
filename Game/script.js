const container = document.getElementById('game-container');
const scoreEl    = document.getElementById('score');
const timerEl    = document.getElementById('timer');
const gameOverEl = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart');

let score = 0;
let timeLeft = 60;
let gameActive = false;
let timerId = null;
let spawnerId = null;

const shapes = ['circle', 'square', 'triangle', 'hexagon'];
const colors = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#c084fc', '#f87171', '#a78bfa'];

function createShape() {
  if (!gameActive) return;

  const el = document.createElement('div');
  const type = shapes[Math.floor(Math.random() * shapes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  el.classList.add('shape', type);
  el.style.background = color;
  el.style.boxShadow = `0 0 18px ${color}90`;

  const size = 55 + Math.random() * 55; // 55–110 px
  const maxX = container.clientWidth  - size;
  const maxY = container.clientHeight - size;

  el.style.width  = size + 'px';
  el.style.height = size + 'px';
  el.style.left   = Math.random() * maxX + 'px';
  el.style.top    = Math.random() * maxY + 'px';

  // Особая обработка треугольника
  if (type === 'triangle') {
    const half = size / 2;
    const height = size * 0.866;
    el.style.borderLeft   = `${half}px solid transparent`;
    el.style.borderRight  = `${half}px solid transparent`;
    el.style.borderBottom = `${height}px solid ${color}`;
    el.style.background   = 'none';
    el.style.boxShadow    = 'none';
    el.style.width        = '0';
    el.style.height       = '0';
  }

  el.addEventListener('click', () => {
    score += 10 + Math.floor(Math.random() * 11); // 10–20
    scoreEl.textContent = `Очки: ${score}`;
    el.remove();
  });

  container.appendChild(el);

  // самоуничтожение через 2–3 секунды
  setTimeout(() => {
    if (el.parentNode) el.remove();
  }, 2000 + Math.random() * 1000);
}

function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Осталось: ${timeLeft}`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function startSpawner() {
  spawnerId = setInterval(createShape, 2100 + Math.random() * 900);
}

function startGame() {
  score = 0;
  timeLeft = 60;
  gameActive = true;
  scoreEl.textContent = `Очки: 0`;
  timerEl.textContent = `Осталось: 60`;
  gameOverEl.classList.remove('show');
  document.querySelectorAll('.shape').forEach(el => el.remove());

  clearInterval(timerId);
  clearInterval(spawnerId);

  startTimer();
  startSpawner();
}

function endGame() {
  gameActive = false;
  clearInterval(timerId);
  clearInterval(spawnerId);
  finalScore.textContent = score;
  gameOverEl.classList.add('show');
}

// Запуск и обработка кнопки
restartBtn.addEventListener('click', startGame);
startGame();   // автозапуск при загрузке