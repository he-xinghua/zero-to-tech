// ============================================================
//  深色模式
// ============================================================
const themeToggle = document.getElementById('themeToggle');

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
themeToggle.addEventListener('click', toggleTheme);

// ============================================================
//  时钟 + 问候
// ============================================================
const clockEl = document.getElementById('clock');

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

// 问候语（根据时段）
const greetingEl = document.getElementById('greeting');
const hour = new Date().getHours();
if (hour < 6) {
  greetingEl.textContent = '夜深了 🌙';
} else if (hour < 12) {
  greetingEl.textContent = '早上好 ☀️';
} else if (hour < 14) {
  greetingEl.textContent = '中午好 🌤️';
} else if (hour < 18) {
  greetingEl.textContent = '下午好 ⛅';
} else {
  greetingEl.textContent = '晚上好 🌆';
}

// ============================================================
//  消息切换
// ============================================================
const messages = [
  '欢迎来到认知训练小工具。',
  '念念不忘，必有回响。',
  '保持好奇，持续学习。',
  '代码改变世界。',
  '今天也是元气满满的一天！',
  '偷偷把乐乐藏在里面',
];

let msgIndex = 0;

function changeMessage() {
  msgIndex = (msgIndex + 1) % messages.length;
  document.getElementById('message').textContent = messages[msgIndex];
}

// ============================================================
//  标签切换
// ============================================================
function switchTab(tabId) {
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));

  document.querySelector(`.tab-item[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(`panel-${tabId}`).classList.add('active');
}

// ============================================================
//  反应速度测试
// ============================================================
const reactionArea = document.getElementById('reactionArea');
const reactionText = document.getElementById('reactionText');
const reactionHint = document.getElementById('reactionHint');
const lastTimeEl = document.getElementById('lastTime');
const bestTimeEl = document.getElementById('bestTime');
const reactionRatingEl = document.getElementById('reactionRating');

let reactionState = 'idle';
let reactionTimeout = null;
let reactionStart = 0;
let reactionResults = [];
let reactionBest = localStorage.getItem('reactionBest')
  ? Number(localStorage.getItem('reactionBest'))
  : Infinity;

if (reactionBest !== Infinity) {
  bestTimeEl.textContent = reactionBest;
}

function getReactionRating(ms) {
  if (ms < 150) return { emoji: '🏆', label: '卓越', desc: '前 1%' };
  if (ms < 180) return { emoji: '🥇', label: '精英', desc: '职业电竞级' };
  if (ms < 210) return { emoji: '🥈', label: '优秀', desc: '前 15%' };
  if (ms < 250) return { emoji: '🥉', label: '良好', desc: '前 35%' };
  if (ms < 300) return { emoji: '👍', label: '平均', desc: '正常成人' };
  if (ms < 350) return { emoji: '🐢', label: '偏慢', desc: '低于平均' };
  return { emoji: '🐌', label: '待改善', desc: '后 20%' };
}

function startReactionGame() {
  if (reactionTimeout) clearTimeout(reactionTimeout);
  reactionState = 'waiting';
  reactionArea.className = 'game-area reaction-area waiting';
  reactionText.textContent = '等待绿色...';
  reactionHint.textContent = '变绿后快速点击！';
  reactionRatingEl.textContent = '';

  const delay = 1000 + Math.random() * 3000;
  reactionTimeout = setTimeout(() => {
    reactionState = 'ready';
    reactionArea.className = 'game-area reaction-area ready';
    reactionText.textContent = '点击！';
    reactionStart = performance.now();
  }, delay);
}

function handleReactionClick() {
  if (reactionState === 'idle') {
    startReactionGame();
    return;
  }

  if (reactionState === 'waiting') {
    if (reactionTimeout) clearTimeout(reactionTimeout);
    reactionState = 'idle';
    reactionArea.className = 'game-area reaction-area waiting';
    reactionText.textContent = '按太快了...';
    reactionHint.textContent = '等变绿再点，点击重试';
    return;
  }

  if (reactionState === 'ready') {
    const rt = Math.round(performance.now() - reactionStart);
    reactionState = 'idle';
    reactionArea.className = 'game-area';
    reactionText.textContent = `${rt} ms`;
    lastTimeEl.textContent = rt;

    // 评级
    const rating = getReactionRating(rt);
    reactionRatingEl.innerHTML = `${rating.emoji} ${rating.label} — ${rating.desc}`;

    reactionResults.push(rt);

    if (rt < reactionBest) {
      reactionBest = rt;
      bestTimeEl.textContent = rt;
      localStorage.setItem('reactionBest', rt);
    }

    // 5 次后显示平均
    if (reactionResults.length >= 5) {
      const avg = Math.round(reactionResults.reduce((a, b) => a + b, 0) / 5);
      const avgRating = getReactionRating(avg);
      reactionHint.textContent = `📊 5 次平均：${avg} ms (${avgRating.emoji} ${avgRating.label}) — 点击再来一组`;
      reactionResults = [];
    } else {
      reactionHint.textContent = `已完成 ${reactionResults.length}/5 次，点击继续`;
    }
  }
}

// ============================================================
//  数字广度 (Digit Span)
// ============================================================
const digitDisplay = document.getElementById('digitDisplay');
const digitHint = document.getElementById('digitHint');
const currentSpanEl = document.getElementById('currentSpan');
const bestSpanEl = document.getElementById('bestSpan');
const digitInputDisplay = document.getElementById('digitInputDisplay');
const digitStartBtn = document.getElementById('digitStartBtn');

let digitState = 'idle';       // idle | playing | inputting | done
let digitSequence = [];
let digitUserInput = [];
let digitCurrentSpan = 0;
let digitBestSpan = localStorage.getItem('digitBestSpan')
  ? Number(localStorage.getItem('digitBestSpan'))
  : 0;
let digitTimeout = null;

if (digitBestSpan > 0) bestSpanEl.textContent = digitBestSpan;

function randomDigit() {
  return Math.floor(Math.random() * 10);
}

function showDigit(index) {
  if (index >= digitSequence.length) {
    digitDisplay.textContent = '?';
    digitHint.textContent = '用下方键盘按顺序输入数字';
    digitState = 'inputting';
    digitInputDisplay.textContent = '';
    digitUserInput = [];
    return;
  }

  digitDisplay.textContent = digitSequence[index];
  digitDisplay.style.fontSize = '56px';

  // 800ms 显示后 → 200ms 空白帧（解决连续相同数字无法分辨）
  digitTimeout = setTimeout(() => {
    digitDisplay.textContent = '·';
    digitTimeout = setTimeout(() => {
      showDigit(index + 1);
    }, 200);
  }, 800);
}

function startDigitSpan() {
  if (digitState === 'playing') return;

  digitCurrentSpan = Math.max(3, digitCurrentSpan);
  digitSequence = [];
  digitUserInput = [];
  digitInputDisplay.textContent = '';
  digitState = 'playing';
  digitStartBtn.disabled = true;
  digitStartBtn.style.opacity = '0.5';
  digitHint.textContent = '记住出现的数字...';

  for (let i = 0; i < digitCurrentSpan; i++) {
    digitSequence.push(randomDigit());
  }

  showDigit(0);
}

function numpadInput(n) {
  if (digitState !== 'inputting') return;
  digitUserInput.push(n);
  digitInputDisplay.textContent = digitUserInput.join(' ');
}

function numpadClear() {
  if (digitState !== 'inputting') return;
  digitUserInput.pop();
  digitInputDisplay.textContent = digitUserInput.join(' ');
}

function numpadConfirm() {
  if (digitState !== 'inputting') return;
  digitState = 'done';

  const correct = digitUserInput.length === digitSequence.length &&
    digitUserInput.every((v, i) => v === digitSequence[i]);

  if (correct) {
    digitCurrentSpan++;
    currentSpanEl.textContent = digitCurrentSpan;
    if (digitCurrentSpan > digitBestSpan) {
      digitBestSpan = digitCurrentSpan;
      bestSpanEl.textContent = digitCurrentSpan;
      localStorage.setItem('digitBestSpan', digitCurrentSpan);
    }
    digitDisplay.textContent = '✅ 正确！';
    digitHint.textContent = '进入下一轮...';
    setTimeout(() => {
      digitDisplay.textContent = '—';
      digitStartBtn.disabled = false;
      digitStartBtn.style.opacity = '1';
      digitHint.textContent = '点击"开始"继续';
      digitState = 'idle';
    }, 1200);
  } else {
    digitDisplay.textContent = '❌ 错误';
    digitHint.textContent = `正确顺序：${digitSequence.join(' ')}`;
    digitCurrentSpan = Math.max(3, digitCurrentSpan - 1);
    currentSpanEl.textContent = digitCurrentSpan;
    setTimeout(() => {
      digitDisplay.textContent = '—';
      digitStartBtn.disabled = false;
      digitStartBtn.style.opacity = '1';
      digitHint.textContent = '点击"开始"再来一次';
      digitState = 'idle';
    }, 2000);
  }
}

// ============================================================
//  黑猩猩测试 (Chimp Test)
// ============================================================
const chimpGrid = document.getElementById('chimpGrid');
const chimpHint = document.getElementById('chimpHint');
const chimpScoreEl = document.getElementById('chimpScore');
const chimpBestEl = document.getElementById('chimpBest');
const chimpStartBtn = document.getElementById('chimpStartBtn');

let chimpState = 'idle';       // idle | showing | playing | done
let chimpNumbers = [];
let chimpNext = 1;
let chimpScore = 0;
let chimpBest = localStorage.getItem('chimpBest')
  ? Number(localStorage.getItem('chimpBest'))
  : 0;
let chimpCells = [];

if (chimpBest > 0) chimpBestEl.textContent = chimpBest;

function startChimpTest() {
  chimpState = 'showing';
  chimpStartBtn.disabled = true;
  chimpStartBtn.style.opacity = '0.5';
  chimpHint.textContent = '记住数字的位置...';
  chimpNext = 1;
  chimpScore = 0;
  chimpScoreEl.textContent = '0';

  // 生成 1-9 的随机排列
  chimpNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
  for (let i = chimpNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chimpNumbers[i], chimpNumbers[j]] = [chimpNumbers[j], chimpNumbers[i]];
  }

  chimpGrid.innerHTML = '';
  chimpCells = [];

  chimpNumbers.forEach(num => {
    const cell = document.createElement('div');
    cell.className = 'chimp-cell show-number';
    cell.textContent = num;
    cell.dataset.num = num;
    cell.addEventListener('click', () => handleChimpClick(cell));
    chimpGrid.appendChild(cell);
    chimpCells.push(cell);
  });

  // 1.2 秒后隐藏数字
  setTimeout(() => {
    chimpState = 'playing';
    chimpCells.forEach(cell => {
      if (!cell.classList.contains('found')) {
        cell.className = 'chimp-cell hidden';
      }
    });
    chimpHint.textContent = '按 1→9 的顺序点击';
  }, 1200);
}

function handleChimpClick(cell) {
  if (chimpState !== 'playing') return;
  if (cell.classList.contains('found')) return;

  const num = Number(cell.dataset.num);

  if (num === chimpNext) {
    cell.className = 'chimp-cell found';
    cell.textContent = num;
    chimpScore++;
    chimpScoreEl.textContent = chimpScore;
    chimpNext++;

    if (chimpScore === 9) {
      chimpState = 'done';
      chimpHint.textContent = '🎉 全部正确！';
      if (chimpScore > chimpBest) {
        chimpBest = chimpScore;
        chimpBestEl.textContent = chimpScore;
        localStorage.setItem('chimpBest', chimpScore);
      }
      chimpStartBtn.disabled = false;
      chimpStartBtn.style.opacity = '1';
    }
  } else {
    // 点错
    cell.className = 'chimp-cell wrong';
    cell.textContent = num;
    setTimeout(() => {
      cell.className = 'chimp-cell hidden';
      cell.textContent = '';
    }, 400);

    chimpState = 'done';
    chimpHint.textContent = `❌ 点错了！应该点 ${chimpNext}`;
    chimpCells.forEach(c => {
      if (c.classList.contains('hidden')) {
        c.className = 'chimp-cell show-number';
        c.textContent = c.dataset.num;
      }
    });
    if (chimpScore > chimpBest) {
      chimpBest = chimpScore;
      chimpBestEl.textContent = chimpScore;
      localStorage.setItem('chimpBest', chimpScore);
    }
    chimpStartBtn.disabled = false;
    chimpStartBtn.style.opacity = '1';
  }
}

// ============================================================
//  划消任务 (Cancellation Task)
// ============================================================
const cancelGrid = document.getElementById('cancelGrid');
const cancelHint = document.getElementById('cancelHint');
const cancelCorrectEl = document.getElementById('cancelCorrect');
const cancelWrongEl = document.getElementById('cancelWrong');
const cancelRemainEl = document.getElementById('cancelRemain');
const cancelStartBtn = document.getElementById('cancelStartBtn');

let cancelState = 'idle';      // idle | playing | done
let cancelCorrect = 0;
let cancelWrong = 0;
let cancelTargetCells = [];
let cancelTimer = null;
let cancelRemain = 15;
let cancelLocked = false;
let cancelTimeStart = 0;

const CANCEL_DISTRACTORS = ['8', '9', '0', '5'];
const CANCEL_TARGET = '6';

function getCancelRating(correct, wrong) {
  if (correct === 12 && wrong === 0) return '🏆 S 级 — 完美！';
  if (correct >= 10 && wrong <= 2) return '🥇 A 级 — 优秀！';
  if (correct >= 8) return '🥈 B 级 — 继续加油';
  return '🥉 C 级 — 需更多练习';
}

function startCancelTask() {
  cancelState = 'playing';
  cancelCorrect = 0;
  cancelWrong = 0;
  cancelRemain = 15;
  cancelTargetCells = [];
  cancelLocked = false;
  cancelTimeStart = performance.now();
  cancelCorrectEl.textContent = '0';
  cancelWrongEl.textContent = '0';
  cancelRemainEl.textContent = '15';
  cancelStartBtn.disabled = true;
  cancelStartBtn.style.opacity = '0.5';
  cancelHint.innerHTML = '15 秒内点击所有数字 <strong>6</strong>';

  // 生成 8×5 网格
  const total = 40;
  const targetCount = 12;
  const positions = Array.from({ length: total }, (_, i) => i);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  const targetPositions = new Set(positions.slice(0, targetCount));

  cancelGrid.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'cancel-cell';
    const isTarget = targetPositions.has(i);
    cell.dataset.isTarget = isTarget ? '1' : '0';
    cell.textContent = isTarget
      ? CANCEL_TARGET
      : CANCEL_DISTRACTORS[Math.floor(Math.random() * CANCEL_DISTRACTORS.length)];
    cell.addEventListener('click', () => handleCancelClick(cell));
    cancelGrid.appendChild(cell);
    if (isTarget) cancelTargetCells.push(cell);
  }

  // 倒计时
  cancelTimer = setInterval(() => {
    cancelRemain--;
    cancelRemainEl.textContent = cancelRemain;
    if (cancelRemain <= 0) {
      endCancelTask();
    }
  }, 1000);
}

function handleCancelClick(cell) {
  if (cancelState !== 'playing' || cancelLocked) return;
  if (cell.classList.contains('found') || cell.classList.contains('wrong')) return;

  if (cell.dataset.isTarget === '1') {
    cell.classList.add('found');
    cell.textContent = '✓';
    cancelCorrect++;
    cancelCorrectEl.textContent = cancelCorrect;

    if (cancelCorrect === 12) {
      endCancelTask(true);
    }
  } else {
    cell.classList.add('wrong');
    cell.textContent = '✗';
    cancelWrong++;
    cancelWrongEl.textContent = cancelWrong;
    cancelLocked = true;
    setTimeout(() => {
      cell.classList.remove('wrong');
      cell.textContent = CANCEL_DISTRACTORS[Math.floor(Math.random() * CANCEL_DISTRACTORS.length)];
      cancelLocked = false;
    }, 600);
  }
}

function endCancelTask(completed) {
  if (cancelState === 'done') return;
  cancelState = 'done';
  if (cancelTimer) clearInterval(cancelTimer);
  const elapsed = Math.round((performance.now() - cancelTimeStart) / 1000);

  const rating = getCancelRating(cancelCorrect, cancelWrong);
  if (completed) {
    cancelHint.textContent = `🎉 全部找齐！用时 ${elapsed}s | ${rating}`;
  } else {
    cancelHint.textContent = `⏰ 时间到！${cancelCorrect}/12 个正确 | ${rating}`;
  }

  // 显示所有未找到的目标
  cancelTargetCells.forEach(cell => {
    if (!cell.classList.contains('found')) {
      cell.classList.add('found');
      cell.textContent = CANCEL_TARGET;
    }
  });

  cancelStartBtn.disabled = false;
  cancelStartBtn.style.opacity = '1';
}
