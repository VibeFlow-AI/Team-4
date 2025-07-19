import { Router } from 'express';
import { login, logout, refresh, register } from '../controllers/authController';

const router = Router();

// Test endpoint to debug routing
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!', timestamp: new Date().toISOString() });
});

/**
 * POST /auth/register
 * Register as student or mentor
 */
router.post('/register', register);

/**
 * POST /auth/login
 * Login with email and password
 */
router.post('/login', login);

/**
 * POST /auth/refresh
 * Refresh JWT token using refresh token
 */
router.post('/refresh', refresh);

/**
 * POST /auth/logout
 * Logout (invalidate refresh token)
 */
router.post('/logout', logout);

export default router;
