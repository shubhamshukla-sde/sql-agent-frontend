// ============================================
// CONNECTION SIDEBAR COMPONENT
// ============================================

import React from 'react';
import { Database, Globe, Loader2 } from 'lucide-react';
import { DB_TYPES, MODEL_OPTIONS } from '../constants/config';
import SQLiteForm from './ConnectionForms/SQLiteForm';
import PostgreSQLForm from './ConnectionForms/PostgreSQLForm';
import MySQLForm from './ConnectionForms/MySQLForm';
import CustomForm from './ConnectionForms/CustomForm';

/**
 * Sidebar component for database connection management
 * Renders appropriate form based on selected database type
 * Height-matched with chat panel for consistent layout
 */
const ConnectionSidebar = ({
  isConnecting,
  dbType,
  setDbType,
  connectionParams,
  setConnectionParams,
  modelConfig,
  setModelConfig,
  handleConnect
}) => {
  return (
    <div className="lg:col-span-1">
      {/* Fixed height container matching chat panel */}
      <div 
        className="bg-white rounded-lg shadow flex flex-col" 
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {/* Header - Fixed at top */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">
            Database Connection
          </h2>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Database Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Type
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDbType(DB_TYPES.SQLITE)}
                  className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dbType === DB_TYPES.SQLITE
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  SQLite
                </button>
                
                <button
                  onClick={() => setDbType(DB_TYPES.POSTGRESQL)}
                  className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dbType === DB_TYPES.POSTGRESQL
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Postgres
                </button>
                
                <button
                  onClick={() => setDbType(DB_TYPES.MYSQL)}
                  className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dbType === DB_TYPES.MYSQL
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  MySQL
                </button>
                
                <button
                  onClick={() => setDbType(DB_TYPES.CUSTOM)}
                  className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center justify-center space-x-1 ${
                    dbType === DB_TYPES.CUSTOM
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Custom</span>
                </button>
              </div>
            </div>

            {/* Dynamic Connection Form */}
            {dbType === DB_TYPES.SQLITE && (
              <SQLiteForm 
                connectionParams={connectionParams} 
                setConnectionParams={setConnectionParams} 
              />
            )}
            
            {dbType === DB_TYPES.POSTGRESQL && (
              <PostgreSQLForm 
                connectionParams={connectionParams} 
                setConnectionParams={setConnectionParams} 
              />
            )}
            
            {dbType === DB_TYPES.MYSQL && (
              <MySQLForm 
                connectionParams={connectionParams} 
                setConnectionParams={setConnectionParams} 
              />
            )}
            
            {dbType === DB_TYPES.CUSTOM && (
              <CustomForm 
                connectionParams={connectionParams} 
                setConnectionParams={setConnectionParams} 
              />
            )}

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                LLM Model
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={modelConfig}
                onChange={(e) => setModelConfig(e.target.value)}
              >
                {MODEL_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Connect Button - Fixed at bottom */}
        <div className="px-6 py-4 border-t flex-shrink-0">
          <button
            onClick={() => handleConnect(dbType, connectionParams)}
            disabled={isConnecting}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span>Connect to Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionSidebar;
