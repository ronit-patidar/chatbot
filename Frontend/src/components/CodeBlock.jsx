import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';

export default function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Code copied to clipboard!', {
        autoClose: 2000,
        toastId: 'copy-code-toast', // prevent duplicate spam
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      toast.error('Failed to copy code');
    }
  };

  const displayLanguage = language || 'code';

  return (
    <div className="code-block-wrapper my-3 rounded-3 overflow-hidden shadow-sm border border-secondary border-opacity-25">
      {/* Code Block Header (ChatGPT / Pulse style) */}
      <div className="code-block-header d-flex justify-content-between align-items-center px-3 py-2 bg-dark-subtle text-secondary border-bottom border-secondary border-opacity-25">
        <span className="code-lang text-lowercase fw-semibold small d-flex align-items-center gap-1">
          <i className="bi bi-file-earmark-code text-info"></i>
          {displayLanguage}
        </span>
        <button
          onClick={handleCopy}
          className="btn btn-sm btn-link text-decoration-none text-light opacity-75 hover-opacity-100 p-0 d-flex align-items-center gap-1 code-copy-btn"
          title="Copy code to clipboard"
          type="button"
        >
          {copied ? (
            <>
              <i className="bi bi-check2 text-success fs-6"></i>
              <span className="small text-success fw-medium">Copied!</span>
            </>
          ) : (
            <>
              <i className="bi bi-clipboard fs-6"></i>
              <span className="small">Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Content */}
      <div className="code-block-content m-0 p-0 position-relative">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            backgroundColor: '#18181b',
            borderRadius: '0',
            fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
          }}
          wrapLongLines={true}
        >
          {String(value).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
