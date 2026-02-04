import { describe, it, expect } from 'vitest';
import type { Todo } from './Todo';

describe('Todo type', () => {
  it('should create a valid Todo object', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      description: 'This is a test todo item',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    };

    expect(todo.id).toBe('1');
    expect(todo.title).toBe('Test Todo');
    expect(todo.description).toBe('This is a test todo item');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should allow completed to be true', () => {
    const todo: Todo = {
      id: '2',
      title: 'Completed Todo',
      description: 'This todo is done',
      completed: true,
      createdAt: '2024-01-01T00:00:00.000Z',
    };

    expect(todo.completed).toBe(true);
  });
});
