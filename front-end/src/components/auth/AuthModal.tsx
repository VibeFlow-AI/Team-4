import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignInForm } from './SignInForm.tsx';
import { SignUpForm } from './SignUpForm.tsx';
import { UserTypeSelection } from './UserTypeSelection.tsx';

// No props needed
export function AuthModal() {
  const location = useLocation();
  const initialMode = location.state?.authMode || "signin";
  const [mode, setMode] = useState<'signin' | 'signup' | 'userType'>(initialMode);
  const [selectedUserType, setSelectedUserType] = useState<'student' | 'mentor' | null>(null);

  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  const handleUserTypeSelect = (userType: 'student' | 'mentor') => {
    setSelectedUserType(userType);
    setMode('signup');
  };

  const handleBackToUserType = () => {
    setMode('userType');
    setSelectedUserType(null);
  };

  const handleBackToSignIn = () => {
    setMode('signin');
    setSelectedUserType(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black">
                {mode === 'signin' && 'Sign in to EduVibe'}
                {mode === 'userType' && 'Get Started'}
                {mode === 'signup' && `Sign Up as ${selectedUserType === 'student' ? 'Student' : 'Mentor'}`}
              </h2>
              {mode === 'signin' && (
                <p className="text-gray-600 text-sm mt-2">
                  Welcome back! Please sign in to continue
                </p>
              )}
            </div>
            <div className="space-y-4">
              {mode === 'signin' && (
                <SignInForm 
                  onSwitchToSignUp={() => setMode('userType')}
                  onClose={handleClose}
                />
              )}
              {mode === 'userType' && (
                <UserTypeSelection 
                  onSelectUserType={handleUserTypeSelect}
                  onBackToSignIn={handleBackToSignIn}
                />
              )}
              {mode === 'signup' && selectedUserType && (
                <SignUpForm 
                  userType={selectedUserType}
                  onBackToUserType={handleBackToUserType}
                  onBackToSignIn={handleBackToSignIn}
                  onClose={handleClose}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 