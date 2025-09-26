import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import mockCourses from "../data/courses";
import "./CourseDetail.css";
const API_BASE = "http://localhost:5000";

// Helper function to check if ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Normalize course data from different sources
  const normalizeCourse = (course) => {
    if (!course) return null;
    
    // Handle image URL properly
    let imageSrc = "/default-course.jpg";
    if (course.image) {
      if (typeof course.image === "string") {
        // Full URL
        if (
          course.image.startsWith("http://") ||
          course.image.startsWith("https://")
        ) {
          imageSrc = course.image;
        }
        // Relative path - prepend API_BASE
        else if (course.image.startsWith("/")) {
          imageSrc = `${API_BASE}${course.image}`;
        }
        // Blob URL
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
        } catch (err) {
          console.error("Error converting buffer to base64:", err);
        }
      }
      // If Blob object
      else if (course.image instanceof Blob) {
        imageSrc = URL.createObjectURL(course.image);
      }
    }
    
    return {
      id: course._id || course.id,
      title: course.name || course.title,
      instructor: course.instructor || "Unknown",
      rating: course.rating || 0,
      reviews: course.reviews || 0,
      price: course.price || 0,
      image: imageSrc,
      description: course.description || "No description available"
    };
  };
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        
        // Only try API if ID is a valid ObjectId
        if (isValidObjectId(courseId)) {
          const res = await axios.get(`${API_BASE}/api/items/${courseId}`);
          console.log("API course data:", res.data);
          const normalizedCourse = normalizeCourse(res.data);
          console.log("Normalized course with image URL:", normalizedCourse);
          setCourse(normalizedCourse);
          setError("");
        } else {
          // For non-ObjectId IDs, use mock data directly
          const mockCourse = mockCourses.find(c => 
            c.id === courseId || c._id === courseId
          );
          
          if (mockCourse) {
            console.log("Mock course data:", mockCourse);
            const normalizedCourse = normalizeCourse(mockCourse);
            console.log("Normalized course with image URL:", normalizedCourse);
            setCourse(normalizedCourse);
            setError("Using sample data (ID format not suitable for database)");
          } else {
            setError("Course not found");
          }
        }
      } catch (err) {
        console.error("API fetch failed, using mock data:", err);
        
        // Fallback to mock data
        const mockCourse = mockCourses.find(c => 
          c.id === courseId || c._id === courseId
        );
        
        if (mockCourse) {
          console.log("Fallback mock course data:", mockCourse);
          const normalizedCourse = normalizeCourse(mockCourse);
          console.log("Normalized course with image URL:", normalizedCourse);
          setCourse(normalizedCourse);
          setError("Using sample data (API unavailable)");
        } else {
          setError("Course not found");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);
  
  const handlePurchase = () => {
    navigate(`/payment/${courseId}`, { state: { course } });
  };
  
  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading-spinner">Loading course details...</div>
      </div>
    );
  }
  
  if (error && !course) {
    return (
      <div className="course-detail-container">
        <div className="error-message">
          <h2>Course not found!</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="back-button">
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="course-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Go Back
      </button>
      
      <div className="course-detail-header">
        <div className="course-image-container">
          <img 
            src={course.image} 
            alt={course.title} 
            className="course-detail-image"
            onError={(e) => {
              console.error("Image failed to load:", e.target.src);
              e.target.src = "/default-course.jpg";
            }}
          />
        </div>
        
        <div className="course-info">
          <h1>{course.title}</h1>
          
          <div className="instructor-info">
            <span className="instructor-label">Instructor:</span>
            <span className="instructor-name">{course.instructor}</span>
          </div>
          
          <div className="rating-info">
            <div className="stars">
              {"★".repeat(Math.floor(course.rating))}
              {"☆".repeat(5 - Math.floor(course.rating))}
            </div>
            <span className="rating-value">{course.rating}</span>
            <span className="review-count">
              ({course.reviews} review{course.reviews !== 1 ? "s" : ""})
            </span>
          </div>
          
          <div className="price-tag">${course.price.toFixed(2)}</div>
          
          <button 
            className="purchase-btn"
            onClick={handlePurchase}
          >
            Purchase Course
          </button>
        </div>
      </div>
      
      <div className="course-content">
        <div className="description-section">
          <h2>Course Description</h2>
          <p>{course.description}</p>
        </div>
      </div>
      
      {error && (
        <div className="api-warning">
          {error}
        </div>
      )}
    </div>
  );
}

export default CourseDetail;