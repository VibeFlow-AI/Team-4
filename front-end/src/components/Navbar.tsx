import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";

export interface NavbarLink {
  label: string;
  to: string;
  className?: string;
}

export interface NavbarButton {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: "default" | "outline";
  className?: string;
}

interface NavbarProps {
  links?: NavbarLink[];
  buttons?: NavbarButton[];
}

export function Navbar({ links = [], buttons = [] }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={link.className || "text-black font-medium hover:text-gray-600 transition-colors"}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Dynamic Buttons */}
      <div className="flex items-center space-x-4">
        {buttons.map((btn, idx) => (
          btn.to ? (
            <Button
              key={btn.label + idx}
              size="lg"
              className={btn.className || "bg-black text-white hover:bg-gray-800 transition-colors"}
              variant={btn.variant || "default"}
              asChild
            >
              <Link to={btn.to}>{btn.label}</Link>
            </Button>
          ) : (
            <Button
              key={btn.label + idx}
              className={btn.className || "bg-black text-white hover:bg-gray-800 transition-colors"}
              variant={btn.variant || "default"}
              onClick={btn.onClick}
            >
              {btn.label}
            </Button>
          )
        ))}
        
        {/* Default Get Started button if no buttons provided */}
        {buttons.length === 0 && (
          <Button 
            className="bg-black text-white hover:bg-gray-800 transition-colors"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Get Started
          </Button>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
} 