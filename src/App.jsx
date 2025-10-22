// ============================================
// MAIN APPLICATION COMPONENT
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ConnectionSidebar from './components/ConnectionSidebar';
import ChatPanel from './components/ChatComponents/ChatPanel';
import { useDatabaseConnection } from './hooks/useDatabaseConnection';
import { INITIAL_CONNECTION_PARAMS, DB_TYPES, API_BASE_URL } from './constants/config';


/**
 * Main application componenth
 * Orchestrates all components and manages global state
 */
function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [dbType, setDbType] = useState(DB_TYPES.SQLITE);
  const [connectionParams, setConnectionParams] = useState(INITIAL_CONNECTION_PARAMS);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Model configuration with localStorage persistence
  const [modelConfig, setModelConfig] = useState(() => {
    const saved = localStorage.getItem('sql-agent-model');
    return saved || 'sonar-pro';
  });

  useEffect(() => {
    localStorage.setItem('sql-agent-model', modelConfig);
  }, [modelConfig]);

  // Database connection hook
  const {
    isConnected,
    isConnecting,
    tables,
    detectedDialect,
    suggestedQueries,
    messages,
    setMessages,
    handleConnect,
    handleDisconnect
  } = useDatabaseConnection(modelConfig);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Handles sending a user query to the AI agent
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/query`, {
        query: currentQuery
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        sql_query: response.data.sql_query,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'error',
        content: `❌ Error: ${error.response?.data?.error || error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles Enter key press to send message
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Clears all chat messages
   */
  const clearChat = () => {
    setMessages([]);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        isConnected={isConnected}
        detectedDialect={detectedDialect}
        modelConfig={modelConfig}
        tables={tables}
        dbType={dbType}
        connectionParams={connectionParams}
        handleDisconnect={handleDisconnect}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Connection sidebar (only shown when not connected) */}
          {!isConnected && (
            <ConnectionSidebar
              isConnecting={isConnecting}
              dbType={dbType}
              setDbType={setDbType}
              connectionParams={connectionParams}
              setConnectionParams={setConnectionParams}
              modelConfig={modelConfig}
              setModelConfig={setModelConfig}
              handleConnect={handleConnect}
            />
          )}

          {/* Chat panel */}
          <div className={isConnected ? "lg:col-span-4" : "lg:col-span-3"}>
            <ChatPanel
              isConnected={isConnected}
              messages={messages}
              isLoading={isLoading}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleKeyPress={handleKeyPress}
              handleSendMessage={handleSendMessage}
              clearChat={clearChat}
              suggestedQueries={suggestedQueries}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
