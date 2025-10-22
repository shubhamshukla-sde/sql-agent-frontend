// ============================================
// CHAT INPUT COMPONENT
// ============================================

import React from 'react';
import { Send, Loader2 } from 'lucide-react';

/**
 * Chat input component
 * Handles message input and send functionality
 */
const ChatInput = ({ 
  isConnected, 
  isLoading, 
  inputValue, 
  setInputValue, 
  handleKeyPress, 
  handleSendMessage 
}) => {
  return (
    <div className="border-t px-4 py-3 flex-shrink-0">
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected || isLoading}
          placeholder={isConnected ? "Ask about your database..." : "Connect to database first"}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
        
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || isLoading || !inputValue.trim()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
