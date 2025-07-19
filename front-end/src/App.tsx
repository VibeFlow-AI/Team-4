import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import StudentLayout from "./layouts/StudentLayout";
import MentorLayout from "./layouts/MentorLayout";
import StudentHomePage from "./pages/student";
import MentorHomePage from "./pages/mentor";
import { StudentDashboard } from "./components/dashboard/StudentDashboard";
import { MentorDashboard } from "./components/dashboard/MentorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Student routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentHomePage />} />
        </Route>
        {/* Mentor routes */}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorHomePage />} />
          <Route path="dashboard" element={<MentorHomePage />} />
        </Route>
        {/* Dashboard routes */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/mentor" element={<MentorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
