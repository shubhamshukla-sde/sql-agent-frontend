// ============================================
// CHAT PANEL COMPONENT
// ============================================

import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
import SuggestedQueries from './SuggestedQueries';
import ChatInput from './ChatInput';
import DocumentUpload from '../DocumentUpload/DocumentUpload';

/**
 * Main chat panel component
 * Combines all chat-related UI elements
 */
const ChatPanel = ({
  isConnected,
  messages,
  isLoading,
  inputValue,
  setInputValue,
  handleKeyPress,
  handleSendMessage,
  clearChat,
  suggestedQueries
}) => {
  return (
    <div className="bg-white rounded-lg shadow flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Chat header with clear button and document upload */}
      <div className="border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold">Chat</h2>
        
        <div className="flex items-center space-x-2">
          {/* NEW: Document Upload Button */}
          <DocumentUpload isConnected={isConnected} />
          
          {/* Clear button */}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-gray-500 hover:text-red-600 flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <EmptyState isConnected={isConnected} />
        ) : (
          messages.map((message, idx) => (
            <ChatMessage key={idx} message={message} />
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested queries */}
      {isConnected && messages.length === 0 && (
        <SuggestedQueries 
          suggestedQueries={suggestedQueries} 
          setInputValue={setInputValue} 
        />
      )}

      {/* Input area */}
      <ChatInput
        isConnected={isConnected}
        isLoading={isLoading}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatPanel;
