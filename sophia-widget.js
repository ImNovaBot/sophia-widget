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

  // --- Avatar Image ---
  const SOPHIA_AVATAR_URL = 'data:image/jpeg;base64,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';
  const SOPHIA_AVATAR = `<img src="${SOPHIA_AVATAR_URL}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="Sophia"/>`;

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
    .sophia-bubble svg, .sophia-bubble img { width: 32px; height: 32px; border-radius: 50%; }
    .sophia-bubble .close-icon { display: none; color: white; font-size: 24px; font-weight: bold; }
    .sophia-bubble.open svg, .sophia-bubble.open img { display: none; }
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
    .sophia-header-avatar svg, .sophia-header-avatar img { width: 36px; height: 36px; border-radius: 50%; }
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
