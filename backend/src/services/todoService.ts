import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/Todo';
import { getDatabase } from '../db/database';

interface TodoRow {
  id: string;
  title: string;
  description: string;
  completed: number;
  created_at: string;
}

export class TodoService {
  private rowToTodo(row: TodoRow): Todo {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed === 1,
      createdAt: row.created_at
    };
  }

  public getAllTodos(): Todo[] {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at DESC');
    const rows = stmt.all() as TodoRow[];
    return rows.map(row => this.rowToTodo(row));
  }

  public getTodoById(id: string): Todo | undefined {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
    const row = stmt.get(id) as TodoRow | undefined;
    return row ? this.rowToTodo(row) : undefined;
  }

  public createTodo(request: CreateTodoRequest): Todo {
    const db = getDatabase();
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: request.title,
      description: request.description,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const stmt = db.prepare(`
      INSERT INTO todos (id, title, description, completed, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(newTodo.id, newTodo.title, newTodo.description, 0, newTodo.createdAt);

    return newTodo;
  }

  public updateTodo(id: string, request: UpdateTodoRequest): Todo | null {
    const db = getDatabase();
    
    const existingStmt = db.prepare('SELECT * FROM todos WHERE id = ?');
    const existingRow = existingStmt.get(id) as TodoRow | undefined;
    
    if (!existingRow) {
      return null;
    }

    const updateStmt = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    updateStmt.run(request.completed ? 1 : 0, id);

    return {
      ...this.rowToTodo(existingRow),
      completed: request.completed
    };
  }

  public deleteTodo(id: string): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
