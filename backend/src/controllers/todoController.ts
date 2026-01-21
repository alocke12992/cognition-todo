import { Controller, Get, Post, Patch, Delete, Route, Tags, Body, Path, Response, SuccessResponse } from 'tsoa';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/Todo';
import { TodoService } from '../services/todoService';

@Route('api/todos')
@Tags('Todos')
export class TodoController extends Controller {
  private todoService = new TodoService();

  /**
   * Get all todos
   */
  @Get()
  @SuccessResponse('200', 'Success')
  public async getAllTodos(): Promise<Todo[]> {
    return this.todoService.getAllTodos();
  }

  /**
   * Get a specific todo by ID
   */
  @Get('{id}')
  @Response<void>(404, 'Not Found')
  public async getTodoById(@Path() id: string): Promise<Todo> {
    const todo = this.todoService.getTodoById(id);
    if (!todo) {
      this.setStatus(404);
      throw new Error('Todo not found');
    }
    return todo;
  }

  /**
   * Create a new todo
   */
  @Post()
  @SuccessResponse('201', 'Created')
  public async createTodo(@Body() request: CreateTodoRequest): Promise<Todo> {
    this.setStatus(201);
    return this.todoService.createTodo(request);
  }

  /**
   * Update a todo (mark as completed/uncompleted)
   */
  @Patch('{id}')
  @Response<void>(404, 'Not Found')
  public async updateTodo(
    @Path() id: string,
    @Body() request: UpdateTodoRequest
  ): Promise<Todo> {
    const todo = this.todoService.updateTodo(id, request);
    if (!todo) {
      this.setStatus(404);
      throw new Error('Todo not found');
    }
    return todo;
  }

  /**
   * Delete a todo
   */
  @Delete('{id}')
  @Response<void>(404, 'Not Found')
  @SuccessResponse('204', 'No Content')
  public async deleteTodo(@Path() id: string): Promise<void> {
    const deleted = this.todoService.deleteTodo(id);
    if (!deleted) {
      this.setStatus(404);
      throw new Error('Todo not found');
    }
    this.setStatus(204);
  }
}
