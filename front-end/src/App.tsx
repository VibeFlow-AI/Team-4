import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import StudentLayout from "./layouts/StudentLayout";
import MentorLayout from "./layouts/MentorLayout";
import MentorHomePage from "./pages/mentor/MentorDashboard";
import StudentBookedPage from "./pages/student/StudentBooked";
import StudentDiscoverPage from "./pages/student/StudentDiscover";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Student routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDiscoverPage />} />
          <Route path="booked" element={<StudentBookedPage />} />

        </Route>
        {/* Mentor routes */}
        <Route path="mentor" element={<MentorLayout />}>
          <Route index element={<MentorHomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
