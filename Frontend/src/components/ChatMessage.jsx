import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { toast } from 'react-toastify';

export default function ChatMessage({ message, user }) {
  const [copiedResponse, setCopiedResponse] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyFullResponse = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedResponse(true);
      toast.success('Response copied to clipboard!', {
        autoClose: 2000,
        toastId: `copy-msg-${message._id || Math.random()}`,
      });
      setTimeout(() => setCopiedResponse(false), 2000);
    } catch (err) {
      console.error('Failed to copy response: ', err);
      toast.error('Failed to copy message');
    }
  };

  const getUserInitials = () => {
    if (user?.fullName?.firstName) {
      const first = user.fullName.firstName[0]?.toUpperCase() || '';
      const last = user.fullName.lastName ? user.fullName.lastName[0]?.toUpperCase() : '';
      return `${first}${last}` || 'U';
    }
    return 'U';
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`chat-message-row d-flex w-100 py-3 px-2 px-md-4 ${
        isUser ? 'user-message-row justify-content-end' : 'ai-message-row justify-content-start'
      }`}
    >
      <div
        className={`chat-message-container d-flex gap-3 ${
          isUser ? 'flex-row-reverse max-w-user' : 'flex-row max-w-ai'
        }`}
        style={{ maxWidth: isUser ? '80%' : '100%', width: isUser ? 'auto' : '100%' }}
      >
        {/* Avatar */}
        <div className="avatar-wrapper flex-shrink-0">
          {isUser ? (
            <div
              className="user-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                fontSize: '0.85rem',
              }}
              title={user?.fullName?.firstName ? `${user.fullName.firstName} ${user.fullName.lastName || ''}` : 'You'}
            >
              {getUserInitials()}
            </div>
          ) : (
            <div
              className="ai-avatar rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #10a37f 0%, #1a7f64 50%, #2563eb 100%)',
              }}
              title="Pulse AI"
            >
              <i className="bi bi-stars fs-6"></i>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`message-body flex-grow-1 ${isUser ? 'text-end' : 'text-start'}`}>
          {/* Header info */}
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-semibold small text-light opacity-90">
              {isUser ? 'You' : 'Pulse AI'}
            </span>
            {message.createdAt && (
              <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                {formatTime(message.createdAt)}
              </span>
            )}
          </div>

          {/* Bubble content */}
          <div
            className={`message-bubble p-3 rounded-4 shadow-sm ${
              isUser
                ? 'bg-primary text-white ms-auto'
                : 'bg-dark-subtle text-light border border-secondary border-opacity-25'
            }`}
            style={{
              display: 'inline-block',
              textAlign: 'left',
              wordBreak: 'break-word',
              borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
            }}
          >
            {isUser ? (
              <div className="user-text-content whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="ai-markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeContent = String(children).replace(/\n$/, '');
                      const isMultiLine = codeContent.includes('\n');

                      if (!inline && (match || isMultiLine)) {
                        return (
                          <CodeBlock
                            language={match ? match[1] : ''}
                            value={codeContent}
                          />
                        );
                      }
                      return (
                        <code
                          className="inline-code bg-black bg-opacity-40 px-2 py-0.5 rounded text-info-emphasis border border-secondary border-opacity-25 font-monospace small"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return (
                        <div className="table-responsive my-3">
                          <table className="table table-dark table-bordered table-striped small m-0">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    p({ children }) {
                      return <p className="mb-2 last-p-no-mb">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="mb-2 ps-3">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="mb-2 ps-3">{children}</ol>;
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-start border-3 border-info ps-3 my-2 text-secondary fst-italic">
                          {children}
                        </blockquote>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Action buttons (copy response for AI messages) */}
          {!isUser && (
            <div className="message-actions d-flex align-items-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleCopyFullResponse}
                className="btn btn-sm btn-outline-secondary border-0 text-secondary p-1 d-flex align-items-center gap-1 hover-light action-btn"
                title="Copy entire response"
              >
                {copiedResponse ? (
                  <>
                    <i className="bi bi-check2 text-success"></i>
                    <span className="small text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-copy"></i>
                    <span className="small">Copy response</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
