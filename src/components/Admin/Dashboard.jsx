import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  MdCreditCard, MdQuiz, MdBook, MdNotifications, MdLogout,
  MdPeople, MdSchool, MdExpandMore, MdExpandLess, MdLightbulb,
  MdPsychology, MdFavorite, MdDashboard, MdGrade, MdSlideshow,
  MdChildCare, MdAccountCircle, MdSelfImprovement,
  MdList, MdTune, MdStar
} from "react-icons/md";
import logo from "../../assets/logo.jpeg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMgmtOpen, setUserMgmtOpen] = useState(true);
  const [customizeLearningOpen, setCustomizeLearningOpen] = useState(true);
  const [subscriptionOpen, setSubscriptionOpen] = useState(true);
  const [homeMgmtOpen, setHomeMgmtOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const topMenuItems = [
 
    { path: "/admin/Learning-Subjects", label: "Learning Subjects", icon: <MdBook /> },
  ];

  const subscriptionItems = [
    { path: "/admin/subscription/plans", label: "Plans", icon: <MdCreditCard />, },
    { path: "/admin/subscription/testimonials", label: "Testimonials", icon: <MdStar />,  },
    { path: "/admin/subscription/faq", label: "FAQ", icon: <MdQuiz />, },
  ];

  // Order: Intro Slides → Child Details → Grade → Educational Board → Select Avatar
  const userMgmtItems = [
    { path: "/admin/intro-slides", label: "Intro Slides", icon: <MdSlideshow /> },
    { path: "/admin/child-details", label: "Child Details", icon: <MdChildCare /> },
    { path: "/admin/grade", label: "Grade", icon: <MdGrade /> },
    { path: "/admin/educational-board", label: "Educational Board", icon: <MdSchool /> },
    { path: "/admin/select-avatar", label: "Select Avatar", icon: <MdAccountCircle /> },
  ];

  const customizeLearningItems = [
    { path: "/admin/all-topics", label: "All Topics", icon: <MdList />, },
    { path: "/admin/core-area", label: "Core Area", icon: <MdSchool />, },
    { path: "/admin/beyond-school", label: "Beyond School", icon: <MdSelfImprovement />,},
  ];

  const homeMgmtItems = [
    { path: "/admin/did-you-know", label: "Did You Know", icon: <MdLightbulb /> },
    { path: "/admin/todays-riddle", label: "Today's Riddles", icon: <MdPsychology /> },
    { path: "/admin/parenting-insight", label: "Parenting Insights", icon: <MdFavorite /> },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-[#00bf62] to-[#00a055] text-white shadow-lg shadow-[#00bf62]/20"
            : "text-gray-300 hover:bg-white/8 hover:text-white"
        }`
      }>
      <span className="text-2xl shrink-0">{item.icon}</span>
      <span className="font-semibold text-base">{item.label}</span>
    </NavLink>
  );



  const CustomizeLearningCard = ({ item }) => (
    <NavLink to={item.path}>
      {({ isActive }) => (
        <div className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${isActive ? "ring-2 ring-white/60 scale-[1.02]" : "hover:scale-[1.02]"}`}>
          <div className={`bg-gradient-to-br ${item.bg} p-3 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white text-xl shrink-0">
              {item.icon}
            </div>
            <span className="text-white font-bold text-sm leading-tight">{item.label}</span>
            {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-white shrink-0" />}
          </div>
        </div>
      )}
    </NavLink>
  );

  const GroupHeader = ({ label, icon, isOpen, onToggle, accent = "#00bf62" }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-4 mt-3 mb-1 rounded-xl hover:bg-white/5 transition group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${accent}22`, color: accent }}>
          {icon}
        </div>
        <span className="text-base font-bold uppercase tracking-widest" style={{ color: accent }}>{label}</span>
      </div>
      <span className="text-gray-500 group-hover:text-gray-300 transition text-2xl">
        {isOpen ? <MdExpandLess /> : <MdExpandMore />}
      </span>
    </button>
  );

  const SubGroupHeader = ({ label, icon, isOpen, onToggle }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 mt-1 mb-0.5 rounded-lg hover:bg-white/5 transition ml-2">
      <div className="flex items-center gap-3">
        <span className="text-[#00bf62] text-2xl">{icon}</span>
        <span className="text-base font-semibold text-gray-400">{label}</span>
      </div>
      <span className="text-gray-500 text-xl">{isOpen ? <MdExpandLess /> : <MdExpandMore />}</span>
    </button>
  );

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("intro-slides")) return "Intro Slides";
    if (path.includes("child-details")) return "Child Details";
    if (path.includes("grade")) return "Grade";
    if (path.includes("educational-board")) return "Educational Board";
    if (path.includes("select-avatar")) return "Select Avatar";
    if (path.includes("all-topics")) return "All Topics";
    if (path.includes("core-area")) return "Core Area";
    if (path.includes("beyond-school")) return "Beyond School";
    if (path.includes("did-you-know")) return "Did You Know";
    if (path.includes("todays-riddle")) return "Today's Riddles";
    if (path.includes("parenting-insight")) return "Parenting Insights";
    if (path.includes("Subscription")) return "Subscription";
    if (path.includes("subscription/plans")) return "Subscription Plans";
    if (path.includes("subscription/testimonials")) return "Testimonials";
    if (path.includes("subscription/faq")) return "Frequently Asked Questions";
    if (path.includes("Quiz")) return "Quiz";
    if (path.includes("Learning-Subjects")) return "Learning Subjects";
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      {/* Sidebar */}
      <aside className="w-[380px] bg-[#0f1117] text-white flex flex-col shadow-2xl border-r border-white/5 shrink-0">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-0.5 shadow-lg shrink-0">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#00bf62] to-[#f6c572] bg-clip-text text-transparent leading-tight">
                Nudge2Grow
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5 scrollbar-thin">

          {/* User Management */}
          <GroupHeader label="User Management" icon={<MdPeople />} isOpen={userMgmtOpen} onToggle={() => setUserMgmtOpen(p => !p)} />
          {userMgmtOpen && (
            <div className="space-y-0.5 pl-1 border-l border-[#00bf62]/15 ml-4">
              {userMgmtItems.map(item => <NavItem key={item.path} item={item} />)}

              {/* Customize Learning sub-group */}
              <SubGroupHeader
                label="Customize Learning"
                icon={<MdTune />}
                isOpen={customizeLearningOpen}
                onToggle={() => setCustomizeLearningOpen(p => !p)}
              />
              {customizeLearningOpen && (
                <div className="grid grid-cols-1 gap-2 px-2 pb-2">
                  {customizeLearningItems.map(item => (
                    <CustomizeLearningCard key={item.path} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="my-3 border-t border-white/6" />

          {/* Other Pages */}
          <div className="space-y-0.5">
            {topMenuItems.map(item => <NavItem key={item.path} item={item} />)}
          </div>

          {/* Subscription group */}
          <GroupHeader label="Subscription" icon={<MdCreditCard />} isOpen={subscriptionOpen} onToggle={() => setSubscriptionOpen(p => !p)} accent="#00aa59" />
          {subscriptionOpen && (
            <div className="grid grid-cols-1 gap-2 px-2 pb-2">
              {subscriptionItems.map(item => (
                <CustomizeLearningCard key={item.path} item={item} />
              ))}
            </div>
          )}

          {/* Home Management */}
          <GroupHeader label="Home Management" icon={<MdDashboard />} isOpen={homeMgmtOpen} onToggle={() => setHomeMgmtOpen(p => !p)} accent="#009f41" />
          {homeMgmtOpen && (
            <div className="space-y-0.5 pl-1 border-l border-[#f6c572]/15 ml-4">
              {homeMgmtItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 font-bold text-base flex items-center justify-center gap-2">
            <MdLogout className="text-2xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">{getPageTitle()}</h1>
            <p className="text-gray-400 text-sm mt-0.5">Nudge2Grow Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition">
              <MdNotifications className="text-2xl text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#00bf62] rounded-full border-2 border-white"></span>
            </button>
            <div className="bg-gradient-to-r from-[#00bf62]/10 to-[#f6c572]/10 border border-[#00bf62]/20 px-5 py-2.5 rounded-xl">
              <p className="text-sm font-semibold text-gray-600">
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="text-sm text-[#00bf62] font-bold">{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
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
