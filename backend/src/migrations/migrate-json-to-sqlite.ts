import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getDatabase, isDatabaseInitialized, getDatabasePath } from '../db/database';
import { Todo } from '../models/Todo';

const JSON_FILE = join(__dirname, '../data/todos.json');

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  skippedCount: number;
  errors: string[];
}

export function migrateJsonToSqlite(): MigrationResult {
  const result: MigrationResult = {
    success: true,
    migratedCount: 0,
    skippedCount: 0,
    errors: []
  };

  if (!existsSync(JSON_FILE)) {
    console.log('No JSON file found at', JSON_FILE, '- skipping migration');
    return result;
  }

  let todos: Todo[];
  try {
    const data = readFileSync(JSON_FILE, 'utf-8');
    todos = JSON.parse(data);
  } catch (error) {
    result.success = false;
    result.errors.push(`Failed to read JSON file: ${error}`);
    return result;
  }

  if (!Array.isArray(todos) || todos.length === 0) {
    console.log('No todos found in JSON file - skipping migration');
    return result;
  }

  const db = getDatabase();

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO todos (id, title, description, completed, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const checkStmt = db.prepare('SELECT id FROM todos WHERE id = ?');

  const transaction = db.transaction(() => {
    for (const todo of todos) {
      const existing = checkStmt.get(todo.id);
      if (existing) {
        result.skippedCount++;
        continue;
      }

      try {
        insertStmt.run(
          todo.id,
          todo.title,
          todo.description,
          todo.completed ? 1 : 0,
          todo.createdAt
        );
        result.migratedCount++;
      } catch (error) {
        result.errors.push(`Failed to migrate todo ${todo.id}: ${error}`);
      }
    }
  });

  try {
    transaction();
  } catch (error) {
    result.success = false;
    result.errors.push(`Transaction failed: ${error}`);
  }

  return result;
}

export function runMigrationIfNeeded(): void {
  const dbPath = getDatabasePath();
  const dbExists = isDatabaseInitialized();

  console.log(`Database path: ${dbPath}`);
  console.log(`Database exists: ${dbExists}`);

  const db = getDatabase();
  const countResult = db.prepare('SELECT COUNT(*) as count FROM todos').get() as { count: number };

  if (countResult.count === 0 && existsSync(JSON_FILE)) {
    console.log('Empty database detected, running migration from JSON...');
    const result = migrateJsonToSqlite();
    console.log(`Migration complete: ${result.migratedCount} migrated, ${result.skippedCount} skipped`);
    if (result.errors.length > 0) {
      console.error('Migration errors:', result.errors);
    }
  } else {
    console.log(`Database already has ${countResult.count} todos, skipping migration`);
  }
}

if (require.main === module) {
  console.log('Running manual migration...');
  const result = migrateJsonToSqlite();
  console.log('Migration result:', result);
}
