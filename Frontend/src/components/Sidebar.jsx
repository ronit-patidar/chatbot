import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onCloseMobile,
}) {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((c) =>
    (c.title || 'Untitled Chat').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserInitials = () => {
    if (user?.fullName?.firstName) {
      const first = user.fullName.firstName[0]?.toUpperCase() || '';
      const last = user.fullName.lastName ? user.fullName.lastName[0]?.toUpperCase() : '';
      return `${first}${last}` || 'U';
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.fullName?.firstName) {
      return `${user.fullName.firstName} ${user.fullName.lastName || ''}`.trim();
    }
    return user?.email || 'User';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop d-md-none position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar d-flex flex-column bg-dark border-end border-secondary border-opacity-25 transition-all ${
          isOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}
        style={{
          width: '270px',
          height: '100vh',
          zIndex: 1045,
        }}
      >
        {/* Top Header */}
        <div className="sidebar-header p-3 pb-2 d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-10">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-3 p-1 d-flex align-items-center justify-content-center"
              style={{
                width: '30px',
                height: '30px',
                background: 'linear-gradient(135deg, #10a37f 0%, #2563eb 100%)',
              }}
            >
              <i className="bi bi-activity text-white small"></i>
            </div>
            <span className="fw-bold text-light tracking-wide">Pulse</span>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="btn btn-sm btn-link text-secondary p-1 d-md-none"
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3 pb-2">
          <button
            type="button"
            onClick={onNewChat}
            className="btn btn-outline-secondary w-100 py-2 px-3 rounded-3 text-start d-flex align-items-center justify-content-between text-light bg-dark-subtle border-secondary border-opacity-25 hover-primary transition-all new-chat-btn shadow-sm"
          >
            <span className="d-flex align-items-center gap-2">
              <i className="bi bi-plus-lg fs-6 text-info"></i>
              <span className="small fw-semibold">New chat</span>
            </span>
            <i className="bi bi-chat-square-text text-secondary opacity-50 small"></i>
          </button>
        </div>

        {/* Search Input for Chats */}
        {chats.length > 3 && (
          <div className="px-3 pb-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark-subtle border-secondary border-opacity-25 text-secondary">
                <i className="bi bi-search small"></i>
              </span>
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control form-control-sm bg-dark-subtle border-secondary border-opacity-25 text-light shadow-none"
              />
            </div>
          </div>
        )}

        {/* Chats History List */}
        <div className="sidebar-chat-list flex-grow-1 overflow-y-auto px-2 py-2">
          <div className="text-secondary text-uppercase px-2 mb-2 fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            Recent Chats
          </div>

          {filteredChats.length === 0 ? (
            <div className="text-center text-secondary small py-4 opacity-75">
              <i className="bi bi-chat-dots fs-4 d-block mb-1 opacity-50"></i>
              {searchTerm ? 'No chats found' : 'No chats yet'}
            </div>
          ) : (
            <div className="d-flex flex-column gap-1">
              {filteredChats.map((chat) => {
                const isActive = chat._id === activeChatId;
                return (
                  <div
                    key={chat._id}
                    className={`chat-item-wrapper rounded-3 position-relative d-flex align-items-center group ${
                      isActive
                        ? 'bg-secondary bg-opacity-25 text-light fw-medium active-chat-item'
                        : 'text-secondary hover-chat-item'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectChat(chat._id);
                        if (window.innerWidth < 768) {
                          onCloseMobile();
                        }
                      }}
                      className="btn btn-sm btn-link text-decoration-none text-start text-truncate w-100 py-2 ps-3 pe-5 text-reset d-flex align-items-center gap-2"
                      title={chat.title || 'Untitled Chat'}
                    >
                      <i className={`bi bi-chat-text small ${isActive ? 'text-info' : 'text-secondary'}`}></i>
                      <span className="text-truncate">{chat.title || 'Untitled Chat'}</span>
                    </button>

                    {/* Delete chat button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id);
                      }}
                      className="btn btn-sm btn-link text-secondary p-1 delete-chat-btn position-absolute end-0 me-2"
                      title="Delete chat"
                    >
                      <i className="bi bi-trash small"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User Profile & Logout Footer */}
        <div className="sidebar-footer p-3 border-top border-secondary border-opacity-25 bg-dark-subtle mt-auto">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
                style={{
                  width: '34px',
                  height: '34px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                  fontSize: '0.8rem',
                }}
              >
                {getUserInitials()}
              </div>
              <div className="overflow-hidden">
                <div className="small fw-semibold text-light text-truncate" title={getDisplayName()}>
                  {getDisplayName()}
                </div>
                <div className="text-secondary small text-truncate" style={{ fontSize: '0.72rem' }} title={user?.email}>
                  {user?.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="btn btn-sm btn-outline-danger border-0 p-1 rounded-2 flex-shrink-0"
              title="Log out"
            >
              <i className="bi bi-box-arrow-right fs-6"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
