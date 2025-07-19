import { Navbar } from "./Navbar";
import type { NavbarLink, NavbarButton } from "./Navbar";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const protectedLinks: NavbarLink[] = [
  { label: "Home", to: "/" },
  { label: "Sessions", to: "/sessions" },
];

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

const protectedButtons: NavbarButton[] = [
  { label: "Logout", onClick: logout, variant: "outline" },
];

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar links={protectedLinks} buttons={protectedButtons} />
      {children}
    </div>
  );
} 