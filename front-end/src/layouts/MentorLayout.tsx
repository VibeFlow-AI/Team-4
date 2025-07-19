import { Navbar } from "../components/Navbar";
import type { NavbarLink, NavbarButton } from "../components/Navbar";
import { Outlet } from "react-router-dom";

const mentorLinks: NavbarLink[] = [
  { label: "Home", to: "/mentor" },
  { label: "Sessions", to: "/sessions" }, // TODO: hehe
  { label: "About", to: "/about" }, // TODO: hehe
];

const mentorButtons: NavbarButton[] = [
  { label: "Dashboard", onClick: () => { window.location.href = "/"; }, variant: "outline" }, // TODO: Fix route
];

export default function MentorLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar links={mentorLinks} buttons={mentorButtons} />
      <Outlet />
    </div>
  );
} 