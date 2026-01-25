import { Controller, Post, Get, Route, Tags, Body, Request, Response, SuccessResponse, Security } from 'tsoa';
import { CreateUserRequest, LoginRequest, AuthResponse, UserResponse } from '../models/User';
import { AuthService } from '../services/authService';
import express from 'express';

interface AuthenticatedRequest extends express.Request {
  user?: { userId: string };
}

@Route('api/auth')
@Tags('Authentication')
export class AuthController extends Controller {
  private authService = new AuthService();

  /**
   * Register a new user
   */
  @Post('register')
  @SuccessResponse('201', 'Created')
  @Response<{ message: string }>(400, 'Bad Request')
  public async register(@Body() request: CreateUserRequest): Promise<AuthResponse> {
    try {
      this.setStatus(201);
      return await this.authService.register(request);
    } catch (error) {
      this.setStatus(400);
      throw error;
    }
  }

  /**
   * Login with email and password
   */
  @Post('login')
  @SuccessResponse('200', 'Success')
  @Response<{ message: string }>(401, 'Unauthorized')
  public async login(@Body() request: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.authService.login(request);
    } catch (error) {
      this.setStatus(401);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  @Get('me')
  @Security('jwt')
  @Response<{ message: string }>(401, 'Unauthorized')
  public async getCurrentUser(@Request() request: AuthenticatedRequest): Promise<UserResponse> {
    const userId = request.user?.userId;
    if (!userId) {
      this.setStatus(401);
      throw new Error('Not authenticated');
    }

    const user = this.authService.getUserById(userId);
    if (!user) {
      this.setStatus(401);
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Logout (client-side token removal)
   */
  @Post('logout')
  @SuccessResponse('200', 'Success')
  public async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }
}
