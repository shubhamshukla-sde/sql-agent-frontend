// ============================================
// CUSTOM CONNECTION FORM COMPONENT
// ============================================

import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

/**
 * Custom connection URI form with dropdown examples
 * Allows advanced users to enter complete connection strings
 */
const CustomForm = ({ connectionParams, setConnectionParams }) => {
  const [showDatabaseTypes, setShowDatabaseTypes] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  
  // Database type options
  const databaseTypes = [
    {
      name: 'PostgreSQL',
      icon: '🐘',
      description: 'Open-source relational database',
      template: 'postgresql://username:password@hostname:5432/database'
    },
    {
      name: 'MySQL',
      icon: '🐬',
      description: 'Popular open-source database',
      template: 'mysql+pymysql://username:password@hostname:3306/database'
    },
    {
      name: 'TiDB Cloud',
      icon: '☁️',
      description: 'MySQL-compatible serverless database',
      template: 'mysql+pymysql://username:password@gateway01.region.prod.aws.tidbcloud.com:4000/database?ssl_ca=/path/to/cert.pem'
    },
    {
      name: 'MariaDB',
      icon: '🦭',
      description: 'MySQL fork with enhanced features',
      template: 'mysql+pymysql://username:password@hostname:3306/database'
    },
    {
      name: 'CockroachDB',
      icon: '🪳',
      description: 'Distributed SQL database',
      template: 'postgresql://username:password@hostname:26257/database?sslmode=require'
    },
    {
      name: 'Amazon RDS',
      icon: '☁️',
      description: 'AWS managed database service',
      template: 'postgresql://username:password@instance.region.rds.amazonaws.com:5432/database'
    }
  ];

  // Example connection strings
  const examples = [
    {
      category: 'PostgreSQL',
      icon: '🐘',
      cases: [
        {
          name: 'Local PostgreSQL',
          uri: 'postgresql://postgres:password@localhost:5432/mydb',
          description: 'Standard local connection'
        },
        {
          name: 'Remote PostgreSQL with SSL',
          uri: 'postgresql://user:pass@db.example.com:5432/mydb?sslmode=require',
          description: 'Secure remote connection'
        },
        {
          name: 'Heroku PostgreSQL',
          uri: 'postgresql://user:pass@ec2-xx-xxx-xxx-xx.compute-1.amazonaws.com:5432/dbname',
          description: 'Heroku hosted database'
        }
      ]
    },
    {
      category: 'MySQL',
      icon: '🐬',
      cases: [
        {
          name: 'Local MySQL',
          uri: 'mysql+pymysql://root:password@localhost:3306/mydb',
          description: 'Standard local connection'
        },
        {
          name: 'Remote MySQL',
          uri: 'mysql+pymysql://user:pass@db.example.com:3306/mydb',
          description: 'Remote MySQL server'
        },
        {
          name: 'PlanetScale',
          uri: 'mysql+pymysql://user:pass@aws.connect.psdb.cloud/database?ssl_ca=/etc/ssl/cert.pem',
          description: 'PlanetScale serverless MySQL'
        }
      ]
    },
    {
      category: 'TiDB Cloud',
      icon: '☁️',
      cases: [
        {
          name: 'TiDB Serverless',
          uri: 'mysql+pymysql://user.root:password@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test?ssl_ca=/path/to/ca.pem',
          description: 'TiDB Cloud with SSL'
        }
      ]
    }
  ];

  const handleTemplateSelect = (template) => {
    setConnectionParams({...connectionParams, custom_uri: template});
    setShowDatabaseTypes(false);
  };

  const handleExampleSelect = (uri) => {
    setConnectionParams({...connectionParams, custom_uri: uri});
    setShowExamples(false);
  };

  return (
    <div className="space-y-3">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start space-x-2">
          <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Custom Connection String</p>
            <p className="text-blue-700">Enter a complete connection URI for any database type.</p>
          </div>
        </div>
      </div>

      
      {/* Connection URI textarea */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Connection String (URI)
        </label>
        <textarea
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono resize-none"
          value={connectionParams.custom_uri}
          onChange={(e) => setConnectionParams({...connectionParams, custom_uri: e.target.value})}
          placeholder="postgresql://user:pass@host:5432/dbname"
          rows="3"
        />
        <p className="text-xs text-gray-500 mt-1">
          Edit the connection string with your credentials
        </p>
      </div>
      
      {/* Examples Dropdown with better scrolling */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Examples by Database Type
        </label>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowExamples(!showExamples);
              setShowDatabaseTypes(false); // Close other dropdown
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <span className="text-gray-700 text-xs">View example connection strings...</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
          </button>

          {/* Examples dropdown with max height */}
          {showExamples && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-y-auto">
              {examples.map((category, catIndex) => (
                <div key={catIndex} className="border-b border-gray-200 last:border-b-0">
                  {/* Category header - sticky */}
                  <div className="bg-gray-50 px-3 py-2 sticky top-0 z-10 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{category.icon}</span>
                      <h3 className="text-xs font-semibold text-gray-700">{category.category}</h3>
                    </div>
                  </div>

                  {/* Example cases */}
                  {category.cases.map((example, exIndex) => (
                    <button
                      key={exIndex}
                      type="button"
                      onClick={() => handleExampleSelect(example.uri)}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-900">{example.name}</p>
                        <p className="text-xs text-gray-500">{example.description}</p>
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded block overflow-x-auto whitespace-nowrap">
                          {example.uri}
                        </code>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Click an example to use it as a template
        </p>
      </div>

      {/* Current selection indicator - compact */}
      {connectionParams.custom_uri && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2">
          <p className="text-xs text-green-800 font-medium mb-1">✓ Connection String Set</p>
          <code className="text-xs text-green-700 break-all line-clamp-2">
            {connectionParams.custom_uri}
          </code>
        </div>
      )}
    </div>
  );
};

export default CustomForm;
