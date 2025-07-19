import { Navbar } from "./Navbar";
import type { NavbarLink, NavbarButton } from "./Navbar";
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
    <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
      <Navbar links={homeLinks} buttons={homeButtons} />
      {children}
    </div>
  );
} 