// src/components/Payment.jsx
import { useParams, useNavigate } from "react-router-dom";
import courses from "../data/courses";
import "./Payment.css";

// Example: get current user - replace with your auth/user context
const getCurrentUser = () => {
  // 1) Replace with your real auth/context call, e.g. useAuth().user
  // 2) Fallback example using a name from your app (change as needed)
  return { id: 1, username: "lokith", displayName: "Lokith" };
};

function Payment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => String(c.id) === String(courseId));
  const user = getCurrentUser();

  if (!course) {
    return (
      <div>
        <h2>Course not found!</h2>
      </div>
    );
  }

  const purchasesKey = `purchases_${user.username || "guest"}`;

  const handlePayment = (method) => {
    // TODO: replace this with real payment flow -> on success do the next steps
    alert(`You selected ${method} to pay for ${course.title} ($${course.price.toFixed(2)})`);

    // --- Build purchasedCourse with purchaseDate ---
    const purchasedCourse = {
      ...course,
      purchaseDate: new Date().toISOString(),
    };

    // --- Save to localStorage (dedupe) so Dashboard can read it ---
    try {
      const raw = localStorage.getItem(purchasesKey);
      const prev = raw ? JSON.parse(raw) : [];
      // ensure array
      const prevArr = Array.isArray(prev) ? prev : [];

      const exists = prevArr.some((c) => String(c.id) === String(purchasedCourse.id));
      const updated = exists ? prevArr : [...prevArr, purchasedCourse];

      localStorage.setItem(purchasesKey, JSON.stringify(updated));
    } catch (e) {
      console.warn("localStorage save error:", e);
    }

    // (A) Navigate to dashboard using username param and pass state
    navigate(`/dashboard/${encodeURIComponent(user.username)}`, {
      state: { purchasedCourse, user },
      replace: true, // optional: replace so refresh won't re-post state
    });

    // --- OR alternative: navigate("/dashboard", { state: { user, purchasedCourse: course } });
    // (we used username route above to match your App.jsx)
  };

  return (
    <div className="payment-container">
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Go Back
      </button>

      <h1>Payment for: {course.title}</h1>
      <p>
        Price to pay: <strong>${course.price.toFixed(2)}</strong>
      </p>

      <h3>Select a Payment Method:</h3>
      <ul className="payment-methods">
        <li>
          <button className="payment-button credit-card" onClick={() => handlePayment("Credit Card")}>
            <img src="https://cdn-icons-png.flaticon.com/512/217/217425.png" alt="Credit Card" />
            Credit Card
          </button>
        </li>
        <li>
          <button className="payment-button paypal" onClick={() => handlePayment("PayPal")}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
            PayPal
          </button>
        </li>
        <li>
          <button className="payment-button google-pay" onClick={() => handlePayment("Google Pay")}>
            <img src="/Gpay.avif" alt="Google Pay" />
            Google Pay
          </button>
        </li>
        <li>
          <button className="payment-button upi" onClick={() => handlePayment("UPI")}>
            <img src="/upi.webp" alt="UPI" />
            UPI
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Payment;
