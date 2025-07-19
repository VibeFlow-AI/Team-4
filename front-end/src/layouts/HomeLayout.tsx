import { Navbar } from "../components/Navbar";
import type { NavbarLink, NavbarButton } from "../components/Navbar";
import type { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

const homeLinks: NavbarLink[] = [
  { label: "Home", to: "/" },
  { label: "Sessions", to: "/sessions" },
  { label: "About", to: "/about" },
];

const homeButtons: NavbarButton[] = [
  { label: "Get Started", to: "/login" },
];

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100">
      <Navbar links={homeLinks} buttons={homeButtons} />
      {children}
    </div>
  );
} 