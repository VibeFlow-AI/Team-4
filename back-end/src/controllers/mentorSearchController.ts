import { NextFunction, Request, Response } from 'express';
import { Mentor } from '../models/Mentor';
import { Student } from '../models/Student';

interface SearchFilters {
  subjects?: string[];
  language?: string;
  maxPrice?: number;
  minRating?: number;
  experienceYears?: number;
  sessionDuration?: number; // in minutes
  page?: number;
  limit?: number;
  sort?: 'rating' | 'price' | 'experience' | 'relevance';
}

interface MentorScore {
  mentor: any;
  score: number;
  matchReasons: string[];
}

export class MentorSearchController {
  /**
   * GET /mentors
   * Search mentors with filters and intelligent matching
   */
  searchMentors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        subjects,
        language,
        maxPrice,
        minRating,
        experienceYears,
        sessionDuration,
        page = 1,
        limit = 12,
        sort = 'relevance'
      } = req.query as any;

      const filters: SearchFilters = {
        subjects: subjects ? subjects.split(',') : undefined,
        language,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
        sessionDuration: sessionDuration ? parseInt(sessionDuration) : 120, // default 2 hours
        page: parseInt(page) || 1,
        limit: Math.min(parseInt(limit) || 12, 50), // max 50 results
        sort: sort || 'relevance'
      };

      // Get current user's student profile for personalization
      let studentProfile = null;
      if (req.user) {
        studentProfile = await Student.findOne({ userId: req.user.id });
      }

      // Build MongoDB query
      const query: any = {
        isAvailable: true,
        isVerified: true
      };

      if (filters.subjects && filters.subjects.length > 0) {
        query.subjects = { $in: filters.subjects };
      }

      if (filters.language) {
        query.languages = { $in: [filters.language] };
      }

      if (filters.maxPrice) {
        query.ratePerSession = { $lte: filters.maxPrice };
      }

      if (filters.minRating) {
        query.averageRating = { $gte: filters.minRating };
      }

      if (filters.experienceYears) {
        query.experienceYears = { $gte: filters.experienceYears };
      }

      // Find mentors
      const mentors = await Mentor.find(query)
        .populate('userId', 'name email avatarUrl')
        .lean();

      // Apply intelligent matching if student profile exists
      let scoredMentors: MentorScore[] = [];
      
      if (studentProfile && filters.sort === 'relevance') {
        scoredMentors = this.calculateMentorMatches(mentors, studentProfile, filters);
      } else {
        // Convert to scored format for consistent handling
        scoredMentors = mentors.map(mentor => ({
          mentor,
          score: 0,
          matchReasons: []
        }));
      }

      // Sort mentors
      this.sortMentors(scoredMentors, filters.sort!);

      // Pagination
      const pageNum = filters.page!;
      const limitNum = filters.limit!;
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedMentors = scoredMentors.slice(startIndex, endIndex);

      // Format response
      const formattedMentors = paginatedMentors.map(item => ({
        id: item.mentor._id,
        userId: item.mentor.userId,
        fullName: item.mentor.fullName,
        bio: item.mentor.bio,
        professionalRole: item.mentor.professionalRole,
        subjects: item.mentor.subjects,
        experienceYears: item.mentor.experienceYears,
        ratePerSession: item.mentor.ratePerSession,
        currency: item.mentor.currency,
        averageRating: item.mentor.averageRating,
        totalReviews: item.mentor.totalReviews,
        languages: item.mentor.languages,
        specializations: item.mentor.specializations,
        availableHours: item.mentor.availableHours,
        timezone: item.mentor.timezone,
        matchScore: item.score,
        matchReasons: item.matchReasons,
        user: item.mentor.userId
      }));

      res.status(200).json({
        data: formattedMentors,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: scoredMentors.length,
          totalPages: Math.ceil(scoredMentors.length / limitNum)
        },
        filters: {
          appliedFilters: filters,
          isPersonalized: !!studentProfile && filters.sort === 'relevance'
        }
      });

    } catch (error) {
      console.error('Search mentors error:', error);
      next(error);
    }
  };

  /**
   * Intelligent mentor matching algorithm
   */
  private calculateMentorMatches(mentors: any[], studentProfile: any, filters: SearchFilters): MentorScore[] {
    return mentors.map(mentor => {
      let score = 0;
      const matchReasons: string[] = [];

      // Subject matching (highest weight - 40%)
      const subjectMatch = this.calculateSubjectMatch(mentor.subjects, studentProfile.subjects);
      score += subjectMatch.score * 0.4;
      if (subjectMatch.score > 0) {
        matchReasons.push(...subjectMatch.reasons);
      }

      // Education level matching (20%)
      const levelMatch = this.calculateLevelMatch(mentor.preferredStudentLevels, studentProfile.educationLevel);
      score += levelMatch.score * 0.2;
      if (levelMatch.score > 0) {
        matchReasons.push(levelMatch.reason);
      }

      // Rating and reviews (15%)
      if (mentor.averageRating) {
        const ratingScore = (mentor.averageRating - 3) / 2; // Normalize 3-5 to 0-1
        score += Math.max(0, ratingScore) * 0.15;
        if (mentor.averageRating >= 4.5) {
          matchReasons.push(`Highly rated mentor (${mentor.averageRating}★)`);
        }
      }

      // Experience matching (10%)
      const experienceScore = Math.min(mentor.experienceYears / 10, 1); // Cap at 10 years
      score += experienceScore * 0.1;
      if (mentor.experienceYears >= 5) {
        matchReasons.push(`${mentor.experienceYears} years of experience`);
      }

      // Price affordability (10%)
      if (studentProfile.totalSpent > 0) {
        const avgSpentPerSession = studentProfile.totalSpent / Math.max(studentProfile.completedSessions, 1);
        const priceScore = mentor.ratePerSession <= avgSpentPerSession * 1.5 ? 1 : 0.5;
        score += priceScore * 0.1;
        if (mentor.ratePerSession <= avgSpentPerSession) {
          matchReasons.push('Within your typical budget');
        }
      }

      // Skill level matching (5%)
      if (studentProfile.skills && studentProfile.skills.length > 0) {
        const skillMatch = this.calculateSkillMatch(mentor.subjects, studentProfile.skills);
        score += skillMatch.score * 0.05;
        if (skillMatch.score > 0) {
          matchReasons.push(...skillMatch.reasons);
        }
      }

      return {
        mentor,
        score: Math.round(score * 100), // Convert to percentage
        matchReasons
      };
    });
  }

  private calculateSubjectMatch(mentorSubjects: string[], studentSubjects: string[]) {
    const intersection = mentorSubjects.filter(subject => 
      studentSubjects.some(studentSubject => 
        studentSubject.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(studentSubject.toLowerCase())
      )
    );

    const score = intersection.length / Math.max(studentSubjects.length, 1);
    const reasons = intersection.map(subject => `Teaches ${subject}`);

    return { score, reasons };
  }

  private calculateLevelMatch(mentorLevels: string[], studentLevel: string) {
    const normalizedStudentLevel = studentLevel.toLowerCase();
    const isMatch = mentorLevels.some(level => 
      level.toLowerCase().includes(normalizedStudentLevel) ||
      normalizedStudentLevel.includes(level.toLowerCase())
    );

    return {
      score: isMatch ? 1 : 0,
      reason: isMatch ? `Suitable for ${studentLevel} level` : ''
    };
  }

  private calculateSkillMatch(mentorSubjects: string[], studentSkills: any[]) {
    const matchingSkills = studentSkills.filter(skill =>
      mentorSubjects.some(subject =>
        subject.toLowerCase().includes(skill.subject.toLowerCase()) ||
        skill.subject.toLowerCase().includes(subject.toLowerCase())
      )
    );

    const score = matchingSkills.length / Math.max(studentSkills.length, 1);
    const reasons = matchingSkills.map(skill => 
      `Matches your ${skill.level} level in ${skill.subject}`
    );

    return { score, reasons };
  }

  private sortMentors(mentors: MentorScore[], sortBy: string) {
    switch (sortBy) {
      case 'rating':
        mentors.sort((a, b) => (b.mentor.averageRating || 0) - (a.mentor.averageRating || 0));
        break;
      case 'price':
        mentors.sort((a, b) => a.mentor.ratePerSession - b.mentor.ratePerSession);
        break;
      case 'experience':
        mentors.sort((a, b) => b.mentor.experienceYears - a.mentor.experienceYears);
        break;
      case 'relevance':
      default:
        mentors.sort((a, b) => b.score - a.score);
        break;
    }
  }

  /**
   * GET /mentors/:id
   * Get detailed mentor profile
   */
  getMentorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const mentor = await Mentor.findById(id)
        .populate('userId', 'name email avatarUrl')
        .lean();

      if (!mentor || !mentor.isAvailable) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'Mentor not found',
            details: ['Mentor not found or not available']
          }
        });
        return;
      }

      res.status(200).json({
        id: mentor._id,
        user: mentor.userId,
        fullName: mentor.fullName,
        age: mentor.age,
        bio: mentor.bio,
        professionalRole: mentor.professionalRole,
        subjects: mentor.subjects,
        experienceYears: mentor.experienceYears,
        preferredStudentLevels: mentor.preferredStudentLevels,
        linkedinUrl: mentor.linkedinUrl,
        portfolioUrl: mentor.portfolioUrl,
        ratePerSession: mentor.ratePerSession,
        currency: mentor.currency,
        availableHours: mentor.availableHours,
        timezone: mentor.timezone,
        totalSessions: mentor.totalSessions,
        averageRating: mentor.averageRating,
        totalReviews: mentor.totalReviews,
        isVerified: mentor.isVerified,
        specializations: mentor.specializations,
        languages: mentor.languages,
        createdAt: mentor.createdAt
      });

    } catch (error) {
      console.error('Get mentor profile error:', error);
      next(error);
    }
  };
}

// Create controller instance
const mentorSearchController = new MentorSearchController();

// Export individual methods for route binding
export const searchMentors = mentorSearchController.searchMentors;
export const getMentorProfile = mentorSearchController.getMentorProfile;
