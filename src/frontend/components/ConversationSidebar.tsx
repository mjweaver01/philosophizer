import React, { useState } from 'react';
import type { Conversation } from '../hooks/useConversations';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
}

export function ConversationSidebar({
  conversations,
  currentConversation,
  isOpen,
  onClose,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditTitle('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-surface border-r border-border z-50 transform transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-text">Conversations</h2>
            <div className="flex items-center gap-2">
              {/* New Conversation Button */}
              <button
                onClick={() => {
                  onNewConversation();
                  onClose();
                }}
                className="flex items-center justify-center p-2 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                title="New conversation"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {/* Close Button (mobile only) */}
              <button
                onClick={onClose}
                className="flex items-center justify-center p-2 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                title="Close sidebar"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-text-muted text-sm">
                No conversations yet
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`group relative rounded-lg transition-colors ${
                      currentConversation?.id === conversation.id
                        ? 'bg-surface-secondary'
                        : 'hover:bg-surface-secondary'
                    }`}
                  >
                    {editingId === conversation.id ? (
                      <div className="p-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="w-full px-2 py-1 text-sm bg-background border border-border rounded text-text focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectConversation(conversation.id);
                          onClose();
                        }}
                        className="w-full text-left p-2 pr-16 cursor-pointer"
                      >
                        <div className="text-sm text-text truncate">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {formatDate(conversation.updatedAt)}
                        </div>
                      </button>
                    )}

                    {/* Action buttons */}
                    {editingId !== conversation.id && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleStartEdit(conversation);
                          }}
                          className="p-1.5 text-text-muted hover:text-text rounded hover:bg-background"
                          title="Rename"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (
                              confirm(
                                'Are you sure you want to delete this conversation?'
                              )
                            ) {
                              onDeleteConversation(conversation.id);
                            }
                          }}
                          className="p-1.5 text-text-muted hover:text-error rounded hover:bg-background"
                          title="Delete"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
