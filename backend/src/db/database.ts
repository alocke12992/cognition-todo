import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync } from 'fs';
import { initializeSchema } from './schema';

const DEFAULT_DB_PATH = join(__dirname, '../data/todos.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || DEFAULT_DB_PATH;
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeSchema(db);
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function isDatabaseInitialized(): boolean {
  const dbPath = process.env.DATABASE_PATH || DEFAULT_DB_PATH;
  return existsSync(dbPath);
}

export function getDatabasePath(): string {
  return process.env.DATABASE_PATH || DEFAULT_DB_PATH;
}
