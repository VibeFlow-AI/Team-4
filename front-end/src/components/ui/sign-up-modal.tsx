import { X } from "lucide-react";
import { Button } from "./button";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  if (!isOpen) return null;

  const handleStudentRegister = () => {
    window.location.href = "/register/student";
  };

  const handleMentorRegister = () => {
    window.location.href = "/register/mentor";
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-2">
            Join EduVibe
          </h2>
          <p className="text-gray-600 mb-6">
            Choose how you'd like to get started with personalized mentorship
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleStudentRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            >
              Register as Student
            </Button>
            
            <Button
              onClick={handleMentorRegister}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 text-lg font-medium"
            >
              Register as Mentor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal; 