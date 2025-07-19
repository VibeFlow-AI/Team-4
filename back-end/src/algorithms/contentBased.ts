import { IStudent } from '../models/Student';
import { IMentor } from '../models/Mentor';

export interface ContentBasedScore {
  score: number;
  factors: {
    subjectMatch: number;
    levelMatch: number;
    skillAlignment: number;
    experienceRelevance: number;
  };
  reasons: string[];
}

export class ContentBasedAlgorithm {
  
  /**
   * Calculate content-based recommendation score
   */
  static calculateScore(student: IStudent, mentor: IMentor): ContentBasedScore {
    const factors = {
      subjectMatch: this.calculateSubjectMatch(student, mentor),
      levelMatch: this.calculateLevelMatch(student, mentor),
      skillAlignment: this.calculateSkillAlignment(student, mentor),
      experienceRelevance: this.calculateExperienceRelevance(student, mentor),
    };

    // Weighted combination of factors
    const weights = {
      subjectMatch: 0.4,      // 40% - Most important
      levelMatch: 0.25,       // 25% - Very important
      skillAlignment: 0.2,    // 20% - Important
      experienceRelevance: 0.15, // 15% - Moderately important
    };

    const score = 
      factors.subjectMatch * weights.subjectMatch +
      factors.levelMatch * weights.levelMatch +
      factors.skillAlignment * weights.skillAlignment +
      factors.experienceRelevance * weights.experienceRelevance;

    const reasons = this.generateReasons(factors, student, mentor);

    return {
      score: Math.round(score * 100) / 100, // Round to 2 decimal places
      factors,
      reasons,
    };
  }

  /**
   * Calculate subject matching score (0-1)
   */
  private static calculateSubjectMatch(student: IStudent, mentor: IMentor): number {
    const studentSubjects = new Set(student.subjects.map(s => s.toLowerCase().trim()));
    const mentorSubjects = new Set(mentor.subjects.map(s => s.toLowerCase().trim()));
    
    const intersection = new Set([...studentSubjects].filter(x => mentorSubjects.has(x)));
    
    if (studentSubjects.size === 0) return 0;
    
    return intersection.size / studentSubjects.size;
  }

  /**
   * Calculate education level matching score (0-1)
   */
  private static calculateLevelMatch(student: IStudent, mentor: IMentor): number {
    const studentLevel = student.educationLevel.toLowerCase().trim();
    const mentorLevels = mentor.preferredStudentLevels.map(l => l.toLowerCase().trim());
    
    // Direct match
    if (mentorLevels.includes(studentLevel)) {
      return 1.0;
    }

    // Check for level compatibility
    const levelHierarchy = [
      'elementary',
      'middle school', 'junior high',
      'high school', 'secondary',
      'college', 'university', 'undergraduate',
      'graduate', 'postgraduate'
    ];

    const getHierarchyLevel = (level: string): number => {
      for (let i = 0; i < levelHierarchy.length; i++) {
        if (level.includes(levelHierarchy[i])) {
          return Math.floor(i / 2); // Group similar levels
        }
      }
      return -1;
    };

    const studentHierarchy = getHierarchyLevel(studentLevel);
    
    for (const mentorLevel of mentorLevels) {
      const mentorHierarchy = getHierarchyLevel(mentorLevel);
      
      if (studentHierarchy !== -1 && mentorHierarchy !== -1) {
        const diff = Math.abs(studentHierarchy - mentorHierarchy);
        if (diff === 0) return 1.0;
        if (diff === 1) return 0.7;
        if (diff === 2) return 0.4;
      }
    }

    return 0.1; // Minimal compatibility
  }

  /**
   * Calculate skill level alignment (0-1)
   */
  private static calculateSkillAlignment(student: IStudent, mentor: IMentor): number {
    if (!student.skills || student.skills.length === 0) {
      return 0.5; // Neutral score if no skills defined
    }

    const studentSkillMap = new Map();
    student.skills.forEach(skill => {
      studentSkillMap.set(skill.subject.toLowerCase(), skill.level);
    });

    const mentorSubjects = new Set(mentor.subjects.map(s => s.toLowerCase()));
    let alignmentScore = 0;
    let relevantSkills = 0;

    studentSkillMap.forEach((level, subject) => {
      if (mentorSubjects.has(subject)) {
        relevantSkills++;
        
        // Score based on skill level appropriateness
        switch (level) {
          case 'Beginner':
            // Beginners benefit from experienced mentors
            alignmentScore += mentor.experienceYears >= 2 ? 1 : 0.6;
            break;
          case 'Intermediate':
            // Intermediate students need good experience
            alignmentScore += mentor.experienceYears >= 3 ? 1 : 0.7;
            break;
          case 'Advanced':
            // Advanced students need highly experienced mentors
            alignmentScore += mentor.experienceYears >= 5 ? 1 : 0.5;
            break;
          default:
            alignmentScore += 0.5;
        }
      }
    });

    return relevantSkills > 0 ? alignmentScore / relevantSkills : 0.5;
  }

  /**
   * Calculate experience relevance score (0-1)
   */
  private static calculateExperienceRelevance(student: IStudent, mentor: IMentor): number {
    const years = mentor.experienceYears;
    
    // Calculate base score from experience years
    let experienceScore = 0;
    if (years >= 10) experienceScore = 1.0;
    else if (years >= 7) experienceScore = 0.9;
    else if (years >= 5) experienceScore = 0.8;
    else if (years >= 3) experienceScore = 0.7;
    else if (years >= 2) experienceScore = 0.6;
    else if (years >= 1) experienceScore = 0.5;
    else experienceScore = 0.3;

    // Adjust based on mentor's professional role relevance
    const professionalRoleBonus = this.calculateProfessionalRoleRelevance(
      student, 
      mentor.professionalRole
    );
    
    return Math.min(experienceScore + professionalRoleBonus, 1.0);
  }

  /**
   * Calculate professional role relevance bonus
   */
  private static calculateProfessionalRoleRelevance(
    student: IStudent, 
    professionalRole: string
  ): number {
    const role = professionalRole.toLowerCase();
    const subjects = student.subjects.map(s => s.toLowerCase());
    
    // Define role-subject relevance
    const roleSubjectMap: { [key: string]: string[] } = {
      'teacher': ['all'],
      'professor': ['all'],
      'educator': ['all'],
      'tutor': ['all'],
      'software engineer': ['computer science', 'programming', 'coding', 'software'],
      'data scientist': ['mathematics', 'statistics', 'data science', 'python'],
      'researcher': ['science', 'mathematics', 'research'],
      'engineer': ['mathematics', 'physics', 'engineering'],
      'doctor': ['biology', 'chemistry', 'medical', 'health'],
      'accountant': ['mathematics', 'accounting', 'finance'],
      'lawyer': ['law', 'legal studies', 'government'],
      'writer': ['english', 'literature', 'writing'],
      'artist': ['art', 'design', 'creative'],
    };

    for (const [roleKey, roleSubjects] of Object.entries(roleSubjectMap)) {
      if (role.includes(roleKey)) {
        if (roleSubjects.includes('all')) return 0.2;
        
        const hasRelevantSubject = subjects.some(subject =>
          roleSubjects.some(roleSubject => subject.includes(roleSubject))
        );
        
        if (hasRelevantSubject) return 0.15;
      }
    }

    return 0; // No bonus
  }

  /**
   * Generate human-readable reasons for the recommendation
   */
  private static generateReasons(
    factors: ContentBasedScore['factors'],
    student: IStudent,
    mentor: IMentor
  ): string[] {
    const reasons: string[] = [];

    // Subject match reasons
    if (factors.subjectMatch >= 0.8) {
      reasons.push('Excellent subject expertise match');
    } else if (factors.subjectMatch >= 0.5) {
      reasons.push('Good subject coverage for your needs');
    }

    // Level match reasons
    if (factors.levelMatch >= 0.9) {
      reasons.push('Perfect education level match');
    } else if (factors.levelMatch >= 0.7) {
      reasons.push('Compatible education level experience');
    }

    // Experience reasons
    if (factors.experienceRelevance >= 0.8) {
      reasons.push(`${mentor.experienceYears} years of relevant experience`);
    }

    // Skill alignment reasons
    if (factors.skillAlignment >= 0.8) {
      reasons.push('Teaching approach matches your skill level');
    }

    return reasons;
  }
}
