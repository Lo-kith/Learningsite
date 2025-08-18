import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login"; 
import { useNavigate } from "react-router-dom";

function Pathsetting() {
  const [courseSearch, setCourseSearch] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const courses = [
    { id: 1, title: "Cloud Computing Essentials", instructor: "GreatStack", rating: 5, reviews: "211k", price: 55.99, image: "/Cloud.webp" },
    { id: 2, title: "Advanced Python Programming", instructor: "GreatStack", rating: 4, reviews: "150k", price: 67.99, image: "/Python dev.webp" },
    { id: 3, title: "Web Development Bootcamp", instructor: "GreatStack", rating: 5, reviews: '510k', price: 74.99, image: "/Web dev.jpg" },
    { id: 4, title: "Cybersecurity Basics", instructor: "GreatStack", rating: 4, reviews: '11k', price: 59.49, image: "/cyber.jpg" },
    { id: 5, title: "JavaScript Fundamentals", instructor: "GreatStack", rating: 5, reviews: "151K", price: 49.99, image: "/Java script.jpg" },
    { id: 6, title: "Data Structures & Algorithms", instructor: "GreatStack", rating: 4, reviews: "11K", price: 69.99, image: "/Datastructure.jpg" },
    { id: 7, title: "UI/UX Design Masterclass", instructor: "GreatStack", rating: 5, reviews: "11", price: 62.99, image: "/ui ux.webp" },
    { id: 8, title: "Machine Learning Basics", instructor: "GreatStack", rating: 4, reviews: "21k", price: 83.0, image: "/machine.jpg" },
    { id: 9, title: "Complete Website in React JS", instructor: "GreatStack", rating: 5, reviews: "21k", price: 79.99, image: "/act.jpg" },
    { id: 10, title: "Backend API Development", instructor: "GreatStack", rating: 4, reviews: "12k", price: 59.99, image: "/backend.webp" },
  ];

  function stars(r) {
    return "★".repeat(r) + "☆".repeat(5 - r);
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="container">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="logo">Basecamp</div>
        <button className="create-btn" onClick={() => setShowLogin(true)}>
          Create Account
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Empower Your Future with the</h2>
        <h1>
          Courses Designed to <span className="highlight">fit Your Choice</span>
        </h1>
        <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac.</p>
        <p>Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className="logos">
          <img src="/Adobe.png" alt="Adobe" />
          <img src="/Postman__software_-removebg-preview.png" alt="Postman" />
          <img src="/Google.png" alt="Google" />
          <img src="/Canva_Logo.svg.png" alt="Canva" />
          <img src="/Microsoft logo.png" alt="Microsoft" />
        </div>
      </section>

      {/* LMS Style Course List Section - CLICK ENABLED */}
      <div className="course-list-breadcrumbs">
        Home / <span className="breadcrumb-current">Course List</span>
      </div>
      <div className="course-list-title">Course List</div>
      <div className="lms-search">
        <input
          type="text"
          placeholder="Search for courses"
          value={courseSearch}
          onChange={e => setCourseSearch(e.target.value)}
        />
        <button>Search</button>
      </div>
      <div className="lms-course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div
              key={course.id}
              className="lms-course-card"
              onClick={() => navigate(`/course/${course.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={course.image} alt={course.title} />
              <div className="lms-course-card-content">
                <div className="lms-course-title">{course.title}</div>
                <div className="lms-course-instructor">{course.instructor}</div>
                <div className="lms-course-rating">
                  <span className="stars">{stars(course.rating)}</span>
                  <span className="rating-value">{course.rating}</span>
                  <span className="rating-reviews">({course.reviews})</span>
                </div>
                <div className="lms-course-price">${course.price.toFixed(2)}</div>
              </div>
            </div>
          ))
        ) : (
          <p>No courses found</p>
        )}
      </div>

      {/* LOGIN POPUP MODAL */}
      {showLogin && (
        <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowLogin(false)}
              aria-label="Close Login"
            >
              &times;
            </button>
            {Login ? <Login /> : <p>Unable to load login form 😢</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pathsetting;
