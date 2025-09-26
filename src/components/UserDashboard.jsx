import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // get current logged in user
    const current = JSON.parse(localStorage.getItem("currentUser"));
    if (!current) {
      navigate("/"); // if no user, go back to login
      return;
    }
    setUser(current);

    // fetch purchases for this user
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
    const userData = allUsers[current.email] || {};
    setCourses(userData.purchasedCourses || []);
  }, [navigate]);

  const handleToggleModule = (courseId, moduleIdx) => {
    if (!user) return;
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
    const userData = allUsers[user.email];

    const updatedCourses = userData.purchasedCourses.map((course) => {
      if (course.id === courseId) {
        const modules = course.modules.map((m, i) =>
          i === moduleIdx ? { ...m, completed: !m.completed } : m
        );
        return { ...course, modules };
      }
      return course;
    });

    userData.purchasedCourses = updatedCourses;
    allUsers[user.email] = userData;

    // update storage
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCourses(updatedCourses);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="dashboard" style={{ maxWidth: 1000, margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>👋 Welcome, {user?.username || "Student"}</h1>
        <div>
          <button onClick={() => navigate("/")} style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
            Browse More Courses
          </button>
          <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
            Logout
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: "20px" }}>📦 Your Purchased Courses</h2>

      {courses.length === 0 ? (
        <p>You haven’t purchased any courses yet.</p>
      ) : (
        courses.map((course) => {
          const total = course.modules.length;
          const completed = course.modules.filter((m) => m.completed).length;
          const percent = total ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={course.id} className="course-card">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>
                <strong>Instructor:</strong> {course.instructor} |{" "}
                <strong>Duration:</strong> {course.duration} | ⭐ {course.rating} ({course.reviews} reviews)
              </p>
              <div className="progress">
                <div className="progress-fill" style={{ width: `${percent}%` }}></div>
              </div>
              <p>{percent}% completed</p>

              <h4>📚 Classes & Topics</h4>
              <ul className="modules-list">
                {course.modules.map((m, idx) => (
                  <li key={idx} className={m.completed ? "completed" : ""}>
                    <div className="module-info">
                      <input
                        type="checkbox"
                        className="module-checkbox"
                        checked={!!m.completed}
                        onChange={() => handleToggleModule(course.id, idx)}
                      />
                      <div className="module-texts">
                        <span className="module-title">
                          {m.title} ({m.duration})
                        </span>
                        {m.topic && <span className="module-sub">{m.topic}</span>}
                      </div>
                    </div>
                    <button
                      className="continue-btn"
                      onClick={() => alert(`🚀 Continuing in ${course.title} → ${m.title}`)}
                    >
                      ▶ Continue
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}

export default UserDashboard;
