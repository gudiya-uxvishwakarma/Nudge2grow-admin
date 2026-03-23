import React, { useState } from "react";
import {
  Bell,
  Menu,
  UserPlus,
  Eye,
  CardSim,
  Image as ImageIcon,
  Beaker,
  CircleUserRound,
  Contact,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom"; // ✅ useLocation to highlight active menu
import Logo from "/src/Images/logo.png";

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
   
  
    {
      id: "Subscription-Plan",
      name: "Subscription",
      icon: <CardSim size={20} />,
      path: "/admin/Subscription-Plan",
    },
    // {
    //   id: "Learning-Summary",
    //   name: "LearningSummary",
    //   icon: <CardSim size={20} />,
    //   path: "/admin/Learning-Summary",
    // },
    // {
    //   id: "Quiz",
    //   name: "Quiz",
    //   icon: <Beaker size={20} />,
    //   path: "/admin/Quiz",
    // },
    // {
    //   id: "Milestones",
    //   name: "Milestones",
    //   icon: <CircleUserRound />,
    //   path: "/admin/Milestones",
    // },
    {
      id: "Learning-Subjects",
      name: "LearningSubjects",
      icon: <Contact />,
      path: "/admin/Learning-Subjects",
    },
    {
      id: "login",
      name: "logout",
      icon:  <CardSim size={20} />,
      path: "/admin/login",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-30 w-64 bg-[#083744] text-white transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-0" : "-ml-64"
        } md:ml-0`}>
        <div className="p-4 border-b border-[#0a4453]">
          <div className="flex items-center">
            <img src={Logo} alt="" className="h-20 w-28" />
            <div>
              <h1 className="text-xl font-bold">Nudge2grow</h1>
              <p className="text-[#ccb28b] text-sm">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-[#ccb28b] text-[#083744] shadow-md"
                      : "text-gray-200 hover:bg-[#0a4453] hover:text-white"
                  }`}>
                  <span
                    className={`${
                      location.pathname === item.path
                        ? "text-[#083744]"
                        : "text-[#ccb28b]"
                    }`}>
                    {item.icon}
                  </span>
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-gray-500 focus:outline-none md:hidden">
                <Menu size={24} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-1 text-gray-500 hover:text-[#083744]">
                <Bell size={24} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#083744] rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="ml-2 text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Nested routes will render here */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet /> {/* ✅ All child routes appear here */}
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default AdminPanel;
