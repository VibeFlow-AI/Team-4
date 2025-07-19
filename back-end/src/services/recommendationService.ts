import { Student, IStudent } from '../models/Student';
import { Mentor, IMentor } from '../models/Mentor';
import { Booking } from '../models/Booking';
import { 
  RecommendationCriteria, 
  MentorScore, 
  RecommendationResult 
} from '../types/recommendation';

export class RecommendationService {
  
  /**
   * Get personalized mentor recommendations for a student
   */
  async getRecommendations(
    studentId: string, 
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    try {
      // Get student profile
      const student = await Student.findOne({ userId: studentId }).lean();
      if (!student) {
        throw new Error('Student profile not found');
      }

      // Get all available mentors
      const availableMentors = await this.getAvailableMentors();
      
      // Calculate scores for each mentor
      const mentorScores = await this.calculateMentorScores(student, availableMentors);
      
      // Sort by score and limit results
      const topMentors = mentorScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Populate mentor details and return results
      return await this.populateMentorResults(topMentors);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Get available mentors (verified, available, etc.)
   */
  private async getAvailableMentors(): Promise<IMentor[]> {
    return await Mentor.find({
      isAvailable: true,
      isVerified: true,
    }).lean();
  }

  /**
   * Calculate recommendation scores for mentors based on student profile
   */
  private async calculateMentorScores(
    student: IStudent, 
    mentors: IMentor[]
  ): Promise<MentorScore[]> {
    const mentorScores: MentorScore[] = [];

    for (const mentor of mentors) {
      const score = await this.calculateIndividualScore(student, mentor);
      mentorScores.push({
        mentorId: mentor._id.toString(),
        score: score.total,
        reasons: score.reasons,
      });
    }

    return mentorScores;
  }

  /**
   * Calculate individual mentor score based on multiple factors
   */
  private async calculateIndividualScore(
    student: IStudent, 
    mentor: IMentor
  ): Promise<{ total: number; reasons: string[] }> {
    let totalScore = 0;
    const reasons: string[] = [];

    // 1. Subject Match (30% weight)
    const subjectScore = this.calculateSubjectMatch(student, mentor);
    totalScore += subjectScore.score * 0.3;
    if (subjectScore.score > 0) {
      reasons.push(...subjectScore.reasons);
    }

    // 2. Education Level Match (20% weight)
    const levelScore = this.calculateLevelMatch(student, mentor);
    totalScore += levelScore.score * 0.2;
    if (levelScore.score > 0) {
      reasons.push(...levelScore.reasons);
    }

    // 3. Mentor Rating (25% weight)
    const ratingScore = this.calculateRatingScore(mentor);
    totalScore += ratingScore.score * 0.25;
    if (ratingScore.score > 0) {
      reasons.push(...ratingScore.reasons);
    }

    // 4. Experience Match (15% weight)
    const experienceScore = this.calculateExperienceScore(mentor);
    totalScore += experienceScore.score * 0.15;
    if (experienceScore.score > 0) {
      reasons.push(...experienceScore.reasons);
    }

    // 5. Collaborative Filtering (10% weight)
    const collaborativeScore = await this.calculateCollaborativeScore(student, mentor);
    totalScore += collaborativeScore.score * 0.1;
    if (collaborativeScore.score > 0) {
      reasons.push(...collaborativeScore.reasons);
    }

    return {
      total: Math.min(totalScore, 100), // Cap at 100
      reasons,
    };
  }

  /**
   * Calculate subject match score
   */
  private calculateSubjectMatch(
    student: IStudent, 
    mentor: IMentor
  ): { score: number; reasons: string[] } {
    const studentSubjects = student.subjects.map(s => s.toLowerCase());
    const mentorSubjects = mentor.subjects.map(s => s.toLowerCase());
    
    const commonSubjects = studentSubjects.filter(subject => 
      mentorSubjects.includes(subject)
    );

    if (commonSubjects.length === 0) {
      return { score: 0, reasons: [] };
    }

    // Score based on percentage of student subjects covered
    const matchPercentage = (commonSubjects.length / studentSubjects.length) * 100;
    
    return {
      score: matchPercentage,
      reasons: [`Teaches ${commonSubjects.length} of your subjects: ${commonSubjects.join(', ')}`],
    };
  }

  /**
   * Calculate education level match
   */
  private calculateLevelMatch(
    student: IStudent, 
    mentor: IMentor
  ): { score: number; reasons: string[] } {
    const studentLevel = student.educationLevel.toLowerCase();
    const mentorLevels = mentor.preferredStudentLevels.map(l => l.toLowerCase());
    
    if (mentorLevels.includes(studentLevel)) {
      return {
        score: 100,
        reasons: [`Specializes in ${student.educationLevel} level students`],
      };
    }

    // Partial match for related levels
    const levelHierarchy = ['elementary', 'middle school', 'high school', 'college', 'university'];
    const studentIndex = levelHierarchy.findIndex(level => studentLevel.includes(level));
    
    if (studentIndex !== -1) {
      for (const mentorLevel of mentorLevels) {
        const mentorIndex = levelHierarchy.findIndex(level => mentorLevel.includes(level));
        if (mentorIndex !== -1 && Math.abs(studentIndex - mentorIndex) <= 1) {
          return {
            score: 60,
            reasons: [`Has experience with similar education levels`],
          };
        }
      }
    }

    return { score: 0, reasons: [] };
  }

  /**
   * Calculate rating-based score
   */
  private calculateRatingScore(mentor: IMentor): { score: number; reasons: string[] } {
    if (!mentor.averageRating || mentor.totalReviews < 3) {
      return { score: 50, reasons: [] }; // Neutral score for new mentors
    }

    const score = (mentor.averageRating / 5) * 100;
    
    return {
      score,
      reasons: [`Highly rated: ${mentor.averageRating.toFixed(1)}/5 stars from ${mentor.totalReviews} reviews`],
    };
  }

  /**
   * Calculate experience-based score
   */
  private calculateExperienceScore(mentor: IMentor): { score: number; reasons: string[] } {
    const years = mentor.experienceYears;
    
    let score = 0;
    let reason = '';

    if (years >= 10) {
      score = 100;
      reason = `${years} years of extensive experience`;
    } else if (years >= 5) {
      score = 80;
      reason = `${years} years of solid experience`;
    } else if (years >= 2) {
      score = 60;
      reason = `${years} years of experience`;
    } else {
      score = 40;
      reason = `${years} year(s) of experience`;
    }

    return {
      score,
      reasons: reason ? [reason] : [],
    };
  }

  /**
   * Calculate collaborative filtering score based on similar students
   */
  private async calculateCollaborativeScore(
    student: IStudent, 
    mentor: IMentor
  ): Promise<{ score: number; reasons: string[] }> {
    try {
      // Find students with similar profiles who had successful sessions
      const similarStudents = await Student.find({
        _id: { $ne: student._id },
        subjects: { $in: student.subjects },
        educationLevel: student.educationLevel,
      }).limit(50).lean();

      if (similarStudents.length === 0) {
        return { score: 0, reasons: [] };
      }

      // Check how many similar students had positive experiences with this mentor
      const successfulSessions = await Booking.find({
        mentorId: mentor._id,
        studentId: { $in: similarStudents.map(s => s._id) },
        status: 'completed',
        studentRating: { $gte: 4 },
      }).countDocuments();

      if (successfulSessions === 0) {
        return { score: 0, reasons: [] };
      }

      const score = Math.min((successfulSessions / similarStudents.length) * 100, 100);
      
      return {
        score,
        reasons: [`${successfulSessions} students with similar profiles rated this mentor highly`],
      };
      
    } catch (error) {
      console.error('Error calculating collaborative score:', error);
      return { score: 0, reasons: [] };
    }
  }

  /**
   * Populate mentor details for final results
   */
  private async populateMentorResults(
    mentorScores: MentorScore[]
  ): Promise<RecommendationResult[]> {
    const results: RecommendationResult[] = [];

    for (const mentorScore of mentorScores) {
      const mentor = await Mentor.findById(mentorScore.mentorId)
        .populate('userId', 'name email avatarUrl')
        .lean();

      if (mentor) {
        results.push({
          mentor: {
            id: mentor._id,
            ...mentor,
            user: mentor.userId,
          },
          score: mentorScore.score,
          matchReasons: mentorScore.reasons,
        });
      }
    }

    return results;
  }

  /**
   * Get recommendations based on specific criteria (for search)
   */
  async getRecommendationsByCriteria(
    criteria: RecommendationCriteria
  ): Promise<RecommendationResult[]> {
    const query: any = {
      isAvailable: true,
      isVerified: true,
    };

    // Add filters based on criteria
    if (criteria.subjects && criteria.subjects.length > 0) {
      query.subjects = { $in: criteria.subjects };
    }

    if (criteria.maxBudget) {
      query.ratePerSession = { $lte: criteria.maxBudget };
    }

    if (criteria.minRating) {
      query.averageRating = { $gte: criteria.minRating };
    }

    const mentors = await Mentor.find(query)
      .populate('userId', 'name email avatarUrl')
      .sort({ averageRating: -1, totalSessions: -1 })
      .limit(criteria.limit || 20)
      .lean();

    return mentors.map(mentor => ({
      mentor: {
        id: mentor._id,
        ...mentor,
        user: mentor.userId,
      },
      score: mentor.averageRating ? (mentor.averageRating / 5) * 100 : 50,
      matchReasons: ['Matches your search criteria'],
    }));
  }
}
