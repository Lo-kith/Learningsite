// src/components/CourseDetail.js
import { useParams, useNavigate } from "react-router-dom";
import courses from "../data/courses"; // Use shared file!

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Find the course by id
  const course = courses.find(c => c.id === Number(courseId));

  if (!course) {
    return <div className="course-detail-container"><h2>Course not found!</h2></div>;
  }

  return (
    <div className="course-detail-container">
      <button onClick={() => navigate(-1)} style={{marginBottom: "1rem"}}>← Go Back</button>
      
      <h1>{course.title}</h1>
      <img src={course.image} alt={course.title} style={{ maxWidth: 400, marginBottom: "1rem" }} />
      <div style={{marginBottom: "1rem"}}>
        <p><b>Instructor:</b> {course.instructor}</p>
        <p><b>Rating:</b> {course.rating} / 5 ({course.reviews} review{course.reviews > 1 ? "s" : ""})</p>
        <p><b>Price:</b> <span style={{color: "#008060"}}>${course.price.toFixed(2)}</span></p>
      </div>
      <div>
        <b>Description:</b>
        <p>{course.description}</p>
      </div>
      <button
        
  className="purchase-btn"
  onClick={() => navigate(`/payment/${course.id}`)}
  style={{
    marginTop: "2rem",
    padding: "0.7rem 2rem",
    fontSize: "1.1rem",
    color: "#fff",
    background: "linear-gradient(90deg,#0072ff,#00c6ff)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Purchase Course
</button>
    </div>
  );
}

export default CourseDetail;
