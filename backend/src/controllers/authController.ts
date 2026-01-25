import { Controller, Post, Get, Route, Tags, Body, Request, Security, Response, SuccessResponse } from 'tsoa';
import { CreateUserRequest, LoginRequest, AuthResponse, UserResponse } from '../models/User';
import { AuthService } from '../services/authService';
import express from 'express';

interface ErrorResponse {
  message: string;
}

@Route('api/auth')
@Tags('Authentication')
export class AuthController extends Controller {
  private authService = new AuthService();

  @Post('register')
  @SuccessResponse('201', 'Created')
  @Response<ErrorResponse>(400, 'Bad Request')
  public async register(@Body() request: CreateUserRequest): Promise<AuthResponse> {
    try {
      this.setStatus(201);
      return await this.authService.register(request);
    } catch (error) {
      this.setStatus(400);
      throw error;
    }
  }

  @Post('login')
  @SuccessResponse('200', 'Success')
  @Response<ErrorResponse>(401, 'Unauthorized')
  public async login(@Body() request: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.authService.login(request);
    } catch (error) {
      this.setStatus(401);
      throw error;
    }
  }

  @Post('logout')
  @SuccessResponse('200', 'Success')
  public async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @Security('jwt')
  @Response<ErrorResponse>(401, 'Unauthorized')
  public async getCurrentUser(@Request() request: express.Request): Promise<UserResponse> {
    const userId = (request as express.Request & { userId: string }).userId;
    const user = this.authService.getUserById(userId);
    if (!user) {
      this.setStatus(401);
      throw new Error('User not found');
    }
    return user;
  }
}
