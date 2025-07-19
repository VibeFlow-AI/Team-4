import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StudentOnboardingData } from '@/types/auth';

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

interface StudentOnboardingProps {
  onComplete: (data: StudentOnboardingData) => void;
  onBack: () => void;
}

export function StudentOnboarding({ onComplete, onBack }: StudentOnboardingProps) {
  const [currentPart, setCurrentPart] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(studentOnboardingSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual onboarding submission
      console.log('Student onboarding data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete(data as StudentOnboardingData);
      navigate('/dashboard/student');
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

  const isPart1Valid = watchedValues.fullName && watchedValues.age && watchedValues.emailAddress && watchedValues.contactNumber;
  const isPart2Valid = watchedValues.currentEducationLevel && watchedValues.school;
  const isPart3Valid = watchedValues.subjectsOfInterest && watchedValues.currentYear && watchedValues.skillLevel && watchedValues.preferredLearningStyle;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Student Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={currentPart === 1 ? onBack : handlePrevious}
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
        </CardContent>
      </Card>
    </div>
  );
} 