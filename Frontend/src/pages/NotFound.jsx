import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-light text-center px-3">
      <h1 className="display-1 fw-bold text-info">404</h1>
      <h4 className="mb-3">Page Not Found</h4>
      <p className="text-secondary mb-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary rounded-pill px-4">
        Go to Chat
      </Link>
    </div>
  );
}
