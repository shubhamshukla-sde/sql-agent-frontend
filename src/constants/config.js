// ============================================
// APPLICATION CONFIGURATION
// ============================================

export const API_BASE_URL = 'http://localhost:8000';

export const DB_TYPES = {
  SQLITE: 'sqlite',
  POSTGRESQL: 'postgresql',
  MYSQL: 'mysql',
  CUSTOM: 'custom'
};

export const MODEL_OPTIONS = [
  { value: 'sonar', label: 'Sonar (Fast)' },
  { value: 'sonar-pro', label: 'Sonar Pro (Recommended)' },
  { value: 'sonar-reasoning', label: 'Sonar Reasoning' },
  { value: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro' }
];

export const INITIAL_CONNECTION_PARAMS = {
  // SQLite
  sqlite_file: 'complex_test.db',
  // PostgreSQL
  pg_host: 'localhost',
  pg_port: '5432',
  pg_database: '',
  pg_username: '',
  pg_password: '',
  pg_ssl_ca: '',
  // MySQL
  mysql_host: 'localhost',
  mysql_port: '3306',
  mysql_database: '',
  mysql_username: '',
  mysql_password: '',
  mysql_ssl_ca: '',
  // Custom
  custom_uri: ''
};
