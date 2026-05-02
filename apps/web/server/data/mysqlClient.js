import { getMysqlConfig } from '../config/env.js';

let poolPromise = null;
let warnedMissingDriver = false;
let lastMysqlError = '';

export async function getMysqlPool() {
  if (poolPromise) {
    return poolPromise;
  }

  const config = getMysqlConfig();
  if (!config.enabled) {
    lastMysqlError = 'MySQL configuration is incomplete.';
    return null;
  }

  poolPromise = (async () => {
    try {
      const mysql = await import('mysql2/promise');
      const pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      await pool.query('SELECT 1');
      lastMysqlError = '';
      return pool;
    } catch (error) {
      lastMysqlError = error?.message || 'mysql2 is unavailable or the database is unreachable.';
      if (!warnedMissingDriver) {
        console.warn(
          'MySQL fallback to local store:',
          lastMysqlError
        );
        warnedMissingDriver = true;
      }
      return null;
    }
  })();

  return poolPromise;
}

export function getMysqlDebugInfo() {
  const config = getMysqlConfig();

  return {
    enabled: config.enabled,
    host: config.host || '',
    port: config.port,
    database: config.database || '',
    hasUser: Boolean(config.user),
    hasPassword: Boolean(config.password),
    lastError: lastMysqlError || ''
  };
}
