# Pulse - AI Chatbot Frontend

A modern, responsive React + Bootstrap frontend for the Pulse AI Chatbot featuring short-term & long-term vector memory, real-time Socket.IO messaging, and modern chat UI aesthetics.

## Features

- **ChatGPT / Pulse Aesthetic**: Dark theme, collapsible sidebar, avatar icons, responsive mobile drawer.
- **Authentication**: Seamless Login & Registration with JWT, protected routes, and session persistence.
- **Real-Time AI Streaming**: Connected via Socket.IO (`ai-message`, `ai-response`, `ai-error`).
- **Short-Term & Long-Term Memory**: Automatic context retrieval through conversation history and Pinecone vector search.
- **Rich Code Showcase**:
  - Language header banner with language detection.
  - Dedicated "Copy code" button with real-time checkmark feedback and Toastify toast.
  - VS Code dark plus syntax highlighting via Prism.
- **Copy Full Response**: Instant one-click copy button on every AI message with notification.
- **Interactive Suggestions**: Quick prompt starter cards on the welcome screen.
- **Toastify Notifications**: Toast alerts for auth, clipboard actions, errors, and chat management.

## Setup & Running

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build
```

Make sure the backend is running on `http://localhost:3000` via:
```bash
cd Backend
npm start
```
