import { getDatabase } from '../db/database';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/Todo';

interface TodoRow {
  id: string;
  title: string;
  description: string;
  completed: number;
  created_at: string;
}

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1,
    createdAt: row.created_at
  };
}

export class TodoService {
  public getAllTodos(): Todo[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all() as TodoRow[];
    return rows.map(rowToTodo);
  }

  public getTodoById(id: string): Todo | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as TodoRow | undefined;
    return row ? rowToTodo(row) : undefined;
  }

  public createTodo(request: CreateTodoRequest): Todo {
    const db = getDatabase();
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO todos (id, title, description, completed, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, request.title, request.description, 0, createdAt);

    return {
      id,
      title: request.title,
      description: request.description,
      completed: false,
      createdAt
    };
  }

  public updateTodo(id: string, request: UpdateTodoRequest): Todo | null {
    const db = getDatabase();

    const existing = this.getTodoById(id);
    if (!existing) {
      return null;
    }

    const stmt = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    stmt.run(request.completed ? 1 : 0, id);

    return {
      ...existing,
      completed: request.completed
    };
  }

  public deleteTodo(id: string): boolean {
    const db = getDatabase();

    const existing = this.getTodoById(id);
    if (!existing) {
      return false;
    }

    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    stmt.run(id);

    return true;
  }
}
