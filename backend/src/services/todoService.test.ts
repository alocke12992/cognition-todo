import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoService } from './todoService';
import type { Todo } from '../models/Todo';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

import { readFileSync, writeFileSync } from 'fs';

describe('TodoService', () => {
  let todoService: TodoService;
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Test Todo 2',
      description: 'Description 2',
      completed: true,
      createdAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    todoService = new TodoService();
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockTodos));
  });

  describe('getAllTodos', () => {
    it('should return all todos', () => {
      const todos = todoService.getAllTodos();
      
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe('Test Todo 1');
      expect(todos[1].title).toBe('Test Todo 2');
    });

    it('should return empty array when file read fails', () => {
      vi.mocked(readFileSync).mockImplementation(() => {
        throw new Error('File not found');
      });

      const todos = todoService.getAllTodos();
      
      expect(todos).toEqual([]);
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', () => {
      const todo = todoService.getTodoById('1');
      
      expect(todo).toBeDefined();
      expect(todo?.title).toBe('Test Todo 1');
    });

    it('should return undefined for non-existent id', () => {
      const todo = todoService.getTodoById('999');
      
      expect(todo).toBeUndefined();
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', () => {
      const newTodo = todoService.createTodo({
        title: 'New Todo',
        description: 'New Description',
      });

      expect(newTodo.title).toBe('New Todo');
      expect(newTodo.description).toBe('New Description');
      expect(newTodo.completed).toBe(false);
      expect(newTodo.id).toBeDefined();
      expect(newTodo.createdAt).toBeDefined();
      expect(writeFileSync).toHaveBeenCalled();
    });
  });

  describe('updateTodo', () => {
    it('should update a todo completion status', () => {
      const updatedTodo = todoService.updateTodo('1', { completed: true });

      expect(updatedTodo).toBeDefined();
      expect(updatedTodo?.completed).toBe(true);
      expect(writeFileSync).toHaveBeenCalled();
    });

    it('should return null for non-existent todo', () => {
      const result = todoService.updateTodo('999', { completed: true });

      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const result = todoService.deleteTodo('1');

      expect(result).toBe(true);
      expect(writeFileSync).toHaveBeenCalled();
    });

    it('should return false for non-existent todo', () => {
      const result = todoService.deleteTodo('999');

      expect(result).toBe(false);
    });
  });
});
