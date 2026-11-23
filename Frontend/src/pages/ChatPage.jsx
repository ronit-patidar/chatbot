import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { connectSocket, getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import WelcomeScreen from '../components/WelcomeScreen';
import TypingIndicator from '../components/TypingIndicator';
import { toast } from 'react-toastify';

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const activeChatIdRef = useRef(activeChatId);

  // Keep activeChatIdRef in sync for socket callbacks
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  // Scroll to bottom helper
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 2 ? 'auto' : 'smooth');
  }, [messages, isGenerating]);

  // Fetch initial chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get('/api/chat');
        const retrievedChats = res.data?.chats || [];
        setChats(retrievedChats);

        // If chats exist, select the first one by default
        if (retrievedChats.length > 0) {
          setActiveChatId(retrievedChats[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        toast.error('Failed to load chat history');
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages whenever activeChatId changes
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/api/chat/messages/${activeChatId}`);
        setMessages(res.data?.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        toast.error('Failed to load conversation messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  // Setup Socket listeners
  useEffect(() => {
    const socket = connectSocket();

    const handleAiResponse = (data) => {
      // Check if response belongs to current active chat
      if (data.chat === activeChatIdRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            _id: `temp-ai-${Date.now()}`,
            role: 'model',
            content: data.content,
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsGenerating(false);
      }
    };

    const handleAiError = (data) => {
      console.error('Socket ai-error:', data);
      toast.error(data?.message || 'Error generating AI response');
      setIsGenerating(false);
    };

    const handleConnectError = (err) => {
      console.warn('Socket connect error:', err.message);
    };

    socket.on('ai-response', handleAiResponse);
    socket.on('ai-error', handleAiError);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('ai-response', handleAiResponse);
      socket.off('ai-error', handleAiError);
      socket.off('connect_error', handleConnectError);
    };
  }, []);

  // Handle starting a new chat
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setIsGenerating(false);
  };

  // Handle deleting a chat
  const handleDeleteChat = async (chatId) => {
    try {
      await api.delete(`/api/chat/${chatId}`);
      toast.info('Chat deleted');

      setChats((prev) => {
        const updated = prev.filter((c) => c._id !== chatId);
        if (activeChatId === chatId) {
          if (updated.length > 0) {
            setActiveChatId(updated[0]._id);
          } else {
            handleNewChat();
          }
        }
        return updated;
      });
    } catch (err) {
      console.error('Delete chat error:', err);
      toast.error('Failed to delete chat');
    }
  };

  // Helper to generate a concise chat title
  const generateTitle = (text) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 6) return text.trim();
    return words.slice(0, 6).join(' ') + '...';
  };

  // Send message handler
  const handleSendMessage = async (text) => {
    if (!text.trim() || isGenerating) return;

    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    let targetChatId = activeChatId;

    // If no active chat, create one first
    if (!targetChatId) {
      try {
        const title = generateTitle(text);
        const res = await api.post('/api/chat', { title });
        const newChat = res.data?.chat;

        if (newChat?._id) {
          targetChatId = newChat._id;
          setChats((prev) => [newChat, ...prev]);
          setActiveChatId(newChat._id);
        } else {
          throw new Error('Failed to create new chat session');
        }
      } catch (err) {
        console.error('Error creating chat:', err);
        toast.error('Could not create chat session');
        return;
      }
    }

    // Optimistically add user message
    const userMsg = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Emit socket event
    socket.emit('ai-message', {
      chat: targetChatId,
      content: text,
    });
  };

  const activeChat = chats.find((c) => c._id === activeChatId);

  return (
    <div className="chat-app-layout d-flex vh-100 vw-100 overflow-hidden bg-dark">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => setActiveChatId(id)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <main className="chat-main-area d-flex flex-column flex-grow-1 h-100 overflow-hidden bg-dark position-relative">
        {/* Top Navigation Bar */}
        <header className="chat-top-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-secondary border-opacity-25 bg-dark-subtle">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            {/* Sidebar toggle button (mobile & desktop) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-sm btn-outline-secondary border-0 text-light p-2 rounded-3 hover-primary"
              aria-label="Toggle sidebar"
            >
              <i className="bi bi-layout-sidebar fs-5"></i>
            </button>

            {/* Active Chat Title */}
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <span className="fw-semibold text-light text-truncate" style={{ maxWidth: '300px' }}>
                {activeChat ? activeChat.title : 'New conversation'}
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-info-emphasis border border-info border-opacity-25 fw-normal small d-none d-sm-inline-flex align-items-center gap-1">
                <i className="bi bi-activity text-info"></i>
                Pulse AI
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={handleNewChat}
              className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-1 border-secondary border-opacity-25 text-light hover-primary"
              title="Start a new chat"
            >
              <i className="bi bi-plus-lg small"></i>
              <span className="small d-none d-sm-inline">New chat</span>
            </button>
          </div>
        </header>

        {/* Chat Messages or Welcome Screen */}
        <div className="chat-messages-container flex-grow-1 overflow-y-auto d-flex flex-column">
          {loadingMessages ? (
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-secondary">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Loading messages...</span>
              </div>
              <span className="small">Loading conversation history...</span>
            </div>
          ) : !activeChatId && messages.length === 0 ? (
            <WelcomeScreen
              user={user}
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            />
          ) : messages.length === 0 ? (
            <WelcomeScreen
              user={user}
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            />
          ) : (
            <div className="messages-list py-3 w-100 mx-auto" style={{ maxWidth: '860px' }}>
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg._id || index}
                  message={msg}
                  user={user}
                />
              ))}

              {/* Typing / Generating Indicator */}
              {isGenerating && <TypingIndicator />}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Floating Chat Input */}
        <div className="chat-input-sticky-footer">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isGenerating}
            placeholder={
              activeChat
                ? `Message ${activeChat.title}...`
                : 'Ask Pulse anything...'
            }
          />
        </div>
      </main>
    </div>
  );
}
