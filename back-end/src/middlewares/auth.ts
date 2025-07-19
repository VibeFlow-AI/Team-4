import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { JWTPayload, JWTService } from '../utils/jwt';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'student' | 'mentor';
        name: string;
        avatarUrl?: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      res.status(401).json({
        error: {
          code: 401,
          message: 'Authentication required',
          details: ['Access token is required']
        }
      });
      return;
    }

    // Verify token
    let payload: JWTPayload;
    try {
      payload = JWTService.verifyToken(token);
    } catch (error) {
      res.status(401).json({
        error: {
          code: 401,
          message: 'Invalid token',
          details: ['Access token is invalid or expired']
        }
      });
      return;
    }

    // Fetch user from database to ensure they still exist and are active
    const user = await User.findById(payload.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        error: {
          code: 401,
          message: 'User not found or inactive',
          details: ['User account not found or has been deactivated']
        }
      });
      return;
    }

    // Add user info to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: {
        code: 500,
        message: 'Internal server error',
        details: ['An error occurred during authentication']
      }
    });
  }
};

export const requireRole = (roles: ('student' | 'mentor')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 401,
          message: 'Authentication required',
          details: ['User must be authenticated']
        }
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          code: 403,
          message: 'Insufficient permissions',
          details: [`This endpoint requires one of the following roles: ${roles.join(', ')}`]
        }
      });
      return;
    }

    next();
  };
};

// Middleware for optional authentication (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    try {
      const payload = JWTService.verifyToken(token);
      const user = await User.findById(payload.id);
      
      if (user && user.isActive) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          avatarUrl: user.avatarUrl,
        };
      }
    } catch (error) {
      // Invalid token, but don't fail - just continue without user
      console.log('Optional auth failed:', error);
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};
