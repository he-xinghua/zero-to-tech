// ===== 深色模式 =====
const themeToggle = document.getElementById('themeToggle');

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// 恢复上次的主题设置
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', toggleTheme);

// ===== 时钟 =====
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

// ===== 问候语（根据时段） =====
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

// ===== 消息切换 =====
const messages = [
  '欢迎来到我的交互小工具页面。',
  '念念不忘，必有回响。',
  '保持好奇，持续学习。',
  '代码改变世界。',
  '今天也是元气满满的一天！',
  '偷偷把乐乐藏在里面'
  
];

let msgIndex = 0;

function changeMessage() {
  msgIndex = (msgIndex + 1) % messages.length;
  document.getElementById('message').textContent = messages[msgIndex];
}

// ===== 计数器 =====
let count = 0;
const counterEl = document.getElementById('counter');

function increment() {
  count++;
  counterEl.textContent = count;
}

function decrement() {
  count--;
  counterEl.textContent = count;
}

function resetCounter() {
  count = 0;
  counterEl.textContent = count;
}
