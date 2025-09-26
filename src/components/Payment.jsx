import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course;

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!course) {
    return (
      <div className="payment-container">
        <h2>Course not found</h2>
        <button onClick={() => navigate('/')}>Back to Courses</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!cardNumber || !expiry || !cvv || !name) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);

      // ✅ Save purchased course to user in localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
        const userData = allUsers[currentUser.email] || { ...currentUser, purchasedCourses: [] };

        // avoid duplicates
        const exists = userData.purchasedCourses?.some(c => c.id === course.id);
        if (!exists) {
          userData.purchasedCourses = [
            ...(userData.purchasedCourses || []),
            {
              ...course,
              purchaseDate: new Date().toISOString().split("T")[0],
              modules: [
                { title: "Introduction", duration: "15m", topic: "Course overview", completed: false },
                { title: "Module 1", duration: "1h", topic: "Getting started", completed: false }
              ]
            }
          ];
        }

        // save back
        allUsers[currentUser.email] = userData;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }

      // ✅ Redirect to user dashboard
      navigate('/dashboard/user');
    }, 2000);
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Purchase</h2>
      <div className="course-summary">
        <h3>{course.title}</h3>
        <p>Instructor: {course.instructor}</p>
        <p>Price: ${course.price.toFixed(2)}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength="5"
            />
          </div>
          
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength="3"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? 'Processing...' : `Pay $${course.price.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

export default Payment;
