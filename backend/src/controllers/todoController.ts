import { Controller, Get, Post, Patch, Delete, Route, Tags, Body, Path, Response, SuccessResponse, Security, Request } from 'tsoa';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/Todo';
import { TodoService } from '../services/todoService';
import express from 'express';

@Route('api/todos')
@Tags('Todos')
@Security('jwt')
export class TodoController extends Controller {
  private todoService = new TodoService();

  private getUserId(request: express.Request): string {
    return (request as express.Request & { userId: string }).userId;
  }

  /**
   * Get all todos for the authenticated user
   */
  @Get()
  @SuccessResponse('200', 'Success')
  public async getAllTodos(@Request() request: express.Request): Promise<Todo[]> {
    const userId = this.getUserId(request);
    return this.todoService.getAllTodos(userId);
  }

  /**
   * Get a specific todo by ID
   */
  @Get('{id}')
  @Response<void>(404, 'Not Found')
  public async getTodoById(@Path() id: string, @Request() request: express.Request): Promise<Todo> {
    const userId = this.getUserId(request);
    const todo = this.todoService.getTodoById(id, userId);
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
  public async createTodo(@Body() body: CreateTodoRequest, @Request() request: express.Request): Promise<Todo> {
    const userId = this.getUserId(request);
    this.setStatus(201);
    return this.todoService.createTodo(body, userId);
  }

  /**
   * Update a todo (mark as completed/uncompleted)
   */
  @Patch('{id}')
  @Response<void>(404, 'Not Found')
  public async updateTodo(
    @Path() id: string,
    @Body() body: UpdateTodoRequest,
    @Request() request: express.Request
  ): Promise<Todo> {
    const userId = this.getUserId(request);
    const todo = this.todoService.updateTodo(id, body, userId);
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
  public async deleteTodo(@Path() id: string, @Request() request: express.Request): Promise<void> {
    const userId = this.getUserId(request);
    const deleted = this.todoService.deleteTodo(id, userId);
    if (!deleted) {
      this.setStatus(404);
      throw new Error('Todo not found');
    }
    this.setStatus(204);
  }
}
