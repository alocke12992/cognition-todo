import { Request } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<{ userId: string }> {
  if (securityName === 'jwt') {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return Promise.reject(new Error('No authorization header'));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return Promise.reject(new Error('Invalid authorization header format'));
    }

    const token = parts[1];
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return Promise.reject(new Error('Invalid or expired token'));
    }

    return Promise.resolve({ userId: decoded.userId });
  }

  return Promise.reject(new Error('Unknown security name'));
}
