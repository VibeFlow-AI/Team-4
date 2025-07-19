import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="mx-[5%] z-50 bg-white rounded-lg border border-gray-100 px-36 py-3 flex items-center justify-between h-24">
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-12 h-12 mr-4"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8 text-2xl">
        <Link 
          to="/" 
          className="text-black font-medium hover:text-gray-600 transition-colors"
        >
          Home
        </Link>
        <Link 
          to="/sessions" 
          className="text-black font-medium hover:text-gray-600 transition-colors"
        >
          Sessions
        </Link>
        <Link 
          to="/about" 
          className="text-black font-medium hover:text-gray-600 transition-colors"
        >
          About
        </Link>
      </div>

      {/* Call to Action Button */}
      <Button 
        className="bg-black text-white hover:bg-gray-800 transition-colors"
        asChild
      >
        <Link to="/login">
          Get Started
        </Link>
      </Button>
    </nav>
  );
} 