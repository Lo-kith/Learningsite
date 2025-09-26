import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import Login from "./components/Login";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mockCourses from "./data/courses";
const API_BASE = "http://localhost:5000";

// ✅ Fixed normalizeCourse to handle string, buffer, blob properly
function normalizeCourse(course) {
  if (!course) return null;
  let imageSrc = "/default-course.jpg"; // default fallback
  
  console.log("Processing course image for:", course.name, "Raw image data:", course.image);
  
  if (course.image) {
    if (typeof course.image === "string") {
      // Full URL or relative path
      if (
        course.image.startsWith("http://") ||
        course.image.startsWith("https://")
      ) {
        imageSrc = course.image;
      }
      // Relative path - prepend API_BASE
      else if (course.image.startsWith("/")) {
        imageSrc = `${API_BASE}${course.image}`;
        console.log("Prepending API_BASE to relative path:", imageSrc);
      }
      // Blob url
      else if (course.image.startsWith("blob:")) {
        imageSrc = course.image;
      }
    }
    // If backend sends { data: Buffer, contentType }
    else if (course.image.data && course.image.contentType) {
      try {
        const base64 = btoa(
          new Uint8Array(course.image.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        imageSrc = `data:${course.image.contentType};base64,${base64}`;
        console.log("Converted buffer to data URL for:", course.name);
      } catch (err) {
        console.error("❌ Error converting buffer to base64:", err);
      }
    }
    // If Blob object
    else if (course.image instanceof Blob) {
      imageSrc = URL.createObjectURL(course.image);
      console.log("Created blob URL for:", course.name);
    }
  }
  
  console.log("Final image URL for", course.name, ":", imageSrc);
  
  return {
    _id: course._id || course.id || Math.random().toString(36).slice(2),
    name: course.name || course.title,
    instructor: course.instructor || "Unknown",
    rating: typeof course.rating === "number" ? course.rating : 4,
    reviews: typeof course.reviews === "number" ? course.reviews : 1,
    price: typeof course.price === "number" ? course.price : 0,
    image: imageSrc,
    description: course.description || "No description",
  };
}

// ✅ Memoized Course Card
const CourseCard = React.memo(({ course, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const stars = (r) => "★".repeat(r) + "☆".repeat(5 - r);
  
  // Debug logging
  useEffect(() => {
    console.log("CourseCard rendering for:", course.name, "Image URL:", course.image);
  }, [course.name, course.image]);
  
  return (
    <div
      className="lms-course-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="image-container">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={imageError ? "/default-course.jpg" : course.image}
          alt={course.name}
          className={imageLoaded ? "loaded" : ""}
          onLoad={() => {
            console.log("Image loaded successfully for:", course.name);
            setImageLoaded(true);
          }}
          onError={() => {
            console.error("Image failed to load for:", course.name, "URL:", course.image);
            setImageError(true);
            setImageLoaded(true);
          }}
          style={{ display: imageLoaded ? "block" : "none" }}
        />
      </div>
      <div className="lms-course-card-content">
        <div className="lms-course-title">{course.name}</div>
        <div className="lms-course-instructor">{course.description}</div>
        <div className="lms-course-rating">
          <span className="stars">{stars(course.rating)}</span>
          <span className="rating-value">{course.rating}</span>
          <span className="rating-reviews">({course.reviews}+)</span>
        </div>
        <div className="lms-course-price">${course.price?.toFixed(2)}</div>
      </div>
    </div>
  );
});

function Pathsetting() {
  const [courseSearch, setCourseSearch] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/items`);
        console.log("📦 Raw course data:", res.data); // Debugging
        
        if (Array.isArray(res.data) && res.data.length > 0) {
          const normalizedCourses = res.data.map(normalizeCourse);
          console.log("📦 Normalized courses:", normalizedCourses);
          setCourses(normalizedCourses);
        } else {
          const normalizedMockCourses = mockCourses.map(normalizeCourse);
          console.log("📦 Using mock courses:", normalizedMockCourses);
          setCourses(normalizedMockCourses);
        }
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setError("❌ Failed to load courses, showing sample data.");
        const normalizedMockCourses = mockCourses.map(normalizeCourse);
        console.log("📦 Using mock courses after error:", normalizedMockCourses);
        setCourses(normalizedMockCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  
  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      courses.forEach((course) => {
        if (course.image && course.image.startsWith("blob:")) {
          URL.revokeObjectURL(course.image);
        }
      });
    };
  }, [courses]);
  
  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course &&
        course.name &&
        course.name.toLowerCase().includes(courseSearch.toLowerCase())
    );
  }, [courses, courseSearch]);
  
  // Course click handler
  const handleCourseClick = useCallback(
    (courseId) => {
      navigate(`/course/${courseId}`);
    },
    [navigate]
  );
  
  // Course grid
  const courseGrid = useMemo(() => {
    if (filteredCourses.length === 0) {
      return <p>No courses found</p>;
    }
    return (
      <div className="lms-course-grid">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onClick={() => handleCourseClick(course._id)}
          />
        ))}
      </div>
    );
  }, [filteredCourses, handleCourseClick]);
  
  // Login modal
  const loginModal = useMemo(() => {
    if (!showLogin) return null;
    return (
      <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
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
    );
  }, [showLogin]);
  
  return (
    <div className="container">
      <header className="navbar">
        <div className="logo">Basecamp</div>
        <button className="create-btn" onClick={() => setShowLogin(true)}>
          Create Account
        </button>
      </header>
      <section className="hero">
        <h2>Empower Your Future with the</h2>
        <h1>
          Courses Designed to <span className="highlight">fit Your Choice</span>
        </h1>
        <p>
          Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
          libero et velit interdum, ac.
        </p>
        <p>Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className="logos">
          <img src="/Adobe.png" alt="Adobe" />
          <img
            src="/Postman__software_-removebg-preview.png"
            alt="Postman"
          />
          <img src="/Google.png" alt="Google" />
          <img src="/Canva_Logo.svg.png" alt="Canva" />
          <img src="/Microsoft logo.png" alt="Microsoft" />
        </div>
      </section>
      <div className="course-list-breadcrumbs">
        Home / <span className="breadcrumb-current">Course List</span>
      </div>
      <div className="course-list-title">Course List</div>
      <div className="lms-search">
        <input
          type="text"
          placeholder="Search for courses"
          value={courseSearch}
          onChange={(e) => setCourseSearch(e.target.value)}
        />
        <button>Search</button>
      </div>
      {loading ? (
        <p>Loading courses…</p>
      ) : error ? (
        <>
          <p style={{ color: "red" }}>{error}</p>
          {courseGrid}
        </>
      ) : (
        courseGrid
      )}
      {loginModal}
    </div>
  );
}

export default React.memo(Pathsetting);