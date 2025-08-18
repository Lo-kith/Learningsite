import React from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const currentUser = { username: "lokith", displayName: "Loki" };

  const buyJavaCourse = () => {
    const purchasedCourse = {
      id: "java-101",
      title: "Java from Zero to Hero",
      price: 19.99,
      purchaseDate: new Date().toISOString(),
      modules: [
        { title: "Intro to Java", duration: "10m" },
        { title: "Setup & Hello World", duration: "8m" },
        { title: "Variables & Types", duration: "12m" },
        { title: "OOP Basics", duration: "30m" },
      ],
      description: "Learn Java from scratch to advanced OOP concepts.",
    };

    // navigate to dashboard and pass purchase + user
    navigate("/dashboard", { state: { purchasedCourse, user: currentUser } });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Checkout (Demo)</h2>
      <p>Buy the Java course and you will be redirected to the dashboard.</p>
      <button onClick={buyJavaCourse}>Buy Java Course ($19.99)</button>
    </div>
  );
}

export default Checkout;
