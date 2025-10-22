// ============================================
// MYSQL CONNECTION FORM COMPONENT
// ============================================

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * MySQL/MariaDB/TiDB connection form
 * Supports MySQL, MariaDB, and TiDB Cloud connections with SSL
 */
const MySQLForm = ({ connectionParams, setConnectionParams }) => {
  return (
    <div className="space-y-3">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-2">
        <p className="text-xs text-blue-800">
          💡 Supports MySQL, MariaDB, and TiDB Cloud connections
        </p>
      </div>
      
      {/* Host */}
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
      
      {/* Port */}
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
      
      {/* Database */}
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
      
      {/* Username */}
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
      
      {/* Password */}
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
      
      {/* SSL Certificate */}
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
      
      {/* SSL status indicator */}
      {connectionParams.mysql_ssl_ca && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2">
          <p className="text-xs text-green-800 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>SSL/TLS enabled - Secure connection</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MySQLForm;
