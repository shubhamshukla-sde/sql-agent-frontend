// ============================================
// SQLITE CONNECTION FORM COMPONENT
// ============================================

import React from 'react';

/**
 * SQLite database connection form
 * Allows selecting from pre-loaded database files
 */
const SQLiteForm = ({ connectionParams, setConnectionParams }) => {
  return (
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
  );
};

export default SQLiteForm;
