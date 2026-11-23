import React, { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSendMessage, disabled, placeholder = 'Ask Pulse anything...' }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;

    onSendMessage(text.trim());
    setText('');

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Enter without Shift submits
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-wrapper w-100 py-2 px-3 px-md-4">
      <div className="chat-input-container mx-auto" style={{ maxWidth: '820px' }}>
        <form onSubmit={handleSubmit} className="position-relative">
          <div className="input-box-pill d-flex align-items-end p-2 rounded-4 bg-dark-subtle border border-secondary border-opacity-25 shadow">
            {/* Auto-growing Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={disabled ? 'Pulse is responding...' : placeholder}
              rows={1}
              className="form-control bg-transparent text-light border-0 shadow-none chat-textarea flex-grow-1"
              style={{
                resize: 'none',
                overflowY: text.split('\n').length > 5 ? 'auto' : 'hidden',
                maxHeight: '180px',
                minHeight: '24px',
                paddingTop: '6px',
                paddingBottom: '6px',
                fontSize: '0.95rem',
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={disabled || !text.trim()}
              className={`btn btn-send rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0 ms-2 transition-all ${
                text.trim() && !disabled
                  ? 'btn-light text-dark shadow-sm'
                  : 'btn-secondary bg-opacity-25 text-secondary border-0 opacity-50'
              }`}
              style={{ width: '36px', height: '36px' }}
              title="Send message (Enter)"
            >
              {disabled ? (
                <div
                  className="spinner-border spinner-border-sm text-secondary"
                  style={{ width: '16px', height: '16px' }}
                  role="status"
                />
              ) : (
                <i className="bi bi-arrow-up-short fs-4"></i>
              )}
            </button>
          </div>
        </form>

        {/* Disclaimer / footer hint */}
        <div className="text-center text-secondary mt-2 small" style={{ fontSize: '0.75rem' }}>
          Pulse can make mistakes. Check important info. Equipped with conversation memory.
        </div>
      </div>
    </div>
  );
}
