import Database from 'better-sqlite3';
import { join } from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || join(__dirname, '../data/todos.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DATABASE_PATH);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

function initializeSchema(): void {
  const database = db!;
  
  database.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at)
  `);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
