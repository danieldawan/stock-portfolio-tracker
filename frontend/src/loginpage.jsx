import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add state to manage error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginDetails = { username, password };

    try {
      const response = await fetch(
        "https://mcsbt-integration-416413.lm.r.appspot.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDetails),
        }
      );

      if (!response.ok) {
        // If response is not OK, throw an error with the response status
        const errorData = await response.json(); // Assuming the server responds with JSON
        throw new Error(errorData.error || "Failed to login");
      }

      const data = await response.json();
      console.log("Login successful:", data.message);
      // Placeholder for successful login
      onLogin(true);
      navigate("/summary"); // Redirect to the summary page
    } catch (error) {
      console.error("Login error:", error.message);
      setError(error.message); // Update error state to display the message
      alert(error.message); // Using simple alert for error feedback
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "24px", margin: "0 0 15px 0", fontWeight: "600" }}
        >
          Stock Portfolio Tracker
        </h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{
            fontSize: "14px",
            borderRadius: "10px 10px 0 0", // Adjusted borderRadius
            border: "1px solid #ccc",
            padding: "10px",
            width: "100%",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            fontSize: "14px",
            borderRadius: "0", // Straight corners
            border: "1px solid #ccc",
            borderTop: "0", // Remove top border
            padding: "10px",
            width: "100%",
          }}
        />
        <Button
          fullWidth
          auto
          type="submit"
          style={{
            borderRadius: "0 0 10px 10px", // Straight top corners, rounded bottom corners
            padding: "5px 10px",
            boxSizing: "border-box",
            width: "100%", // Adjusted to full width for consistency
            height: "35px", // Adjusted height
            fontSize: "14px",
            borderTop: "0", // Remove top border to eliminate space
            border: "1px solid #ccc", // Apply border styling consistently
            marginTop: "-1px", // Ensure no gap between this and the previous element
            disableAnimation: true, // Disable NextUI's button animation
          }}
        >
          Login
        </Button>
        <p style={{ marginTop: "15px", fontSize: "13px" }}>
          Not registered? Register{" "}
          <Link
            to="/register"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <strong>here</strong>
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
