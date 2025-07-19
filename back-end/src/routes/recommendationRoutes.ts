import { Router } from 'express';
import {
    getMentorProfile,
    searchMentors,
} from '../controllers/mentorSearchController';
import {
    getRecommendations,
    getRecommendationsBySearch,
    getRecommendationsForStudent,
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

/**
 * GET /mentors/search
 * Search and filter mentors with intelligent matching
 * Optional authentication (personalized results if authenticated)
 */
router.get('/search', searchMentors);

/**
 * GET /mentors/:id
 * Get detailed mentor profile
 */
router.get('/:id', getMentorProfile);

export default router;
