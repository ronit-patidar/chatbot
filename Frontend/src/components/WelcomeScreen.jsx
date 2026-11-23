import React from 'react';

const SUGGESTIONS = [
  {
    icon: 'bi-code-slash',
    title: 'Code a JavaScript utility',
    prompt: 'Write a modern JavaScript function to debounce API calls with TypeScript types and an example.',
  },
  {
    icon: 'bi-cpu',
    title: 'Short vs Long-term Memory',
    prompt: 'Explain how conversational AI uses short-term chat history and long-term vector embeddings.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Authentication Best Practices',
    prompt: 'What are the security best practices for JWT tokens, cookies, and CORS in modern web applications?',
  },
  {
    icon: 'bi-lightbulb',
    title: 'Brainstorm creative project ideas',
    prompt: 'Give me 3 innovative AI-powered web app ideas combining LLMs and real-time websockets.',
  },
];

export default function WelcomeScreen({ user, onSelectPrompt }) {
  const firstName = user?.fullName?.firstName || 'there';

  return (
    <div className="welcome-screen d-flex flex-column align-items-center justify-content-center text-center p-3 p-md-5 flex-grow-1">
      {/* Brand Icon */}
      <div
        className="welcome-badge rounded-circle p-3 mb-3 shadow-lg d-flex align-items-center justify-content-center"
        style={{
          width: '72px',
          height: '72px',
          background: 'linear-gradient(135deg, #10a37f 0%, #2563eb 100%)',
        }}
      >
        <i className="bi bi-stars text-white fs-1"></i>
      </div>

      {/* Greeting Title */}
      <h2 className="fw-bold mb-2 text-light">
        Hello, <span className="text-info">{firstName}</span>
      </h2>
      <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '480px' }}>
        How can I help you today? Ask a question, generate code, or explore ideas with Pulse.
      </p>

      {/* Feature Badges */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        <span className="badge rounded-pill bg-dark border border-secondary border-opacity-50 text-secondary py-2 px-3 fw-normal">
          <i className="bi bi-activity text-warning me-1"></i> Pulse Intelligence
        </span>
        <span className="badge rounded-pill bg-dark border border-secondary border-opacity-50 text-secondary py-2 px-3 fw-normal">
          <i className="bi bi-clock-history text-info me-1"></i> Short-term History
        </span>
        <span className="badge rounded-pill bg-dark border border-secondary border-opacity-50 text-secondary py-2 px-3 fw-normal">
          <i className="bi bi-database-check text-success me-1"></i> Long-term Vector Memory
        </span>
      </div>

      {/* Suggestion Cards */}
      <div className="row g-3 w-100 justify-content-center" style={{ maxWidth: '780px' }}>
        {SUGGESTIONS.map((item, idx) => (
          <div key={idx} className="col-12 col-md-6 text-start">
            <button
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="suggestion-card w-100 h-100 p-3 btn text-start bg-dark-subtle border border-secondary border-opacity-25 rounded-4 shadow-sm hover-card transition-all d-flex align-items-start gap-3"
            >
              <div className="suggestion-icon p-2 rounded-3 bg-dark border border-secondary border-opacity-25 text-info">
                <i className={`bi ${item.icon} fs-5`}></i>
              </div>
              <div className="suggestion-text flex-grow-1">
                <div className="fw-semibold text-light small mb-1">{item.title}</div>
                <div className="text-secondary small text-truncate-2">{item.prompt}</div>
              </div>
              <i className="bi bi-arrow-up-right text-secondary small opacity-50"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
