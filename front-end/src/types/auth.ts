export interface StudentOnboardingData {
  // Part 1: Basic Information
  fullName: string;
  age: number;
  emailAddress: string;
  contactNumber: string;
  
  // Part 2: Academic Background
  currentEducationLevel: 'Grade 9' | 'Ordinary Level' | 'Advanced Level';
  school: string;
  
  // Part 3: Subject & Skill Assessment
  subjectsOfInterest: string;
  currentYear: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredLearningStyle: 'Visual' | 'Hands-On' | 'Theoretical' | 'Mixed';
  hasLearningDisabilities: boolean;
  learningDisabilitiesDescription?: string;
}

export interface MentorOnboardingData {
  // Part 1: Personal Information
  fullName: string;
  age: number;
  emailAddress: string;
  contactNumber: string;
  preferredLanguage: 'English' | 'Sinhala' | 'Tamil' | 'Other';
  currentLocation: string;
  shortBio: string;
  professionalRole: string;
  
  // Part 2: Areas of Expertise
  subjectsToTeach: string[];
  teachingExperience: 'None' | '1-3 years' | '3-5 years' | '5+ years';
  preferredStudentLevels: ('Grade 3-5' | 'Grade 6-9' | 'Grade 10-11' | 'Advanced Level')[];
  
  // Part 3: Social & Professional Links
  linkedinProfile: string;
  githubOrPortfolio?: string;
  profilePicture?: File;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'student' | 'mentor';
} 