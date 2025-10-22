// ============================================
// HEADER COMPONENT
// ============================================

import React from 'react';
import { Database, CheckCircle2, Info, Trash2 } from 'lucide-react';

/**
 * Application header with branding and connection status
 * Shows database connection details in a hover tooltip
 */
const Header = ({ 
  isConnected, 
  detectedDialect, 
  modelConfig, 
  tables, 
  dbType, 
  connectionParams,
  handleDisconnect 
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Application branding */}
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SQL AI Agent</h1>
            </div>
          </div>
          
          {/* Connection status with info tooltip */}
          {isConnected && (
            <div className="flex items-center space-x-2 text-green-600 relative group">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                {detectedDialect ? `${detectedDialect.toUpperCase()} Connected` : 'Connected'}
              </span>
              
              {/* Info icon with hover tooltip */}
              <div className="relative">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                
                {/* Hover tooltip card */}
                <div className="absolute right-0 top-8 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {/* Tooltip arrow */}
                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                  
                  {/* Connection details */}
                  <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
                    <Database className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Connection Details</h3>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Database Type:</span>
                      <span className="text-gray-900 font-semibold">{detectedDialect?.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">LLM Model:</span>
                      <span className="text-gray-900">{modelConfig}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Total Tables:</span>
                      <span className="text-gray-900 font-semibold">{tables.length}</span>
                    </div>
                    
                    {/* SSL status */}
                    {(dbType === 'mysql' && connectionParams.mysql_ssl_ca) || 
                     (dbType === 'postgresql' && connectionParams.pg_ssl_ca) ? (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-gray-500 font-medium">SSL/TLS:</span>
                        <span className="text-green-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Enabled</span>
                        </span>
                      </div>
                    ) : null}
                  </div>
                  
                  {/* Tables list */}
                  {tables.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">Tables</span>
                        <span className="text-xs text-gray-500">({tables.length})</span>
                      </div>
                      
                      <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                        {tables.map((table, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 font-mono text-gray-700"
                          >
                            {table}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Disconnect button */}
                  <button
                    onClick={handleDisconnect}
                    className="w-full mt-3 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-md flex items-center justify-center space-x-2 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
