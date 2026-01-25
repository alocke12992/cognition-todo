import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserRequest, LoginRequest, UserResponse, AuthResponse } from '../models/User';

const USERS_FILE = join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  private readUsers(): User[] {
    try {
      if (!existsSync(USERS_FILE)) {
        this.writeUsers([]);
        return [];
      }
      const data = readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private writeUsers(users: User[]): void {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  public verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  public async register(request: CreateUserRequest): Promise<AuthResponse> {
    const users = this.readUsers();
    
    const existingUser = users.find(u => u.email.toLowerCase() === request.email.toLowerCase());
    if (existingUser) {
      throw new Error('Email already registered');
    }

    if (!request.email || !request.password || !request.name) {
      throw new Error('Email, password, and name are required');
    }

    if (request.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    const passwordHash = await bcrypt.hash(request.password, 10);

    const newUser: User = {
      id: uuidv4(),
      email: request.email.toLowerCase(),
      passwordHash,
      name: request.name.trim(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.writeUsers(users);

    const token = this.generateToken(newUser.id);

    return {
      user: this.toUserResponse(newUser),
      token
    };
  }

  public async login(request: LoginRequest): Promise<AuthResponse> {
    const users = this.readUsers();

    const user = users.find(u => u.email.toLowerCase() === request.email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(request.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id);

    return {
      user: this.toUserResponse(user),
      token
    };
  }

  public getUserById(id: string): UserResponse | null {
    const users = this.readUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return null;
    }

    return this.toUserResponse(user);
  }
}
