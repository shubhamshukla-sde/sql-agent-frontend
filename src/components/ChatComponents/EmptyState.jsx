// ============================================
// EMPTY STATE COMPONENT
// ============================================

import React from 'react';
import { Database } from 'lucide-react';

/**
 * Empty state component for chat area
 * Displayed when no messages exist
 */
const EmptyState = ({ isConnected }) => {
  return (
    <div className="text-center text-gray-500 mt-20">
      <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-lg mb-2">No messages yet</p>
      <p className="text-sm">
        {isConnected 
          ? "Ask questions about your database" 
          : "Connect to a database to get started"}
      </p>
    </div>
  );
};

export default EmptyState;
