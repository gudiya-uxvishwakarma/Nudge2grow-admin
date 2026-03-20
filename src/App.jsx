import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Admin/Login'
import Dashboard from './components/Admin/Dashboard'
import AdminIntroScreen from './components/Admin/AdminIntroScreen'
import AdminPersonalSetupScreen from './components/Admin/AdminPersonalSetupScreen'
import AdminHome from './components/Admin/AdminHome'
import AdminSubscriptionPlan from './components/Admin/AdminSubscriptionPlan'
// import AdminLearningSummary from './components/Admin/AdminLearningSummary'
import AdminQuiz from './components/Admin/AdminQuiz'
// import AdminMilestones from './components/Admin/AdminMilestones'
import AdminLearningSubjects from './components/Admin/AdminLearningSubjects'
import AdminGrade from './components/Admin/AdminGrade'
import AdminEducationalBoard from './components/Admin/AdminEducationalBoard'

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
          <Route index element={<Navigate to="home" replace />} />
          <Route path="IntroScreen" element={<AdminIntroScreen />} />
          <Route path="PersonalSetupScreen" element={<AdminPersonalSetupScreen />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="Subscription-Plan" element={<AdminSubscriptionPlan />} />
          {/* <Route path="Learning-Summary" element={<AdminLearningSummary />} /> */}
          <Route path="Quiz" element={<AdminQuiz />} />
          {/* <Route path="Milestones" element={<AdminMilestones />} /> */}
          <Route path="Learning-Subjects" element={<AdminLearningSubjects />} />
          <Route path="grade" element={<AdminGrade />} />
          <Route path="educational-board" element={<AdminEducationalBoard />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App;
