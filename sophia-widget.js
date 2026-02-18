(function() {
  'use strict';

  // --- Configuration ---
  const script = document.currentScript;
  const WEBHOOK_URL = script?.getAttribute('data-webhook-url') || 'https://afninc.app.n8n.cloud/webhook/sophia-chat';
  const LO_ID = script?.getAttribute('data-lo-id') || '';
  const STORAGE_KEY = 'sophia_chat_session';
  const BRAND_PRIMARY = '#1a3a5c';
  const BRAND_ACCENT = '#C41230';
  const BRAND_LIGHT = '#f0f4f8';

  // --- Session ---
  function getSessionId() {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  // --- SVG Logo ---
  const SOPHIA_AVATAR = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="${BRAND_PRIMARY}"/><text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="18" font-weight="bold">S</text></svg>`;

  // --- Styles ---
  const CSS = `
    :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .sophia-bubble {
      position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
      border-radius: 50%; background: ${BRAND_PRIMARY}; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2); display: flex; align-items: center;
      justify-content: center; z-index: 999999; transition: transform 0.2s, box-shadow 0.2s;
    }
    .sophia-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
    .sophia-bubble svg { width: 32px; height: 32px; }
    .sophia-bubble .close-icon { display: none; color: white; font-size: 24px; font-weight: bold; }
    .sophia-bubble.open svg { display: none; }
    .sophia-bubble.open .close-icon { display: block; }

    .sophia-badge {
      position: absolute; top: -2px; right: -2px; width: 16px; height: 16px;
      background: ${BRAND_ACCENT}; border-radius: 50%; border: 2px solid white;
    }

    .sophia-window {
      position: fixed; bottom: 96px; right: 24px; width: 380px; height: 560px;
      background: white; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      display: none; flex-direction: column; z-index: 999998; overflow: hidden;
      animation: sophia-slideUp 0.3s ease;
    }
    .sophia-window.open { display: flex; }

    @keyframes sophia-slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      .sophia-window {
        bottom: 0; right: 0; left: 0; top: 0; width: 100%; height: 100%;
        border-radius: 0;
      }
      .sophia-bubble { bottom: 16px; right: 16px; }
    }

    .sophia-header {
      background: linear-gradient(135deg, ${BRAND_PRIMARY}, #2a5a8c);
      color: white; padding: 16px 20px; display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .sophia-header-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
    .sophia-header-avatar svg { width: 36px; height: 36px; }
    .sophia-header-info h3 { font-size: 16px; font-weight: 600; }
    .sophia-header-info p { font-size: 12px; opacity: 0.85; }

    .sophia-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column;
      gap: 12px; background: ${BRAND_LIGHT};
    }
    .sophia-messages::-webkit-scrollbar { width: 4px; }
    .sophia-messages::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }

    .sophia-msg {
      max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: 14px;
      line-height: 1.5; word-wrap: break-word; position: relative;
    }
    .sophia-msg strong { font-weight: 600; }
    .sophia-msg ul, .sophia-msg ol { margin: 4px 0 4px 18px; }
    .sophia-msg li { margin: 2px 0; }

    .sophia-msg.bot {
      background: white; color: #333; align-self: flex-start;
      border-bottom-left-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .sophia-msg.user {
      background: ${BRAND_PRIMARY}; color: white; align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .sophia-msg-time {
      font-size: 10px; opacity: 0.5; margin-top: 4px;
    }
    .sophia-msg.user .sophia-msg-time { text-align: right; }

    .sophia-typing {
      align-self: flex-start; background: white; padding: 12px 16px;
      border-radius: 16px; border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: none; gap: 4px;
      align-items: center;
    }
    .sophia-typing.show { display: flex; }
    .sophia-typing span {
      width: 8px; height: 8px; background: #aaa; border-radius: 50%;
      animation: sophia-bounce 1.4s infinite;
    }
    .sophia-typing span:nth-child(2) { animation-delay: 0.2s; }
    .sophia-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes sophia-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    .sophia-input-area {
      padding: 12px 16px; border-top: 1px solid #e8ecf0; display: flex;
      gap: 8px; align-items: center; flex-shrink: 0; background: white;
    }
    .sophia-input {
      flex: 1; border: 1px solid #dde2e8; border-radius: 24px; padding: 10px 16px;
      font-size: 14px; outline: none; font-family: inherit; resize: none;
      max-height: 80px; line-height: 1.4;
    }
    .sophia-input:focus { border-color: ${BRAND_PRIMARY}; box-shadow: 0 0 0 2px rgba(26,58,92,0.1); }
    .sophia-input::placeholder { color: #999; }

    .sophia-send {
      width: 40px; height: 40px; border: none; border-radius: 50%;
      background: ${BRAND_PRIMARY}; color: white; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.2s;
    }
    .sophia-send:hover { background: #2a5a8c; }
    .sophia-send:disabled { background: #ccc; cursor: default; }
    .sophia-send svg { width: 18px; height: 18px; }

    .sophia-powered {
      text-align: center; padding: 6px; font-size: 10px; color: #aaa; background: white;
      flex-shrink: 0;
    }
  `;

  // --- Build Widget ---
  class SophiaWidget {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.sessionId = getSessionId();
      this.init();
    }

    init() {
      // Create shadow host
      this.host = document.createElement('div');
      this.host.id = 'sophia-chat-widget';
      document.body.appendChild(this.host);

      this.shadow = this.host.attachShadow({ mode: 'open' });

      // Styles
      const style = document.createElement('style');
      style.textContent = CSS;
      this.shadow.appendChild(style);

      // Bubble
      this.bubble = document.createElement('div');
      this.bubble.className = 'sophia-bubble';
      this.bubble.innerHTML = `${SOPHIA_AVATAR}<span class="close-icon">✕</span><div class="sophia-badge"></div>`;
      this.bubble.addEventListener('click', () => this.toggle());
      this.shadow.appendChild(this.bubble);

      // Window
      this.window = document.createElement('div');
      this.window.className = 'sophia-window';
      this.window.innerHTML = `
        <div class="sophia-header">
          <div class="sophia-header-avatar">${SOPHIA_AVATAR}</div>
          <div class="sophia-header-info">
            <h3>Sophia</h3>
            <p>Mortgage Assistant • Online</p>
          </div>
        </div>
        <div class="sophia-messages"></div>
        <div class="sophia-input-area">
          <textarea class="sophia-input" placeholder="Type a message..." rows="1"></textarea>
          <button class="sophia-send" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"/>
            </svg>
          </button>
        </div>
        <div class="sophia-powered">Powered by American Financial Network</div>
      `;
      this.shadow.appendChild(this.window);

      // Refs
      this.messagesEl = this.window.querySelector('.sophia-messages');
      this.inputEl = this.window.querySelector('.sophia-input');
      this.sendBtn = this.window.querySelector('.sophia-send');

      // Typing indicator
      this.typingEl = document.createElement('div');
      this.typingEl.className = 'sophia-typing';
      this.typingEl.innerHTML = '<span></span><span></span><span></span>';
      this.messagesEl.appendChild(this.typingEl);

      // Events
      this.sendBtn.addEventListener('click', () => this.send());
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });
      this.inputEl.addEventListener('input', () => {
        this.inputEl.style.height = 'auto';
        this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 80) + 'px';
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.window.classList.toggle('open', this.isOpen);
      this.bubble.classList.toggle('open', this.isOpen);

      if (this.isOpen) {
        // Remove badge
        const badge = this.bubble.querySelector('.sophia-badge');
        if (badge) badge.style.display = 'none';

        // Welcome message on first open
        if (this.messages.length === 0) {
          this.addBotMessage("Hi there! 👋 I'm **Sophia**, your mortgage assistant. I can help you with:\n\n- **General questions** about mortgages and loan types\n- **Quick pre-qualification** to see what you might qualify for\n- **Full loan application** to get the process started\n\nHow can I help you today?");
        }
        setTimeout(() => this.inputEl.focus(), 100);
      }
    }

    formatMessage(text) {
      // Convert markdown-lite to HTML
      let html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '\n• ')
        .replace(/\n/g, '<br>');
      // Convert bullet lists
      html = html.replace(/((?:• .+?<br>?)+)/g, (match) => {
        const items = match.split('<br>').filter(i => i.trim().startsWith('• '));
        return '<ul>' + items.map(i => '<li>' + i.replace('• ', '') + '</li>').join('') + '</ul>';
      });
      return html;
    }

    timeStr() {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    addBotMessage(text) {
      this.messages.push({ role: 'bot', text });
      const div = document.createElement('div');
      div.className = 'sophia-msg bot';
      div.innerHTML = this.formatMessage(text) + `<div class="sophia-msg-time">${this.timeStr()}</div>`;
      this.messagesEl.insertBefore(div, this.typingEl);
      this.scrollToBottom();
    }

    addUserMessage(text) {
      this.messages.push({ role: 'user', text });
      const div = document.createElement('div');
      div.className = 'sophia-msg user';
      div.innerHTML = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') +
        `<div class="sophia-msg-time">${this.timeStr()}</div>`;
      this.messagesEl.insertBefore(div, this.typingEl);
      this.scrollToBottom();
    }

    showTyping(show) {
      this.typingEl.classList.toggle('show', show);
      if (show) this.scrollToBottom();
    }

    scrollToBottom() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }

    async send() {
      const text = this.inputEl.value.trim();
      if (!text) return;

      this.inputEl.value = '';
      this.inputEl.style.height = 'auto';
      this.addUserMessage(text);
      this.sendBtn.disabled = true;
      this.showTyping(true);

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.sessionId,
            message: text,
            loId: LO_ID
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        this.showTyping(false);
        this.addBotMessage(data.response || "I'm sorry, I didn't catch that. Could you try again?");

        if (data.sessionId) {
          this.sessionId = data.sessionId;
          localStorage.setItem(STORAGE_KEY, this.sessionId);
        }
      } catch (err) {
        this.showTyping(false);
        this.addBotMessage("I'm having trouble connecting right now. Please try again in a moment, or call your loan officer directly for immediate assistance.");
        console.error('Sophia Chat Error:', err);
      }

      this.sendBtn.disabled = false;
      this.inputEl.focus();
    }
  }

  // --- Initialize ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SophiaWidget());
  } else {
    new SophiaWidget();
  }
})();
