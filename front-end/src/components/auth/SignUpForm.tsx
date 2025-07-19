import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignUpData, StudentOnboardingData, MentorOnboardingData } from '@/types/auth';

// Student onboarding schema
const studentOnboardingSchema = z.object({
  // Part 1: Basic Information
  fullName: z.string().min(1, 'Full name is required'),
  age: z.number().min(1, 'Age is required').max(120, 'Please enter a valid age'),
  emailAddress: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  
  // Part 2: Academic Background
  currentEducationLevel: z.enum(['Grade 9', 'Ordinary Level', 'Advanced Level']),
  school: z.string().min(1, 'School is required'),
  
  // Part 3: Subject & Skill Assessment
  subjectsOfInterest: z.string().min(1, 'Subjects of interest are required'),
  currentYear: z.number().min(1, 'Current year is required'),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  preferredLearningStyle: z.enum(['Visual', 'Hands-On', 'Theoretical', 'Mixed']),
  hasLearningDisabilities: z.boolean(),
  learningDisabilitiesDescription: z.string().optional(),
});

// Mentor onboarding schema
const mentorOnboardingSchema = z.object({
  // Part 1: Personal Information
  fullName: z.string().min(1, 'Full name is required'),
  age: z.number().min(1, 'Age is required').max(120, 'Please enter a valid age'),
  emailAddress: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  preferredLanguage: z.enum(['English', 'Sinhala', 'Tamil', 'Other']),
  currentLocation: z.string().min(1, 'Current location is required'),
  shortBio: z.string().min(10, 'Bio must be at least 10 characters'),
  professionalRole: z.string().min(1, 'Professional role is required'),
  
  // Part 2: Areas of Expertise
  subjectsToTeach: z.array(z.string()).min(1, 'At least one subject is required'),
  teachingExperience: z.enum(['None', '1-3 years', '3-5 years', '5+ years']),
  preferredStudentLevels: z.array(z.enum(['Grade 3-5', 'Grade 6-9', 'Grade 10-11', 'Advanced Level'])).min(1, 'At least one level is required'),
  
  // Part 3: Social & Professional Links
  linkedinProfile: z.string().url('Please enter a valid LinkedIn URL'),
  githubOrPortfolio: z.string().url().optional().or(z.literal('')),
  profilePicture: z.any().optional(),
});

interface SignUpFormProps {
  userType: 'student' | 'mentor';
  onBackToUserType: () => void;
  onBackToSignIn: () => void;
  onClose: () => void;
}

export function SignUpForm({ userType, onBackToUserType, onBackToSignIn, onClose }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);
  const [subjects, setSubjects] = useState<string[]>(['']);
  const [selectedLevels, setSelectedLevels] = useState<('Grade 3-5' | 'Grade 6-9' | 'Grade 10-11' | 'Advanced Level')[]>([]);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userType === 'student' ? studentOnboardingSchema : mentorOnboardingSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual onboarding submission
      console.log(`${userType} onboarding data:`, data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to appropriate dashboard
      if (userType === 'student') {
        navigate('/dashboard/student');
      } else {
        navigate('/dashboard/mentor');
      }
      
      onClose();
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentPart < 3) {
      setCurrentPart(currentPart + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPart > 1) {
      setCurrentPart(currentPart - 1);
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, '']);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
      (setValue as any)('subjectsToTeach', newSubjects);
    }
  };

  const updateSubject = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
    (setValue as any)('subjectsToTeach', newSubjects.filter(s => s.trim() !== ''));
  };

  const toggleStudentLevel = (level: 'Grade 3-5' | 'Grade 6-9' | 'Grade 10-11' | 'Advanced Level') => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter(l => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(newLevels);
    (setValue as any)('preferredStudentLevels', newLevels);
  };

  // Validation for each part
  const isPart1Valid = watchedValues.fullName && watchedValues.age && watchedValues.emailAddress && watchedValues.contactNumber;
  const isPart2Valid = userType === 'student' 
    ? (watchedValues.currentEducationLevel && watchedValues.school)
    : (subjects.some(s => s.trim() !== '') && (watchedValues as any).teachingExperience && selectedLevels.length > 0);
  const isPart3Valid = userType === 'student'
    ? (watchedValues.subjectsOfInterest && watchedValues.currentYear && watchedValues.skillLevel && watchedValues.preferredLearningStyle)
    : (watchedValues as any).linkedinProfile;

  return (
    <div className="w-full max-h-[70vh] overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-black">
            {userType === 'student' ? 'Student Onboarding' : 'Mentor Onboarding'}
          </h2>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {userType === 'student' ? (
              // Student Onboarding Form
              <>
                {/* Part 1: Who Are You? */}
                {currentPart === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Part 1: Who Are You?</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          {...register('fullName')}
                          className={errors.fullName ? 'border-red-500' : ''}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Enter your age"
                          {...register('age', { valueAsNumber: true })}
                          className={errors.age ? 'border-red-500' : ''}
                        />
                        {errors.age && (
                          <p className="text-sm text-red-500">{errors.age.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailAddress">Email Address</Label>
                      <Input
                        id="emailAddress"
                        type="email"
                        placeholder="Enter your email address"
                        {...register('emailAddress')}
                        className={errors.emailAddress ? 'border-red-500' : ''}
                      />
                      {errors.emailAddress && (
                        <p className="text-sm text-red-500">{errors.emailAddress.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        placeholder="Enter your contact number"
                        {...register('contactNumber')}
                        className={errors.contactNumber ? 'border-red-500' : ''}
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-red-500">{errors.contactNumber.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Part 2: Academic Background */}
                {currentPart === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Part 2: Academic Background</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentEducationLevel">Current Education Level</Label>
                      <select
                        id="currentEducationLevel"
                        {...register('currentEducationLevel')}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select education level</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Ordinary Level">Ordinary Level</option>
                        <option value="Advanced Level">Advanced Level</option>
                      </select>
                      {errors.currentEducationLevel && (
                        <p className="text-sm text-red-500">{errors.currentEducationLevel.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input
                        id="school"
                        placeholder="Enter your school name"
                        {...register('school')}
                        className={errors.school ? 'border-red-500' : ''}
                      />
                      {errors.school && (
                        <p className="text-sm text-red-500">{errors.school.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Part 3: Subject & Skill Assessment */}
                {currentPart === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Part 3: Subject & Skill Assessment</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subjectsOfInterest">Subjects of Interest</Label>
                      <Input
                        id="subjectsOfInterest"
                        placeholder="e.g., Physics, Mathematics"
                        {...register('subjectsOfInterest')}
                        className={errors.subjectsOfInterest ? 'border-red-500' : ''}
                      />
                      {errors.subjectsOfInterest && (
                        <p className="text-sm text-red-500">{errors.subjectsOfInterest.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentYear">Current Year</Label>
                      <select
                        id="currentYear"
                        {...register('currentYear', { valueAsNumber: true })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select current year</option>
                        {Array.from({ length: 13 }, (_, i) => i + 1).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.currentYear && (
                        <p className="text-sm text-red-500">{errors.currentYear.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Current Skill Level</Label>
                      <div className="space-y-2">
                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                          <label key={level} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value={level}
                              {...register('skillLevel')}
                              className="text-black focus:ring-black"
                            />
                            <span>{level}</span>
                          </label>
                        ))}
                      </div>
                      {errors.skillLevel && (
                        <p className="text-sm text-red-500">{errors.skillLevel.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredLearningStyle">Preferred Learning Style</Label>
                      <select
                        id="preferredLearningStyle"
                        {...register('preferredLearningStyle')}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select learning style</option>
                        <option value="Visual">Visual</option>
                        <option value="Hands-On">Hands-On</option>
                        <option value="Theoretical">Theoretical</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                      {errors.preferredLearningStyle && (
                        <p className="text-sm text-red-500">{errors.preferredLearningStyle.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Do you have any learning disabilities or accommodations needed?</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="true"
                            {...register('hasLearningDisabilities')}
                            className="text-black focus:ring-black"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="false"
                            {...register('hasLearningDisabilities')}
                            className="text-black focus:ring-black"
                          />
                          <span>No</span>
                        </label>
                      </div>
                      
                      {watchedValues.hasLearningDisabilities && (
                        <div className="space-y-2">
                          <Label htmlFor="learningDisabilitiesDescription">Please describe your learning needs</Label>
                          <textarea
                            id="learningDisabilitiesDescription"
                            {...register('learningDisabilitiesDescription')}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            rows={3}
                            placeholder="Describe any learning disabilities or accommodations needed..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Mentor Onboarding Form
              <>
                {/* Part 1: Personal Information */}
                {currentPart === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Part 1: Personal Information</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          {...register('fullName')}
                          className={errors.fullName ? 'border-red-500' : ''}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Enter your age"
                          {...register('age', { valueAsNumber: true })}
                          className={errors.age ? 'border-red-500' : ''}
                        />
                        {errors.age && (
                          <p className="text-sm text-red-500">{errors.age.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailAddress">Email Address</Label>
                      <Input
                        id="emailAddress"
                        type="email"
                        placeholder="Enter your email address"
                        {...register('emailAddress')}
                        className={errors.emailAddress ? 'border-red-500' : ''}
                      />
                      {errors.emailAddress && (
                        <p className="text-sm text-red-500">{errors.emailAddress.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        placeholder="Enter your contact number"
                        {...register('contactNumber')}
                        className={errors.contactNumber ? 'border-red-500' : ''}
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-red-500">{errors.contactNumber.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredLanguage">Preferred Language</Label>
                      <select
                        id="preferredLanguage"
                        {...(register as any)('preferredLanguage')}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select preferred language</option>
                        <option value="English">English</option>
                        <option value="Sinhala">Sinhala</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Other">Other</option>
                      </select>
                      {(errors as any).preferredLanguage && (
                        <p className="text-sm text-red-500">{(errors as any).preferredLanguage.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentLocation">Current Location</Label>
                      <Input
                        id="currentLocation"
                        placeholder="Enter your current location"
                        {...(register as any)('currentLocation')}
                        className={(errors as any).currentLocation ? 'border-red-500' : ''}
                      />
                      {(errors as any).currentLocation && (
                        <p className="text-sm text-red-500">{(errors as any).currentLocation.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="professionalRole">Professional Role</Label>
                      <Input
                        id="professionalRole"
                        placeholder="e.g., Software Engineer, Teacher, Consultant"
                        {...(register as any)('professionalRole')}
                        className={(errors as any).professionalRole ? 'border-red-500' : ''}
                      />
                      {(errors as any).professionalRole && (
                        <p className="text-sm text-red-500">{(errors as any).professionalRole.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortBio">Short Bio</Label>
                      <textarea
                        id="shortBio"
                        placeholder="Introduce yourself in 2-3 sentences"
                        {...(register as any)('shortBio')}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        rows={3}
                      />
                      {(errors as any).shortBio && (
                        <p className="text-sm text-red-500">{(errors as any).shortBio.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Part 2: Areas of Expertise */}
                {currentPart === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Part 2: Areas of Expertise</h2>
                    
                    <div className="space-y-4">
                      <Label>Subjects you are planning to teach</Label>
                      {subjects.map((subject, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="e.g., Physics, Chemistry"
                            value={subject}
                            onChange={(e) => updateSubject(index, e.target.value)}
                            className="flex-1"
                          />
                          {subjects.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeSubject(index)}
                              className="px-3"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addSubject}
                        className="w-full"
                      >
                        Add Subject
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teachingExperience">Teaching/Training Experience</Label>
                      <select
                        id="teachingExperience"
                        {...(register as any)('teachingExperience')}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select experience level</option>
                        <option value="None">None</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                      {(errors as any).teachingExperience && (
                        <p className="text-sm text-red-500">{(errors as any).teachingExperience.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Level of Students</Label>
                      <div className="space-y-2">
                        {(['Grade 3-5', 'Grade 6-9', 'Grade 10-11', 'Advanced Level'] as const).map((level) => (
                          <label key={level} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedLevels.includes(level)}
                              onChange={() => toggleStudentLevel(level)}
                              className="text-black focus:ring-black"
                            />
                            <span>{level}</span>
                          </label>
                        ))}
                      </div>
                      {(errors as any).preferredStudentLevels && (
                        <p className="text-sm text-red-500">{(errors as any).preferredStudentLevels.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Part 3: Social & Professional Links */}
                {currentPart === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Part 3: Social & Professional Links</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedinProfile">LinkedIn Profile *</Label>
                      <Input
                        id="linkedinProfile"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...(register as any)('linkedinProfile')}
                        className={(errors as any).linkedinProfile ? 'border-red-500' : ''}
                      />
                      {(errors as any).linkedinProfile && (
                        <p className="text-sm text-red-500">{(errors as any).linkedinProfile.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="githubOrPortfolio">GitHub or Portfolio (Optional)</Label>
                      <Input
                        id="githubOrPortfolio"
                        type="url"
                        placeholder="https://github.com/username or portfolio URL"
                        {...(register as any)('githubOrPortfolio')}
                        className={(errors as any).githubOrPortfolio ? 'border-red-500' : ''}
                      />
                      {(errors as any).githubOrPortfolio && (
                        <p className="text-sm text-red-500">{(errors as any).githubOrPortfolio.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profilePicture">Upload Profile Picture</Label>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        {...(register as any)('profilePicture')}
                        className="border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={currentPart === 1 ? onBackToUserType : handlePrevious}
                disabled={currentPart === 1}
              >
                {currentPart === 1 ? 'Back' : 'Previous'}
              </Button>

              {currentPart < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentPart === 1 && !isPart1Valid) ||
                    (currentPart === 2 && !isPart2Valid)
                  }
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isPart3Valid || isLoading}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isLoading ? 'Submitting...' : 'Complete Onboarding'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 