import { Request } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export async function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<{ userId: string }> {
  if (securityName === 'jwt') {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Invalid authorization header format');
    }

    const token = parts[1];
    
    try {
      const decoded = authService.verifyToken(token);
      (request as AuthenticatedRequest).userId = decoded.userId;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  throw new Error('Unknown security scheme');
}
