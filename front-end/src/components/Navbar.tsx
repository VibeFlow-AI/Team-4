import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

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
  dropdownIcons?: React.ReactNode[]; // Array of icon components
  userDp?: string; // User display picture URL
  home: boolean;
}

export function Navbar({ links = [], buttons = [], dropdownIcons = [], userDp, home }: NavbarProps) {
  return (
    <nav className={`${home ? "mx-[5%]" : ""} z-50 bg-white rounded-lg border border-gray-100 ${home ? "px-12": "px-8"} py-3 flex items-center justify-between h-24`}>
      {/* Logo with Dropdown */}
      <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-12 h-12 mr-4"
            />

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
      </div>
    </nav>
  );
} 