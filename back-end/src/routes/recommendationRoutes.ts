import { Router } from 'express';
import {
  getRecommendations,
  getRecommendationsForStudent,
  getRecommendationsBySearch,
} from '../controllers/recommendationController';
// import { authenticateToken } from '../middlewares/auth'; // You'll need to create this

const router = Router();

/**
 * GET /mentors/recommended
 * Get personalized mentor recommendations for authenticated student
 * Requires authentication
 */
router.get('/recommended', getRecommendations);

/**
 * POST /mentors/recommended
 * Get recommendations for specific student (admin/testing endpoint)
 * Requires authentication and admin role
 */
router.post('/recommended', getRecommendationsForStudent);

/**
 * GET /mentors/recommended/search
 * Get mentor recommendations based on search criteria
 * Optional authentication (better recommendations if authenticated)
 */
router.get('/recommended/search', getRecommendationsBySearch);

export default router;
