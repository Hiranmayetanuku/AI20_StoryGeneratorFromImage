/**
 * Gemini Chat Frontend
 * - Message history in-memory and persisted in localStorage
 * - Light/Dark theme persistence
 * - Loading state with animated indicator
 * - Graceful API + UI error handling
 */

const CONFIG = {
  // Replace with your API key before production deployment.
  API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
  MODEL: 'gemini-1.5-flash',
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
  STORAGE_KEYS: {
    THEME: 'gemini-chat-theme',
    HISTORY: 'gemini-chat-history'
  }
};

const STATE = {
  isLoading: false,
  messages: []
};

const ELEMENTS = {
  htmlRoot: document.documentElement,
  form: document.getElementById('chatForm'),
  input: document.getElementById('messageInput'),
  list: document.getElementById('messageList'),
  sendButton: document.getElementById('sendButton'),
  themeToggle: document.getElementById('themeToggle'),
  messageTemplate: document.getElementById('messageTemplate')
};

/** Initialize the application. */
function init() {
  bindEvents();
  loadTheme();
  loadHistory();

  if (!STATE.messages.length) {
    addMessage('assistant', 'Hello! I can help with ideas, writing, coding, and more. How can I help you today?');
  }
}

/** Attach all event handlers. */
function bindEvents() {
  ELEMENTS.form.addEventListener('submit', onSubmit);
  ELEMENTS.input.addEventListener('input', autoResizeTextarea);
  ELEMENTS.themeToggle.addEventListener('click', toggleTheme);
}

/** Auto-resize textarea height as user types. */
function autoResizeTextarea() {
  ELEMENTS.input.style.height = 'auto';
  ELEMENTS.input.style.height = `${Math.min(ELEMENTS.input.scrollHeight, 180)}px`;
}

/** Handle message submit and API request cycle. */
async function onSubmit(event) {
  event.preventDefault();

  const text = ELEMENTS.input.value.trim();
  if (!text || STATE.isLoading) return;

  addMessage('user', text);
  ELEMENTS.input.value = '';
  autoResizeTextarea();

  setLoading(true);
  const loadingNodeId = addLoadingMessage();

  try {
    const reply = await requestGeminiResponse();
    removeMessageById(loadingNodeId);
    addMessage('assistant', reply || 'I received an empty response. Please try again.');
  } catch (error) {
    removeMessageById(loadingNodeId);
    addMessage('assistant', `⚠️ ${error.message}`);
  } finally {
    setLoading(false);
  }
}

/** Generate a Gemini response from conversation history. */
async function requestGeminiResponse() {
  if (!CONFIG.API_KEY || CONFIG.API_KEY.includes('YOUR_GEMINI_API_KEY')) {
    throw new Error('Missing Gemini API key. Add your key in CONFIG.API_KEY before use.');
  }

  const endpoint = CONFIG.API_URL.replace('{model}', CONFIG.MODEL);

  // Convert app messages into Gemini contents format.
  const contents = STATE.messages
    .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  const response = await fetch(`${endpoint}?key=${CONFIG.API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    const errorPayload = await safeJson(response);
    const apiMessage = errorPayload?.error?.message || `API request failed with status ${response.status}`;
    throw new Error(apiMessage);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini returned an unexpected response format.');
  }

  return text.trim();
}

/** Read JSON safely without throwing if body is invalid JSON. */
async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/** Update loading state and controls. */
function setLoading(isLoading) {
  STATE.isLoading = isLoading;
  ELEMENTS.sendButton.disabled = isLoading;
  ELEMENTS.input.disabled = isLoading;
}

/** Add message to state + UI and persist history. */
function addMessage(role, content, options = {}) {
  const message = {
    id: options.id || crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
    transient: options.transient || false
  };

  if (!message.transient) {
    STATE.messages.push(message);
    saveHistory();
  }

  renderMessage(message);
  scrollToBottom();
  return message.id;
}

/** Render a single message using the template element. */
function renderMessage(message) {
  const fragment = ELEMENTS.messageTemplate.content.cloneNode(true);
  const row = fragment.querySelector('.message-row');
  const avatar = fragment.querySelector('.avatar');
  const meta = fragment.querySelector('.meta');
  const bubble = fragment.querySelector('.bubble');

  row.classList.add(message.role);
  row.dataset.id = message.id;

  avatar.textContent = message.role === 'user' ? 'U' : 'AI';
  meta.textContent = message.role === 'user' ? 'You' : 'Assistant';

  if (message.content === '__loading__') {
    bubble.innerHTML = '<span class="loading-dots" aria-label="Loading"><span></span><span></span><span></span></span>';
  } else {
    bubble.textContent = message.content;
  }

  ELEMENTS.list.appendChild(fragment);
}

/** Add transient loading bubble to mimic assistant typing. */
function addLoadingMessage() {
  return addMessage('assistant', '__loading__', { transient: true });
}

/** Remove message element by its unique id. */
function removeMessageById(id) {
  const node = ELEMENTS.list.querySelector(`[data-id="${id}"]`);
  if (node) node.remove();
}

/** Keep latest message in view. */
function scrollToBottom() {
  ELEMENTS.list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/** Persist theme preference in localStorage. */
function saveTheme(theme) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
}

/** Load theme from localStorage or system preference. */
function loadTheme() {
  const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

/** Toggle between dark and light themes. */
function toggleTheme() {
  const current = ELEMENTS.htmlRoot.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
}

/** Apply theme and update button label/icon. */
function applyTheme(theme) {
  ELEMENTS.htmlRoot.dataset.theme = theme;
  const icon = ELEMENTS.themeToggle.querySelector('.theme-icon');
  const label = ELEMENTS.themeToggle.querySelector('.theme-label');

  if (theme === 'dark') {
    icon.textContent = '☀️';
    label.textContent = 'Light';
  } else {
    icon.textContent = '🌙';
    label.textContent = 'Dark';
  }
}

/** Save non-transient messages only. */
function saveHistory() {
  localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(STATE.messages));
}

/** Load and render message history from storage. */
function loadHistory() {
  const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    STATE.messages = parsed.filter((m) => m && m.role && typeof m.content === 'string');
    STATE.messages.forEach(renderMessage);
    scrollToBottom();
  } catch {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.HISTORY);
  }
}

init();
