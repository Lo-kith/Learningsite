import React, { useState } from "react";
import "../App.css";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    { id: 1, name: "Web Development", image: "/Web dev.jpg" },
    { id: 2, name: "UI Designs", image: "/UI.jpg" },
    { id: 3, name: "React Developer", image: "/React.png" },
  ];

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="navbar">
        <div className="logo">Basecamp</div>
        <button className="create-btn">Create Account</button>
      </header>

      <section className="hero">
        <h2>Empower Your Future with the</h2>
        <h1>
          Courses Designed to <span className="highlight">fit Your Choice</span>
        </h1>
        <p>
          Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac.
        </p>
        <p>Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>Search</button>
        </div>

        <div className="logos">
          <img src="/Adobe.png" alt="Adobe" />
          <img src="/Postman.png" alt="Postman" />
          <img src="/Google.png" alt="Google" />
          <img src="/Canva.png" alt="Canva" />
          <img src="/Microsoft logo.png" alt="Microsoft" />
        </div>
      </section>

      <section className="courses">
        <h2>Learn from the best</h2>
        <p>Jorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <div className="course-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div className="course-card" key={course.id}>
                <img src={course.image} alt={course.name} />
                <h3>{course.name}</h3>
              </div>
            ))
          ) : (
            <p>No courses found</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
