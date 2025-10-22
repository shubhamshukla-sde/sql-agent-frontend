// ============================================
// POSTGRESQL CONNECTION FORM COMPONENT
// ============================================

import React from 'react';

/**
 * PostgreSQL database connection form
 * Collects host, port, database, credentials, and SSL certificate
 */
const PostgreSQLForm = ({ connectionParams, setConnectionParams }) => {
  return (
    <div className="space-y-3">
      {/* Host */}
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
      
      {/* Port */}
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
      
      {/* Database */}
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
      
      {/* Username */}
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
      
      {/* Password */}
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
      
      {/* SSL Certificate */}
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
  );
};

export default PostgreSQLForm;
