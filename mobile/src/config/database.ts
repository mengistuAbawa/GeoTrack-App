import * as SQLite from 'expo-sqlite';
import { logger } from './logger';

const TAG = 'Database';

let db: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    db = await SQLite.openDatabaseAsync('geotrack.db');
    logger.info(TAG, 'Database initialized');

    // Create tables
    await createTables();

    return db;
  } catch (error) {
    logger.error(TAG, 'Failed to initialize database', error);
    throw error;
  }
};

const createTables = async () => {
  if (!db) throw new Error('Database not initialized');

  try {
    // Pending locations table for offline sync
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pending_locations (
        id TEXT PRIMARY KEY,
        client_record_id TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accuracy REAL,
        altitude REAL,
        recorded_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        synced BOOLEAN NOT NULL DEFAULT 0
      );
    `);

    // Cached location records
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cached_locations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accuracy REAL,
        altitude REAL,
        recorded_at TEXT NOT NULL,
        received_at TEXT NOT NULL
      );
    `);

    // Cached sharing requests
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cached_sharing_requests (
        id TEXT PRIMARY KEY,
        from_user_id TEXT NOT NULL,
        from_name TEXT,
        from_phone TEXT,
        status TEXT NOT NULL,
        share_history BOOLEAN,
        created_at TEXT NOT NULL
      );
    `);

    // Sync metadata
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sync_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info(TAG, 'Database tables created successfully');
  } catch (error) {
    logger.error(TAG, 'Failed to create tables', error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};

export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
    logger.info(TAG, 'Database closed');
  }
};
