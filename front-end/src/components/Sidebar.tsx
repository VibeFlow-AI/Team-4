import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export interface SidebarLink {
  to: string;
  icon: ReactNode;
  label?: string;
}

interface SidebarProps {
  links: SidebarLink[];
}

export function Sidebar({ links }: SidebarProps) {
  return (
    <div className="flex flex-col items-center h-full w-20 py-6 justify-between">
      {/* Top icons */}
      <div className="flex flex-col gap-8">
        {links.map((link, idx) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={link.label || `Sidebar link ${idx + 1}`}
          >
            {link.icon}
          </Link>
        ))}
      </div>
      {/* User DP at bottom */}
      <div className="mb-2">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 relative">
          {/* Replace src with actual user dp if available */}
          <img
            src="/user-dp.png"
            alt="User"
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Fallback initials if no image */}
          <span className="absolute text-gray-500 font-bold text-lg select-none">U</span>
        </div>
      </div>
    </div>
  );
}

