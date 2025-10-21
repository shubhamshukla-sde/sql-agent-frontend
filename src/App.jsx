import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Database, 
  Send, 
  Loader2, 
  CheckCircle2,
  Trash2,
  Code,
  Globe
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const API_BASE_URL = 'http://localhost:8000';


function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [detectedDialect, setDetectedDialect] = useState(null);
  const [dbType, setDbType] = useState('sqlite');
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  
  const [connectionParams, setConnectionParams] = useState({
    // SQLite
    sqlite_file: 'complex_test.db',
    // PostgreSQL
    pg_host: 'localhost',
    pg_port: '5432',
    pg_database: '',
    pg_username: '',
    pg_password: '',
    pg_ssl_ca: '', // Added SSL support
    // MySQL
    mysql_host: 'localhost',
    mysql_port: '3306',
    mysql_database: '',
    mysql_username: '',
    mysql_password: '',
    mysql_ssl_ca: '', // Added SSL support
    // Custom/Remote
    custom_uri: ''
  });


  const [modelConfig, setModelConfig] = useState(() => {
    const saved = localStorage.getItem('sql-agent-model');
    return saved || 'sonar-pro';
  });


  useEffect(() => {
    localStorage.setItem('sql-agent-model', modelConfig);
  }, [modelConfig]);


  const buildConnectionURI = () => {
    switch(dbType) {
      case 'sqlite':
        return `sqlite:///${connectionParams.sqlite_file}`;
      case 'postgresql':
        const pgUri = `postgresql://${connectionParams.pg_username}:${connectionParams.pg_password}@${connectionParams.pg_host}:${connectionParams.pg_port}/${connectionParams.pg_database}`;
        // Add SSL if certificate path provided
        return connectionParams.pg_ssl_ca ? `${pgUri}?sslmode=require` : pgUri;
      case 'mysql':
        const mysqlUri = `mysql+pymysql://${connectionParams.mysql_username}:${connectionParams.mysql_password}@${connectionParams.mysql_host}:${connectionParams.mysql_port}/${connectionParams.mysql_database}`;
        // Add SSL certificate path if provided
        return connectionParams.mysql_ssl_ca ? `${mysqlUri}?ssl_ca=${encodeURIComponent(connectionParams.mysql_ssl_ca)}` : mysqlUri;
      case 'custom':
        return connectionParams.custom_uri;
      default:
        return '';
    }
  };


  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const db_uri = buildConnectionURI();
      const response = await axios.post(`${API_BASE_URL}/api/connect`, {
        db_uri,
        model: modelConfig
      });
      setIsConnected(true);
      setTables(response.data.tables);
      setDetectedDialect(response.data.dialect);
      
      // Fetch dynamic suggestions based on connected database
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


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const clearChat = () => {
    setMessages([]);
  };


  const handleDisconnect = () => {
    setIsConnected(false);
    setTables([]);
    setMessages([]);
    setDetectedDialect(null);
    setSuggestedQueries([]);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SQL AI Agent</h1>
              </div>
            </div>
            {isConnected && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {detectedDialect ? `${detectedDialect.toUpperCase()} Connected` : 'Connected'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>


      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">
                {isConnected ? 'Connection Info' : 'Database Connection'}
              </h2>
              
              {!isConnected ? (
                <div className="space-y-4">
                  {/* Database Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Database Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDbType('sqlite')}
                        className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          dbType === 'sqlite'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        SQLite
                      </button>
                      <button
                        onClick={() => setDbType('postgresql')}
                        className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          dbType === 'postgresql'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Postgres
                      </button>
                      <button
                        onClick={() => setDbType('mysql')}
                        className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          dbType === 'mysql'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        MySQL
                      </button>
                      <button
                        onClick={() => setDbType('custom')}
                        className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center justify-center space-x-1 ${
                          dbType === 'custom'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Custom</span>
                      </button>
                    </div>
                  </div>


                  {/* SQLite Connection */}
                  {dbType === 'sqlite' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Database File
                        </label>
                        <select
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.sqlite_file}
                          onChange={(e) => setConnectionParams({...connectionParams, sqlite_file: e.target.value})}
                        >
                          <option value="complex_test.db">complex_test.db (17 tables)</option>
                          <option value="test.db">test.db (3 tables)</option>
                          <option value="chinook.db">chinook.db (Music DB)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Select a pre-loaded SQLite database
                        </p>
                      </div>
                    </div>
                  )}


                  {/* PostgreSQL Connection */}
                  {dbType === 'postgresql' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          HOST
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.pg_host}
                          onChange={(e) => setConnectionParams({...connectionParams, pg_host: e.target.value})}
                          placeholder="localhost or remote host"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          PORT
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.pg_port}
                          onChange={(e) => setConnectionParams({...connectionParams, pg_port: e.target.value})}
                          placeholder="5432"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          DATABASE
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.pg_database}
                          onChange={(e) => setConnectionParams({...connectionParams, pg_database: e.target.value})}
                          placeholder="mydatabase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          USERNAME
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.pg_username}
                          onChange={(e) => setConnectionParams({...connectionParams, pg_username: e.target.value})}
                          placeholder="postgres"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          PASSWORD
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.pg_password}
                          onChange={(e) => setConnectionParams({...connectionParams, pg_password: e.target.value})}
                          placeholder="••••••••"
                        />
                      </div>
                      {/* NEW: SSL Certificate Support */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          CA (SSL Certificate Path)
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                          value={connectionParams.pg_ssl_ca}
                          onChange={(e) => setConnectionParams({...connectionParams, pg_ssl_ca: e.target.value})}
                          placeholder="/etc/ssl/cert.pem (optional)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Optional: Path to SSL CA certificate for secure connection
                        </p>
                      </div>
                    </div>
                  )}


                  {/* MySQL Connection with SSL Support */}
                  {dbType === 'mysql' && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-2">
                        <p className="text-xs text-blue-800">
                          💡 Supports MySQL, MariaDB, and TiDB Cloud connections
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          HOST
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.mysql_host}
                          onChange={(e) => setConnectionParams({...connectionParams, mysql_host: e.target.value})}
                          placeholder="gateway01.region.prod.aws.tidbcloud.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          PORT
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.mysql_port}
                          onChange={(e) => setConnectionParams({...connectionParams, mysql_port: e.target.value})}
                          placeholder="3306 (MySQL) or 4000 (TiDB)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          DATABASE
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.mysql_database}
                          onChange={(e) => setConnectionParams({...connectionParams, mysql_database: e.target.value})}
                          placeholder="classicmodels"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          USERNAME
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                          value={connectionParams.mysql_username}
                          onChange={(e) => setConnectionParams({...connectionParams, mysql_username: e.target.value})}
                          placeholder="NQ64HDJzFPN3xH6.root"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          PASSWORD
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={connectionParams.mysql_password}
                          onChange={(e) => setConnectionParams({...connectionParams, mysql_password: e.target.value})}
                          placeholder="••••••••"
                        />
                      </div>
                      {/* NEW: SSL Certificate Support for MySQL/TiDB */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          CA (SSL Certificate Path)
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                          value={connectionParams.mysql_ssl_ca}
                          onChange={(e) => setConnectionParams({...connectionParams, mysql_ssl_ca: e.target.value})}
                          placeholder="/etc/ssl/cert.pem"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Path to SSL CA certificate (required for TiDB Cloud)
                        </p>
                      </div>
                      
                      {connectionParams.mysql_ssl_ca && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-2">
                          <p className="text-xs text-green-800 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>SSL/TLS enabled - Secure connection</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}


                  {/* Custom/Remote Connection */}
                  {dbType === 'custom' && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <div className="flex items-start space-x-2">
                          <Globe className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="text-xs text-blue-800">
                            <p className="font-medium mb-1">Custom Connection String</p>
                            <p className="text-blue-700">Enter a complete connection URI for any database type.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Connection String (URI)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                          value={connectionParams.custom_uri}
                          onChange={(e) => setConnectionParams({...connectionParams, custom_uri: e.target.value})}
                          placeholder="postgresql://user:pass@host:5432/dbname"
                          rows="3"
                        />
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">Examples:</p>
                        <div className="space-y-1 text-xs text-gray-600 font-mono">
                          <div className="bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                            postgresql://user:pass@db.example.com:5432/mydb
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                            mysql+pymysql://user:pass@db.example.com:3306/mydb
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200 overflow-x-auto text-xs">
                            mysql+pymysql://user:pass@host:4000/db?ssl_ca=/path/cert.pem
                          </div>
                        </div>
                      </div>
                    </div>
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
                      <option value="sonar">Sonar (Fast)</option>
                      <option value="sonar-pro">Sonar Pro (Recommended)</option>
                      <option value="sonar-reasoning">Sonar Reasoning</option>
                      <option value="sonar-reasoning-pro">Sonar Reasoning Pro</option>
                    </select>
                  </div>


                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
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
              ) : (
                <div className="space-y-4">
                  {/* Connected State */}
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center space-x-2 text-green-700 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                    <div className="text-xs space-y-1 text-gray-600">
                      <div><span className="font-medium">Type:</span> {detectedDialect?.toUpperCase()}</div>
                      <div><span className="font-medium">Model:</span> {modelConfig}</div>
                      <div><span className="font-medium">Tables:</span> {tables.length}</div>
                    </div>
                  </div>


                  <button
                    onClick={handleDisconnect}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>


                  {tables.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Tables ({tables.length})
                      </h3>
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {tables.map((table, idx) => (
                          <div key={idx} className="text-xs bg-gray-50 px-2 py-1.5 rounded border border-gray-200">
                            {table}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-180px)]">
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Chat</h2>
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


              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No messages yet</p>
                    <p className="text-sm">
                      {isConnected 
                        ? "Ask questions about your database" 
                        : "Connect to a database to get started"}
                    </p>
                  </div>
                ) : (
                  messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.role === 'error'
                            ? 'bg-red-50 text-red-900 border border-red-200'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({node, ...props}) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props} />
                                </div>
                              ),
                              thead: ({node, ...props}) => (
                                <thead className="bg-gray-50" {...props} />
                              ),
                              th: ({node, ...props}) => (
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300" {...props} />
                              ),
                              td: ({node, ...props}) => (
                                <td className="px-3 py-2 text-sm text-gray-900 border-b border-gray-200" {...props} />
                              ),
                              tr: ({node, ...props}) => (
                                <tr className="hover:bg-gray-50" {...props} />
                              ),
                              p: ({node, ...props}) => (
                                <p className="mb-2 last:mb-0" {...props} />
                              ),
                              ul: ({node, ...props}) => (
                                <ul className="list-disc list-inside space-y-1 my-2" {...props} />
                              ),
                              ol: ({node, ...props}) => (
                                <ol className="list-decimal list-inside space-y-1 my-2" {...props} />
                              ),
                              strong: ({node, ...props}) => (
                                <strong className="font-bold text-blue-700" {...props} />
                              ),
                              h3: ({node, ...props}) => (
                                <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        
                        {message.sql_query && (
                          <details className="mt-3 cursor-pointer">
                            <summary className="text-sm opacity-75 flex items-center space-x-1 hover:opacity-100">
                              <Code className="w-4 h-4" />
                              <span>View SQL Query</span>
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                              <code>{message.sql_query}</code>
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                    </div>
                  </div>
                )}
              </div>


              {isConnected && messages.length === 0 && suggestedQueries.length > 0 && (
                <div className="px-6 py-3 border-t bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">
                    💡 Suggested queries for this database:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputValue(query)}
                        className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}


              <div className="border-t px-6 py-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected || isLoading}
                    placeholder={isConnected ? "Ask about your database..." : "Connect to database first"}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || isLoading || !inputValue.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
