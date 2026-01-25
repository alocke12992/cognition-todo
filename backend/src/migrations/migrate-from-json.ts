import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getDatabase, closeDatabase } from '../db/database';

interface JsonTodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

const JSON_FILE = join(__dirname, '../data/todos.json');

function migrate(): void {
  console.log('Starting migration from JSON to SQLite...');

  if (!existsSync(JSON_FILE)) {
    console.log('No todos.json file found. Skipping migration.');
    return;
  }

  const db = getDatabase();
  
  let todos: JsonTodo[];
  try {
    const data = readFileSync(JSON_FILE, 'utf-8');
    todos = JSON.parse(data);
  } catch (error) {
    console.error('Error reading todos.json:', error);
    return;
  }

  if (!Array.isArray(todos) || todos.length === 0) {
    console.log('No todos to migrate.');
    return;
  }

  const existingCount = (db.prepare('SELECT COUNT(*) as count FROM todos').get() as { count: number }).count;
  if (existingCount > 0) {
    console.log(`Database already contains ${existingCount} todos. Skipping migration to avoid duplicates.`);
    console.log('If you want to re-migrate, please delete the todos.db file first.');
    return;
  }

  const insertStmt = db.prepare(`
    INSERT INTO todos (id, title, description, completed, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((todosToInsert: JsonTodo[]) => {
    for (const todo of todosToInsert) {
      insertStmt.run(
        todo.id,
        todo.title,
        todo.description,
        todo.completed ? 1 : 0,
        todo.createdAt
      );
    }
  });

  try {
    insertMany(todos);
    console.log(`Successfully migrated ${todos.length} todos to SQLite database.`);
    console.log('The original todos.json file has been kept as a backup.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    closeDatabase();
  }
}

migrate();
