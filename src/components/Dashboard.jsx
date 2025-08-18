import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./Dashboard.css";

// ✅ Sample Courses with module details (topics + durations)
const sampleCourses = [
  {
    id: 1,
    title: "Full Stack Bootcamp",
    instructor: "GreatStack",
    category: "Web Development",
    duration: "12h",
    rating: 5,
    reviews: 120,
    price: 49.99,
    purchaseDate: "2025-08-01",
    description: "Learn MERN stack end-to-end (React, Node, MongoDB, Deployment).",
    modules: [
      { title: "Intro & Setup", duration: "15m", topic: "Environment setup, tools", completed: true },
      { title: "Frontend Basics", duration: "2h", topic: "React components, CSS basics", completed: false },
      { title: "Backend API", duration: "2h 30m", topic: "Express REST API, routing", completed: false },
      { title: "Database (MongoDB)", duration: "1.5h", topic: "CRUD operations, Mongoose", completed: false },
      { title: "Deployment", duration: "1h", topic: "Hosting on cloud, CI/CD", completed: false },
    ],
    models: [
      { name: "Git Essentials", description: "Branches, Merge & Pull Requests" },
      { name: "JavaScript Fundamentals", description: "Variables, Functions, ES6+" },
      { name: "REST Principles", description: "GET, POST, PUT, DELETE basics" },
    ],
  },
  {
    id: 2,
    title: "HTML & CSS Fundamentals",
    instructor: "CodeAcademy",
    category: "Frontend",
    duration: "6h",
    rating: 4.5,
    reviews: 98,
    price: 29.99,
    purchaseDate: "2025-08-05",
    description: "Master the building blocks of the web.",
    modules: [
      { title: "HTML Basics", duration: "1h", topic: "Headings, paragraphs, images", completed: true },
      { title: "CSS Basics", duration: "1.5h", topic: "Selectors, colors, fonts", completed: false },
      { title: "Flexbox & Grid", duration: "2h", topic: "Modern layout design", completed: false },
      { title: "Responsive Design", duration: "1.5h", topic: "Media queries, mobile-first", completed: false },
    ],
    models: [
      { name: "HTML Cheatsheet", description: "Quick tags & attributes" },
      { name: "CSS Toolkit", description: "Flexbox, Grid utility classes" },
      { name: "Accessibility Guide", description: "Alt text, semantic elements" },
    ],
  },
];

function Dashboard() {
  const { username } = useParams();
  const location = useLocation();
  const purchasedCourse = location.state?.purchasedCourse || null;
  const purchasesKey = `purchases_${username}`;
  const [courses, setCourses] = useState(sampleCourses);

  // handle checkbox toggle for modules
  const handleToggleModule = (courseId, moduleIdx) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          const modules = course.modules.map((m, i) =>
            i === moduleIdx ? { ...m, completed: !m.completed } : m
          );
          return { ...course, modules };
        }
        return course;
      })
    );
  };

  // simulate Continue button click → go to module
  const handleContinueModule = (courseTitle, moduleTitle) => {
    alert(`🚀 Continuing in ${courseTitle} → ${moduleTitle}`);
  };

  return (
    <div className="dashboard" style={{ maxWidth: 1000, margin: "auto" }}>
      <h1>👋 Welcome, {username || "Student"}</h1>

      {courses.map((course) => {
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

            {/* Progress bar */}
            <div className="progress">
              <div className="progress-fill" style={{ width: `${percent}%` }}></div>
            </div>
            <p>{percent}% completed</p>

            {/* Modules (Classes) */}
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
          <span className="module-title">{m.title} ({m.duration})</span>
          {m.topic && <span className="module-sub">{m.topic}</span>}
        </div>
      </div>

      <button
        className="continue-btn"
        onClick={() => handleContinueModule(course.title, m.title)}
      >
        ▶ Continue
      </button>
    </li>
  ))}
</ul>


            {/* Fundamentals / Models */}
            {course.models?.length > 0 && (
              <div className="models-section">
                <h4>🛠 Course Fundamentals</h4>
                <ul>
                  {course.models.map((m, i) => (
                    <li key={i}>
                      <strong>{m.name}</strong>: {m.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;
