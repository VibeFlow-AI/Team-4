import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';

export class UserController {
  /**
   * GET /users/me
   * Get current user profile
   */
  getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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

      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'User not found',
            details: ['User account not found']
          }
        });
        return;
      }

      res.status(200).json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    } catch (error) {
      console.error('Get current user error:', error);
      next(error);
    }
  };

  /**
   * PATCH /users/me
   * Update current user profile
   */
  updateCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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

      const { name, avatarUrl } = req.body;
      const updateData: any = {};

      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          res.status(400).json({
            error: {
              code: 400,
              message: 'Invalid name',
              details: ['Name must be a non-empty string']
            }
          });
          return;
        }
        updateData.name = name.trim();
      }

      if (avatarUrl !== undefined) {
        updateData.avatarUrl = avatarUrl;
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'User not found',
            details: ['User account not found']
          }
        });
        return;
      }

      res.status(200).json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    } catch (error) {
      console.error('Update current user error:', error);
      next(error);
    }
  };

  /**
   * GET /users/:id
   * Get public user profile
   */
  getPublicUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user || !user.isActive) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'User not found',
            details: ['User not found or inactive']
          }
        });
        return;
      }

      // Return public profile (without sensitive information)
      res.status(200).json({
        id: user._id,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      });

    } catch (error) {
      console.error('Get public user error:', error);
      next(error);
    }
  };

  /**
   * GET /users
   * Get all users (for admin/development purposes)
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await User.find({ isActive: true })
        .select('-password') // Exclude password field
        .sort({ createdAt: -1 });

      res.status(200).json({
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        count: users.length
      });

    } catch (error) {
      console.error('Get all users error:', error);
      next(error);
    }
  };
}

// Create controller instance
const userController = new UserController();

// Export individual methods for route binding
export const getCurrentUser = userController.getCurrentUser;
export const updateCurrentUser = userController.updateCurrentUser;
export const getPublicUser = userController.getPublicUser;
export const getAllUsers = userController.getAllUsers;
