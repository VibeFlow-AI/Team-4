export interface RecommendationCriteria {
  studentId: string;
  subjects?: string[];
  preferredLevel?: string;
  maxBudget?: number;
  minRating?: number;
  availableTime?: string;
  limit?: number;
}

export interface MentorScore {
  mentorId: string;
  score: number;
  reasons: string[];
}

export interface RecommendationResult {
  mentor: any; // This will be the populated mentor object
  score: number;
  matchReasons: string[];
}

export interface RecommendationRequest {
  studentId: string;
  limit?: number;
}

export interface RecommendationResponse {
  recommendations: RecommendationResult[];
  totalCount: number;
  algorithm: string;
}
