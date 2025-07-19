import { NextFunction, Request, Response } from 'express';
import { RecommendationService } from '../services/recommendationService';
import { RecommendationRequest } from '../types/recommendation';

export class RecommendationController {
  private recommendationService: RecommendationService;

  constructor() {
    this.recommendationService = new RecommendationService();
  }

  /**
   * GET /mentors/recommended
   * Get personalized mentor recommendations for the authenticated student
   */
  getRecommendations = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get student ID from authenticated user
      const studentId = req.user?.id; // Assuming auth middleware sets req.user
      
      if (!studentId) {
        res.status(401).json({
          error: {
            code: 401,
            message: 'Authentication required',
            details: ['User must be authenticated to get recommendations']
          }
        });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 10;

      const recommendations = await this.recommendationService.getRecommendations(
        studentId,
        limit
      );

      res.status(200).json({
        recommendations,
        totalCount: recommendations.length,
        algorithm: 'hybrid_content_collaborative',
      });

    } catch (error) {
      console.error('Error getting recommendations:', error);
      next(error);
    }
  };

  /**
   * POST /mentors/recommended
   * Get personalized mentor recommendations for a specific student (admin/testing)
   */
  getRecommendationsForStudent = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    try {
      const { studentId, limit = 10 }: RecommendationRequest = req.body;

      if (!studentId) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Student ID is required',
            details: ['studentId field is required in request body']
          }
        });
        return;
      }

      const recommendations = await this.recommendationService.getRecommendations(
        studentId,
        limit
      );

      res.status(200).json({
        recommendations,
        totalCount: recommendations.length,
        algorithm: 'hybrid_content_collaborative',
      });

    } catch (error) {
      console.error('Error getting recommendations for student:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'Student not found',
            details: [error.message]
          }
        });
        return;
      }

      next(error);
    }
  };

  /**
   * GET /mentors/recommended/search
   * Get mentor recommendations based on search criteria
   */
  getRecommendationsBySearch = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        subjects,
        maxBudget,
        minRating,
        limit = 20,
      } = req.query;

      const criteria = {
        studentId: req.user?.id || '',
        subjects: subjects ? (subjects as string).split(',') : undefined,
        maxBudget: maxBudget ? parseFloat(maxBudget as string) : undefined,
        minRating: minRating ? parseFloat(minRating as string) : undefined,
        limit: parseInt(limit as string),
      };

      const recommendations = await this.recommendationService.getRecommendationsByCriteria(criteria);

      res.status(200).json({
        recommendations,
        totalCount: recommendations.length,
        algorithm: 'criteria_based',
        searchCriteria: {
          subjects: criteria.subjects,
          maxBudget: criteria.maxBudget,
          minRating: criteria.minRating,
        },
      });

    } catch (error) {
      console.error('Error getting search-based recommendations:', error);
      next(error);
    }
  };
}

// Create controller instance
const recommendationController = new RecommendationController();

// Export individual methods for route binding
export const getRecommendations = recommendationController.getRecommendations;
export const getRecommendationsForStudent = recommendationController.getRecommendationsForStudent;
export const getRecommendationsBySearch = recommendationController.getRecommendationsBySearch;
