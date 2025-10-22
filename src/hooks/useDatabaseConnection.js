// ============================================
// CUSTOM HOOK - Database Connection Logic
// ============================================

import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

/**
 * Custom hook for managing database connection state and operations
 * Handles connection, disconnection, and related state management
 */
export const useDatabaseConnection = (modelConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tables, setTables] = useState([]);
  const [detectedDialect, setDetectedDialect] = useState(null);
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  const [messages, setMessages] = useState([]);

  /**
   * Builds connection URI based on database type and parameters
   */
  const buildConnectionURI = (dbType, connectionParams) => {
    switch(dbType) {
      case 'sqlite':
        return `sqlite:///${connectionParams.sqlite_file}`;
      
      case 'postgresql': {
        const pgUri = `postgresql://${connectionParams.pg_username}:${connectionParams.pg_password}@${connectionParams.pg_host}:${connectionParams.pg_port}/${connectionParams.pg_database}`;
        return connectionParams.pg_ssl_ca ? `${pgUri}?sslmode=require` : pgUri;
      }
      
      case 'mysql': {
        const mysqlUri = `mysql+pymysql://${connectionParams.mysql_username}:${connectionParams.mysql_password}@${connectionParams.mysql_host}:${connectionParams.mysql_port}/${connectionParams.mysql_database}`;
        return connectionParams.mysql_ssl_ca 
          ? `${mysqlUri}?ssl_ca=${encodeURIComponent(connectionParams.mysql_ssl_ca)}` 
          : mysqlUri;
      }
      
      case 'custom':
        return connectionParams.custom_uri;
      
      default:
        return '';
    }
  };

  /**
   * Establishes connection to database
   */
  const handleConnect = async (dbType, connectionParams) => {
    setIsConnecting(true);
    
    try {
      const db_uri = buildConnectionURI(dbType, connectionParams);
      
      const response = await axios.post(`${API_BASE_URL}/api/connect`, {
        db_uri,
        model: modelConfig
      });
      
      setIsConnected(true);
      setTables(response.data.tables);
      setDetectedDialect(response.data.dialect);
      
      try {
        const suggestionsResponse = await axios.get(`${API_BASE_URL}/api/suggestions`);
        if (suggestionsResponse.data.success) {
          setSuggestedQueries(suggestionsResponse.data.suggestions);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestedQueries([]);
      }
      
      setMessages([{ 
        role: 'assistant', 
        content: `✅ Connected to **${response.data.dialect.toUpperCase()}** database! Found ${response.data.tables.length} tables.`, 
        timestamp: new Date() 
      }]);
      
    } catch (error) {
      setMessages([{ 
        role: 'error', 
        content: `❌ Connection failed: ${error.response?.data?.detail || error.message}`, 
        timestamp: new Date() 
      }]);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnects from database and resets state
   */
  const handleDisconnect = () => {
    setIsConnected(false);
    setTables([]);
    setMessages([]);
    setDetectedDialect(null);
    setSuggestedQueries([]);
  };

  return {
    isConnected,
    isConnecting,
    tables,
    detectedDialect,
    suggestedQueries,
    messages,
    setMessages,
    handleConnect,
    handleDisconnect
  };
};
