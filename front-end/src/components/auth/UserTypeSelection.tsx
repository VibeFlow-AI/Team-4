import { Button } from '@/components/ui/button';

interface UserTypeSelectionProps {
  onSelectUserType: (userType: 'student' | 'mentor') => void;
  onBackToSignIn: () => void;
}

export function UserTypeSelection({ onSelectUserType, onBackToSignIn }: UserTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Mentor Option */}
        <div className="text-center space-y-3">
          <div className="text-lg font-medium">Sign Up as a Mentor</div>
          <Button
            onClick={() => onSelectUserType('mentor')}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            Continue as a Mentor
          </Button>
        </div>

        {/* Student Option */}
        <div className="text-center space-y-3">
          <div className="text-lg font-medium">Sign Up as a Student</div>
          <Button
            onClick={() => onSelectUserType('student')}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            Continue as a Student
          </Button>
        </div>
      </div>

      {/* Back to Sign In */}
      <div className="text-center">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="text-sm text-gray-600 hover:text-black"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
} 