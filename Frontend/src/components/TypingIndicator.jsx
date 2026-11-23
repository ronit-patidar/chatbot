import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="chat-message-row d-flex w-100 py-3 px-2 px-md-4 ai-message-row justify-content-start">
      <div className="chat-message-container d-flex gap-3 flex-row max-w-ai">
        {/* Pulse Avatar */}
        <div className="avatar-wrapper flex-shrink-0">
          <div
            className="ai-avatar rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm pulse-glow"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #10a37f 0%, #1a7f64 50%, #2563eb 100%)',
            }}
          >
            <i className="bi bi-stars fs-6"></i>
          </div>
        </div>

        {/* Typing Dots / Thinking */}
        <div className="message-body">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-semibold small text-light opacity-90">Pulse AI</span>
            <span className="badge bg-secondary-subtle text-secondary-emphasis small fw-normal">
              Thinking...
            </span>
          </div>

          <div
            className="message-bubble px-3 py-2 rounded-4 shadow-sm bg-dark-subtle border border-secondary border-opacity-25 d-flex align-items-center gap-1"
            style={{ borderRadius: '4px 18px 18px 18px' }}
          >
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
