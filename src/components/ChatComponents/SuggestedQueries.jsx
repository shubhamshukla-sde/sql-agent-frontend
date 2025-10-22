// ============================================
// SUGGESTED QUERIES COMPONENT
// ============================================

import React from 'react';

/**
 * Suggested queries component
 * Displays clickable query suggestions for the connected database
 */
const SuggestedQueries = ({ suggestedQueries, setInputValue }) => {
  if (suggestedQueries.length === 0) return null;

  return (
    <div className="px-4 py-2 border-t bg-gray-50 flex-shrink-0">
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
  );
};

export default SuggestedQueries;
