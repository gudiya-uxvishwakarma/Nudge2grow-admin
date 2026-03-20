import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { 
  MdScreenshot, 
  MdLogin, 
  MdPerson, 
  MdHome, 
  MdCreditCard, 
  MdBarChart, 
  MdQuiz, 
  MdFlag, 
  MdBook,
  MdNotifications,
  MdLogout,
  MdSchool
} from "react-icons/md";
import logo from "../../assets/logo.jpeg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/IntroScreen", label: "IntroScreen", icon: <MdScreenshot /> },
    { path: "/admin/PersonalSetupScreen", label: "PersonalSetupScreen", icon: <MdPerson /> },
    { path: "/admin/home", label: "Home", icon: <MdHome /> },
    { path: "/admin/Subscription-Plan", label: "Subscription", icon: <MdCreditCard /> }, 
    { path: "/admin/grade", label: "Grade", icon: <MdCreditCard /> },
    { path: "/admin/educational-board", label: "Educational Board", icon: <MdSchool /> },
    // { path: "/admin/Learning-Summary", label: "LearningSummary", icon: <MdBarChart /> },
    { path: "/admin/Quiz", label: "Quiz", icon: <MdQuiz /> },
    // { path: "/admin/Milestones", label: "Milestones", icon: <MdFlag /> },
    { path: "/admin/Learning-Subjects", label: "LearningSubjects", icon: <MdBook /> },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-[#000000] text-white flex flex-col transition-all duration-300 shadow-2xl border-r-2 border-[#00bf62]/20`}>
        {/* Logo & Toggle */}
        <div className="p-6 border-b-2 border-[#00bf62]/30 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Nudge2Grow Logo" className="w-10 h-10 rounded-lg object-contain bg-white p-0.5" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00bf62] to-[#f6c572] bg-clip-text text-transparent">
                Nudge2Grow
              </h2>
            </div>
          )}
         
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#00bf62] to-[#00a055] shadow-lg shadow-[#00bf62]/50 scale-105"
                    : "hover:bg-gradient-to-r hover:from-[#00bf62]/10 hover:to-[#f6c572]/10 hover:translate-x-1 hover:border hover:border-[#00bf62]/30"
                }`
              }>
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t-5 border-[#00bf62]/30">
          {isSidebarOpen && (
            <div className="">
             
              
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2">
            <MdLogout className="text-xl" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-lg px-8 py-4 border-b-4 border-[#00bf62]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00bf62] to-[#f6c572] bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-3 bg-gradient-to-r from-[#00bf62]/10 to-[#f6c572]/10 rounded-full hover:from-[#00bf62]/20 hover:to-[#f6c572]/20 transition-colors relative border border-[#00bf62]/30">
                  <MdNotifications className="text-xl text-gray-700" />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-[#f6c572] rounded-full border-2 border-white animate-pulse"></span>
                </button>
              </div>
              <div className="text-right bg-gradient-to-r from-[#00bf62]/5 to-[#f6c572]/5 px-4 py-2 rounded-lg border border-[#00bf62]/20">
                <p className="text-sm font-semibold text-gray-700">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-[#00bf62] font-medium">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 via-[#00bf62]/5 to-[#f6c572]/5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
