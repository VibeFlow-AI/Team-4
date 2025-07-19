import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { JWTPayload, JWTService } from '../utils/jwt';

export class AuthController {
  /**
   * POST /auth/register
   * Register as student or mentor
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role, email, password, name, age } = req.body;

      // Validate required fields
      if (!role || !email || !password || !name || age === undefined) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Missing required fields',
            details: ['role, email, password, name, and age are required']
          }
        });
        return;
      }

      // Validate role
      if (!['student', 'mentor'].includes(role)) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Invalid role',
            details: ['Role must be either "student" or "mentor"']
          }
        });
        return;
      }

      // Validate age
      if (typeof age !== 'number' || age < 5 || age > 100) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Invalid age',
            details: ['Age must be a number between 5 and 100']
          }
        });
        return;
      }

      // Additional age validation for mentors
      if (role === 'mentor' && age < 18) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Invalid age for mentor',
            details: ['Mentors must be at least 18 years old']
          }
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'User already exists',
            details: ['A user with this email address already exists']
          }
        });
        return;
      }

      // Validate password strength
      if (password.length < 6) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Password too weak',
            details: ['Password must be at least 6 characters long']
          }
        });
        return;
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        name: name.trim(),
        age,
        isEmailVerified: false,
        isActive: true,
      });

      await user.save();

      // Generate JWT tokens
      const payload: JWTPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = JWTService.generateTokenPair(payload);

      res.status(201).json({
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          age: user.age,
          avatarUrl: user.avatarUrl,
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  };

  /**
   * POST /auth/login
   * Login with email and password
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Missing credentials',
            details: ['Email and password are required']
          }
        });
        return;
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Invalid credentials',
            details: ['Invalid email or password']
          }
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Account deactivated',
            details: ['This account has been deactivated']
          }
        });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Invalid credentials',
            details: ['Invalid email or password']
          }
        });
        return;
      }

      // Generate JWT tokens
      const payload: JWTPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = JWTService.generateTokenPair(payload);

      res.status(200).json({
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  };

  /**
   * POST /auth/refresh
   * Refresh JWT token using refresh token
   */
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Refresh token required',
            details: ['Refresh token is required']
          }
        });
        return;
      }

      // Verify refresh token
      let payload: JWTPayload;
      try {
        payload = JWTService.verifyRefreshToken(refreshToken);
      } catch (error) {
        res.status(401).json({
          error: {
            code: 401,
            message: 'Invalid refresh token',
            details: ['Refresh token is invalid or expired']
          }
        });
        return;
      }

      // Verify user still exists and is active
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

      // Generate new token pair
      const newPayload: JWTPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = JWTService.generateTokenPair(newPayload);

      res.status(200).json({
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      next(error);
    }
  };

  /**
   * POST /auth/logout
   * Logout (invalidate refresh token)
   * Note: In a production app, you'd maintain a blacklist of tokens
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Refresh token required',
            details: ['Refresh token is required for logout']
          }
        });
        return;
      }

      // In a production application, you would:
      // 1. Add the refresh token to a blacklist/revoked tokens store
      // 2. Clean up any sessions associated with this token
      // For now, we'll just return a success message

      res.status(200).json({
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      next(error);
    }
  };
}

// Create controller instance
const authController = new AuthController();

// Export individual methods for route binding
export const register = authController.register;
export const login = authController.login;
export const refresh = authController.refresh;
export const logout = authController.logout;
