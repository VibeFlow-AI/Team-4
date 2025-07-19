import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "../components/Navbar";
import type { NavbarLink, NavbarButton } from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";

const studentLinks: NavbarLink[] = [
  { label: "Home", to: "/student" },
  { label: "About", to: "/about" }, // TODO: hehe
];

const studentButtons: NavbarButton[] = [
  { label: "Logout", onClick: () => { window.location.href = "/"; }, variant: "outline" }, // TODO: Fix route
];

export default function StudentLayout() {
  const sidebarLinks = [
    { to: "/student", icon: <Search />, label: "Discover" },
    { to: "/student/booked", icon: <BookOpen />, label: "Booked" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar links={studentLinks} buttons={studentButtons} home={false}/>
      <div className="flex flex-row">
        <div className="w-28 h-screen">
          <div className="h-[75%] bg-white outline-0 rounded-b-4xl flex items-center justify-center">
            <Sidebar links={sidebarLinks} />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
} 