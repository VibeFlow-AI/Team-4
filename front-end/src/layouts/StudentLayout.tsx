import { Navbar } from "../components/Navbar";
import type { NavbarLink, NavbarButton } from "../components/Navbar";
import { Outlet } from "react-router-dom";

const studentLinks: NavbarLink[] = [
  { label: "Home", to: "/student" },
  { label: "About", to: "/about" }, // TODO: hehe
];

const studentButtons: NavbarButton[] = [
  { label: "Logout", onClick: () => { window.location.href = "/"; }, variant: "outline" }, // TODO: Fix route
];

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar links={studentLinks} buttons={studentButtons} />
      <Outlet />
    </div>
  );
} 