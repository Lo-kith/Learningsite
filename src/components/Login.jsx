import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Login.css";

export default function Login({ onGoBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("❌ Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      await emailjs.send(
        "service_pj6epu2",      
        "template_mk8fxhd",     
        {
          to_email: email,      
          message: `Hello ${email}, you have successfully logged in! 🎉`,
        },
        "HiUkx_TARNLGazlyw"      
      );

      alert(`✅ Login successful! Email sent to ${email}`);
    } catch (err) {
      console.error("Email sending error:", err);
      alert("❌ Failed to send email");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleGoBack = () => {
    setEmail("");
    setPassword("");
    onGoBack();
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back!</h2>
      <p className="login-subtitle">Please login to continue</p>

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="back-text">
        Don’t have an account?{" "}
        <span className="link" onClick={handleGoBack}>
          Go Back
        </span>
      </p>
    </div>
  );
}
