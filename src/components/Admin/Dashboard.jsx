import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  MdCreditCard, MdQuiz, MdBook, MdNotifications, MdLogout,
  MdPeople, MdSchool, MdExpandMore, MdExpandLess, MdLightbulb,
  MdPsychology, MdFavorite, MdDashboard, MdGrade, MdSlideshow,
  MdChildCare, MdAccountCircle, MdSelfImprovement,
  MdList, MdTune, MdStar, MdQuestionAnswer, MdChat, MdEmojiEvents,
  MdVideoLibrary, MdDarkMode, MdLightMode,
} from "react-icons/md";
import logo from "../../assets/logo.jpeg";

const AdminDashboard = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [userMgmtOpen,setUserMgmtOpen] = useState(true);
  const [customizeLearningOpen,setCustomizeLearningOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [homeMgmtOpen, setHomeMgmtOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };



  const subscriptionItems = [
    { path: "/admin/subscription/plans",        label: "Plans",        icon: <MdCreditCard /> },
    { path: "/admin/subscription/testimonials", label: "Testimonials", icon: <MdStar /> },
    { path: "/admin/subscription/faq",          label: "FAQ",          icon: <MdQuiz /> },
  ];

  const userMgmtItems = [
    { path: "/admin/intro-slides",label: "Intro Slides",icon: <MdSlideshow /> },
    { path: "/admin/child-details",label: "Child Details", icon: <MdChildCare /> },
    { path: "/admin/grade",label: "Grade",             icon: <MdGrade /> },
    { path: "/admin/educational-board",label: "Educational Board", icon: <MdSchool /> },
    { path: "/admin/select-avatar",label: "Select Avatar",     icon: <MdAccountCircle /> },
  ];

  const customizeLearningItems = [
    { path: "/admin/all-topics",label: "All Topics",icon: <MdList /> },
    { path: "/admin/core-area",label: "Core Area",icon: <MdSchool /> },
    { path: "/admin/beyond-school",label: "Beyond School",icon: <MdSelfImprovement /> },
  ];

  const homeMgmtItems = [
    { path: "/admin/did-you-know",label: "Did You Know",icon: <MdLightbulb /> },
    { path: "/admin/todays-riddle",label: "Today's Riddles",icon: <MdPsychology /> },
    { path: "/admin/parenting-insight",label: "Parenting Insights",icon: <MdFavorite /> },
  ];



  // ── Sub-components ──────────────────────────────────────────────────────────
  const NavItem = ({ item }) => (
    <NavLink to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
          isActive
            ? "bg-[#00bf62] text-white shadow-md shadow-[#00bf62]/30"
            : "text-gray-400 hover:bg-white/6 hover:text-white"
        }`}>
      <span className="text-base shrink-0">{item.icon}</span>
      {item.label}
    </NavLink>
  );

  const GroupHeader = ({ label, icon, isOpen, onToggle, accent = "#00bf62" }) => (
    <button onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2.5 mt-1 rounded-xl hover:bg-white/5 transition group">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0"
          style={{ backgroundColor: `${accent}20`, color: accent }}>
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>{label}</span>
      </div>
      <span className="text-gray-600 group-hover:text-gray-300 transition">
        {isOpen ? <MdExpandLess /> : <MdExpandMore />}
      </span>
    </button>
  );

  const SubGroupHeader = ({ label, icon, isOpen, onToggle }) => (
    <button onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2 mt-0.5 rounded-lg hover:bg-white/5 transition">
      <div className="flex items-center gap-2">
        <span className="text-[#00bf62] text-base">{icon}</span>
        <span className="text-xs font-semibold text-gray-400">{label}</span>
      </div>
      <span className="text-gray-600 text-sm">{isOpen ? <MdExpandLess /> : <MdExpandMore />}</span>
    </button>
  );

  const Divider = () => <div className="my-2 border-t border-white/5 mx-2" />;

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes("intro-slides"))                return "Intro Slides";
    if (p.includes("child-details"))               return "Child Details";
    if (p.includes("grade"))                       return "Grade";
    if (p.includes("educational-board"))           return "Educational Board";
    if (p.includes("select-avatar"))               return "Select Avatar";
    if (p.includes("all-topics"))                  return "All Topics";
    if (p.includes("core-area"))                   return "Core Area";
    if (p.includes("beyond-school"))               return "Beyond School";
    if (p.includes("did-you-know"))                return "Did You Know";
    if (p.includes("todays-riddle"))               return "Today's Riddles";
    if (p.includes("parenting-insight"))           return "Parenting Insights";
    if (p.includes("subscription/plans"))          return "Subscription Plans";
    if (p.includes("subscription/testimonials"))   return "Testimonials";
    if (p.includes("subscription/faq"))            return "FAQ";
    if (p.includes("learning-subjects/subjects"))  return "Subjects";
    return "Dashboard";
  };

  const bg   = darkMode ? "bg-[#0d0d0d]" : "bg-[#f0f4f8]";
  const hBg  = darkMode ? "bg-[#111] border-white/5" : "bg-white border-gray-200";
  const hTxt = darkMode ? "text-gray-100" : "text-gray-800";
  const hSub = darkMode ? "text-gray-500" : "text-gray-400";

  return (
    <div className={`flex min-h-screen ${bg} transition-colors duration-300`}>

      {/* ── Sidebar ── */}
      <aside className="w-[260px] bg-[#0f1117] text-white flex flex-col shadow-2xl shrink-0 rounded-r-3xl overflow-hidden">

        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white p-0.5 shadow-lg shrink-0">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-extrabold bg-gradient-to-r from-[#00bf62] to-[#f6c572] bg-clip-text text-transparent leading-tight">
                Nudge2Grow
              </h2>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">

          {/* User Management */}
          <GroupHeader label="User Management" icon={<MdPeople />} isOpen={userMgmtOpen} onToggle={() => setUserMgmtOpen(p => !p)} />
          {userMgmtOpen && (
            <div className="pl-2 space-y-0.5 border-l border-[#00bf62]/15 ml-3">
              {userMgmtItems.map(item => <NavItem key={item.path} item={item} />)}
              <SubGroupHeader label="Customize Learning" icon={<MdTune />} isOpen={customizeLearningOpen} onToggle={() => setCustomizeLearningOpen(p => !p)} />
              {customizeLearningOpen && (
                <div className="pl-2 space-y-0.5">
                  {customizeLearningItems.map(item => <NavItem key={item.path} item={item} />)}
                </div>
              )}
            </div>
          )}

          <Divider />

          {/* Learning Subjects */}
          <NavItem item={{ path: "/admin/Learning-Subjects", label: "Learning Subjects", icon: <MdBook /> }} />

          <Divider />

          {/* Subscription */}
          <GroupHeader label="Subscription" icon={<MdCreditCard />} isOpen={subscriptionOpen} onToggle={() => setSubscriptionOpen(p => !p)} accent="#f59e0b" />
          {subscriptionOpen && (
            <div className="pl-2 space-y-0.5 border-l border-amber-500/20 ml-3">
              {subscriptionItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          )}

          <Divider />

          {/* Home Management */}
          <GroupHeader label="Home Management" icon={<MdDashboard />} isOpen={homeMgmtOpen} onToggle={() => setHomeMgmtOpen(p => !p)} accent="#10b981" />
          {homeMgmtOpen && (
            <div className="pl-2 space-y-0.5 border-l border-emerald-500/20 ml-3">
              {homeMgmtItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="px-2.5 py-3 border-t border-white/6">
          <button onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition font-bold text-sm flex items-center justify-center gap-2">
            <MdLogout className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className={`${hBg} border-b px-8 py-4 flex items-center justify-between shadow-sm shrink-0 transition-colors duration-300`}>
          <div>
            <h1 className={`text-2xl font-extrabold ${hTxt}`}>{getPageTitle()}</h1>
            <p className={`text-xs mt-0.5 ${hSub}`}>Nudge2Grow Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button onClick={() => setDarkMode(d => !d)}
              className={`p-2.5 rounded-xl border transition ${darkMode ? "bg-white/10 border-white/10 text-yellow-400 hover:bg-white/15" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
              title={darkMode ? "Light Mode" : "Dark Mode"}>
              {darkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>

            {/* Notifications */}
            <button className={`relative p-2.5 rounded-xl border transition ${darkMode ? "bg-white/10 border-white/10 text-gray-300 hover:bg-white/15" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
              <MdNotifications className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00bf62] rounded-full border-2 border-white" />
            </button>

            {/* Date/Time */}
            <div className={`px-4 py-2 rounded-xl border text-right ${darkMode ? "bg-white/5 border-white/10" : "bg-gradient-to-r from-[#00bf62]/8 to-[#f6c572]/8 border-[#00bf62]/15"}`}>
              <p className={`text-xs font-semibold ${hSub}`}>
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </p>
              <p className="text-xs text-[#00bf62] font-bold">
                {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
