import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MentorOnboardingData } from '@/types/auth';

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

interface MentorOnboardingProps {
  onComplete: (data: MentorOnboardingData) => void;
  onBack: () => void;
}

export function MentorOnboarding({ onComplete, onBack }: MentorOnboardingProps) {
  const [currentPart, setCurrentPart] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
    resolver: zodResolver(mentorOnboardingSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual onboarding submission
      console.log('Mentor onboarding data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete(data as MentorOnboardingData);
      navigate('/dashboard/mentor');
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
      setValue('subjectsToTeach', newSubjects);
    }
  };

  const updateSubject = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
    setValue('subjectsToTeach', newSubjects.filter(s => s.trim() !== ''));
  };

  const toggleStudentLevel = (level: 'Grade 3-5' | 'Grade 6-9' | 'Grade 10-11' | 'Advanced Level') => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter(l => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(newLevels);
    setValue('preferredStudentLevels', newLevels);
  };

  const isPart1Valid = watchedValues.fullName && watchedValues.age && watchedValues.emailAddress && 
                      watchedValues.contactNumber && watchedValues.preferredLanguage && 
                      watchedValues.currentLocation && watchedValues.shortBio && watchedValues.professionalRole;
  const isPart2Valid = subjects.some(s => s.trim() !== '') && watchedValues.teachingExperience && selectedLevels.length > 0;
  const isPart3Valid = watchedValues.linkedinProfile;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Mentor Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    {...register('preferredLanguage')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select preferred language</option>
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.preferredLanguage && (
                    <p className="text-sm text-red-500">{errors.preferredLanguage.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    placeholder="Enter your current location"
                    {...register('currentLocation')}
                    className={errors.currentLocation ? 'border-red-500' : ''}
                  />
                  {errors.currentLocation && (
                    <p className="text-sm text-red-500">{errors.currentLocation.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalRole">Professional Role</Label>
                  <Input
                    id="professionalRole"
                    placeholder="e.g., Software Engineer, Teacher, Consultant"
                    {...register('professionalRole')}
                    className={errors.professionalRole ? 'border-red-500' : ''}
                  />
                  {errors.professionalRole && (
                    <p className="text-sm text-red-500">{errors.professionalRole.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortBio">Short Bio</Label>
                  <textarea
                    id="shortBio"
                    placeholder="Introduce yourself in 2-3 sentences"
                    {...register('shortBio')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    rows={3}
                  />
                  {errors.shortBio && (
                    <p className="text-sm text-red-500">{errors.shortBio.message}</p>
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
                    {...register('teachingExperience')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select experience level</option>
                    <option value="None">None</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  {errors.teachingExperience && (
                    <p className="text-sm text-red-500">{errors.teachingExperience.message}</p>
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
                  {errors.preferredStudentLevels && (
                    <p className="text-sm text-red-500">{errors.preferredStudentLevels.message}</p>
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
                    {...register('linkedinProfile')}
                    className={errors.linkedinProfile ? 'border-red-500' : ''}
                  />
                  {errors.linkedinProfile && (
                    <p className="text-sm text-red-500">{errors.linkedinProfile.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubOrPortfolio">GitHub or Portfolio (Optional)</Label>
                  <Input
                    id="githubOrPortfolio"
                    type="url"
                    placeholder="https://github.com/username or portfolio URL"
                    {...register('githubOrPortfolio')}
                    className={errors.githubOrPortfolio ? 'border-red-500' : ''}
                  />
                  {errors.githubOrPortfolio && (
                    <p className="text-sm text-red-500">{errors.githubOrPortfolio.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Upload Profile Picture</Label>
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    {...register('profilePicture')}
                    className="border border-gray-300 rounded-md p-2"
                  />
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