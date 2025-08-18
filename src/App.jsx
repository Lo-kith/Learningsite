// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pathsetting from "./Pathsetting";
import CourseDetail from "./components/CourseDetail";
import Payment from "./components/Payment";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound"; // create this simple 404 component (optional)
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pathsetting />} />

        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/payment/:courseId" element={<Payment />} />

        {/* dynamic username param so /dashboard/lokith matches */}
        <Route path="/dashboard/:username" element={<Dashboard />} />

        {/* keep plain /dashboard if you also want /dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
       

        {/* fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
