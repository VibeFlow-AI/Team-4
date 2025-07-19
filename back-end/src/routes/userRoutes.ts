import { Router } from 'express';
import { getAllUsers, getCurrentUser, getPublicUser, updateCurrentUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * GET /users
 * Get all users (for admin/development purposes)
 */
router.get('/', getAllUsers);

/**
 * GET /users/me
 * Get current user profile
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * PATCH /users/me
 * Update current user profile
 */
router.patch('/me', authenticateToken, updateCurrentUser);

/**
 * GET /users/:id
 * Get public user profile
 */
router.get('/:id', getPublicUser);

export default router;
