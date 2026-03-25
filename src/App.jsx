import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Admin/Login'
import Dashboard from './components/Admin/Dashboard'
import AdminLearningSubjects from './components/Admin/AdminLearningSubjects'
import AdminSubscriptionPlan from './components/Admin/AdminSubscriptionPlan'
import AdminPlans from './components/Admin/Subscription/AdminPlans'
import AdminTestimonials from './components/Admin/Subscription/AdminTestimonials'
import AdminFAQ from './components/Admin/Subscription/AdminFAQ'



// User Management

import AdminGrade from './components/UserManagement/AdminGrade'
import AdminEducationalBoard from './components/UserManagement/AdminEducationalBoard'
import AdminIntroSlides from './components/UserManagement/AdminIntroSlides'
import AdminChildDetails from './components/UserManagement/AdminChildDetails'
import AdminSelectAvatar from './components/UserManagement/AdminSelectAvatar'
import AdminCustomizeLearning from './components/UserManagement/AdminCustomizeLearning'
import AdminFaithBackground from './components/UserManagement/AdminFaithBackground'

// Customize Learning Management
import AllTopics from './components/UserManagement/CustomizeLearning/AllTopics'
import CoreArea from './components/UserManagement/CustomizeLearning/CoreArea'
import BeyondSchool from './components/UserManagement/CustomizeLearning/BeyondSchool'

// Home Management
import AdminDidYouKnow from './components/HomeManagement/AdminDidYouKnow'
import AdminTodaysRiddle from './components/HomeManagement/AdminTodaysRiddle'
import AdminParentingInsight from './components/HomeManagement/AdminParentingInsight'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Navigate to="grade" replace />} />

          {/* Main Pages */}
          <Route path="Subscription-Plan" element={<AdminSubscriptionPlan />} />
          <Route path="subscription/plans" element={<AdminPlans />} />
          <Route path="subscription/testimonials" element={<AdminTestimonials />} />
          <Route path="subscription/faq" element={<AdminFAQ />} />
          <Route path="Learning-Subjects" element={<AdminLearningSubjects />} />

          {/* User Management */}
          <Route path="grade" element={<AdminGrade />} />
          <Route path="educational-board" element={<AdminEducationalBoard />} />
          <Route path="intro-slides" element={<AdminIntroSlides />} />
          <Route path="child-details" element={<AdminChildDetails />} />
          <Route path="select-avatar" element={<AdminSelectAvatar />} />
          <Route path="customize-learning" element={<AdminCustomizeLearning />} />
          <Route path="faith-background" element={<AdminFaithBackground />} />

          {/* Customize Learning Management */}
          <Route path="all-topics" element={<AllTopics />} />
          <Route path="core-area" element={<CoreArea />} />
          <Route path="beyond-school" element={<BeyondSchool />} />

          {/* Home Management */}
          <Route path="did-you-know" element={<AdminDidYouKnow />} />
          <Route path="todays-riddle" element={<AdminTodaysRiddle />} />
          <Route path="parenting-insight" element={<AdminParentingInsight />} />

          {/* Catch-all — redirect unknown admin paths */}
          <Route path="*" element={<Navigate to="/admin/grade" replace />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App;
