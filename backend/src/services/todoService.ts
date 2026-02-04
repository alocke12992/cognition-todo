import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/Todo';

const DATA_FILE = join(__dirname, '../data/todos.json');

export class TodoService {
  private readTodos(): Todo[] {
    try {
      const data = readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error', error)
      return [];
    }
  }

  private writeTodos(todos: Todo[]): void {
    writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  }

  public getAllTodos(): Todo[] {
    return this.readTodos();
  }

  public getTodoById(id: string): Todo | undefined {
    const todos = this.readTodos();
    return todos.find(todo => todo.id === id);
  }

  public createTodo(request: CreateTodoRequest): Todo {
    const todos = this.readTodos();
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: request.title,
      description: request.description,
      completed: false,
      createdAt: new Date().toISOString()
    };
    todos.push(newTodo);
    this.writeTodos(todos);
    return newTodo;
  }

  public updateTodo(id: string, request: UpdateTodoRequest): Todo | null {
    const todos = this.readTodos();
    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
      return null;
    }

    todos[index] = {
      ...todos[index],
      completed: request.completed
    };

    this.writeTodos(todos);
    return todos[index];
  }

  public deleteTodo(id: string): boolean {
    const todos = this.readTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);

    if (filteredTodos.length === todos.length) {
      return false;
    }

    this.writeTodos(filteredTodos);
    return true;
  }
}
