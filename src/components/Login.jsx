import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    // Create or update user object
    let allUsers = JSON.parse(localStorage.getItem("allUsers") || "{}");
    const existing = allUsers[email];

    const newUser = {
      username,
      email,
      password,
      purchasedCourses: existing?.purchasedCourses || [], // keep old purchases
    };

    allUsers[email] = newUser;

    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // go to dashboard with email as param
    navigate(`/dashboard/${encodeURIComponent(email)}`);
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
