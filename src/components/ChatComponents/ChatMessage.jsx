// ============================================
// CHAT MESSAGE COMPONENT
// ============================================

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Code, Copy, Check } from 'lucide-react';

/**
 * Individual chat message component
 * Renders message with markdown support and optional SQL query with copy functionality
 */
const ChatMessage = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Copies SQL query to clipboard
   */
  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(message.sql_query);
      setIsCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy SQL query:', error);
    }
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg px-4 py-3 ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : message.role === 'error'
            ? 'bg-red-50 text-red-900 border border-red-200'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {/* Message content with markdown */}
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
        
        {/* Collapsible SQL query with copy button */}
        {message.sql_query && (
          <details className="mt-3 cursor-pointer group">
            <summary className="text-sm opacity-75 flex items-center space-x-1 hover:opacity-100">
              <Code className="w-4 h-4" />
              <span>View SQL Query</span>
            </summary>
            
            {/* SQL query container with copy button */}
            <div className="mt-2 relative">
              {/* Copy button - positioned in top right */}
              <button
                onClick={handleCopySQL}
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors z-10"
                title={isCopied ? "Copied!" : "Copy SQL"}
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              
              {/* SQL query code block */}
              <pre className="text-xs bg-gray-800 text-green-400 p-3 pr-12 rounded overflow-x-auto">
                <code>{message.sql_query}</code>
              </pre>
              
              {/* Copied confirmation tooltip */}
              {isCopied && (
                <div className="absolute top-2 right-14 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                  Copied!
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
