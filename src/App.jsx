import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pathsetting from "./Pathsetting";
import CourseDetail from "./components/CourseDetail";
import Payment from "./components/Payment";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/AdminPage";
import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pathsetting />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/payment/:courseId" element={<Payment />} />
        <Route path="/dashboard/:username" element={<UserDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;