# Pulse AI Chatbot

Pulse is a full-stack AI chatbot with user authentication, saved conversations, real-time Socket.IO replies, and short-term and long-term memory.

**Live project:** [Pulse AI Chatbot](https://chatbot-virid-three-13.vercel.app)

## Tech stack

- **Frontend:** React, Vite, Bootstrap, Axios, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, JWT, Mongoose
- **AI and data:** Google Gemini, MongoDB Atlas, Pinecone

## Project structure

```text
chatbot/
├── Backend/   # Express API, Socket.IO server, database and AI services
└── Frontend/  # React and Vite application
```

## Features

- User registration, login, logout, and protected routes
- Persistent chat sessions and messages
- Real-time AI replies through Socket.IO
- Gemini-powered responses
- Pinecone-backed memory retrieval for relevant past context
- Markdown and syntax-highlighted code responses
- Responsive dark chat interface

## Prerequisites

- Node.js 22 or newer
- A MongoDB Atlas database
- A Google Gemini API key
- A Pinecone API key and an index named `chatbot`

## Run locally

### 1. Configure the backend

Create `Backend/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
FRONTEND_URL=http://localhost:5173
```

Install packages and start the API:

```bash
cd Backend
npm install
npm run dev
```

The backend starts at `http://localhost:3000`.

### 2. Configure the frontend

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

In a second terminal, install packages and start Vite:

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment variables

Do not commit `.env` files or API keys. Use `.env` files only for local development and configure production values in Render and Vercel.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Backend | MongoDB connection string |
| `JWT_SECRET` | Backend | Signs user authentication tokens |
| `GEMINI_API_KEY` | Backend | Accesses Google Gemini |
| `PINECONE_API_KEY` | Backend | Accesses Pinecone memory storage |
| `FRONTEND_URL` | Backend | Allows the deployed frontend through CORS |
| `VITE_API_URL` | Frontend | Backend API and Socket.IO URL |

## Troubleshooting

If registration or login shows a **Network Error** in production, verify that:

1. `VITE_API_URL` in Vercel matches the Render backend URL.
2. `FRONTEND_URL` in Render matches the Vercel frontend URL without a trailing slash.
3. The backend has been redeployed after changing `FRONTEND_URL`.
4. MongoDB Atlas allows connections from the deployed backend.
