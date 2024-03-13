import React, { useState } from "react";
import { Button } from "@nextui-org/react"; // Assuming Button accepts style prop or replace with standard button if necessary
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Registration attempt with:",
      username,
      email,
      password,
      confirmPassword
    );
    // Placeholder for successful registration
    onRegister(true);
    navigate("/summary"); // Redirect to the summary page
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
          gap: "0px", // This controls the distance between elements
          width: "300px", // Adjust the form width here
          textAlign: "center", // Ensures text elements inside the form are centered
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            margin: "0 0 15px 0",
            fontWeight: "600",
          }}
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
            borderRadius: "10px 10px 0 0", // Adjusted borderRadius for the top input
            border: "1px solid #ccc",
            padding: "10px",
            width: "100%",
          }}
        />
        {/* Assuming email input was missing from your desired adjustments, including it here with appropriate styles */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            fontSize: "14px",
            borderRadius: "0", // Straight corners for middle inputs
            border: "1px solid #ccc",
            borderTop: "0", // Remove top border to eliminate space
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          style={{
            fontSize: "14px",
            borderRadius: "0 0 0 0", // Adjusted borderRadius for the bottom input
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
            borderRadius: "0 0 10px 10px", // Rounded corners for the button if separate from inputs
            padding: "5px 10px",
            boxSizing: "border-box",
            width: "100%", // Adjusted to full width for consistency
            height: "35px", // Adjusted height
            fontSize: "14px",
            border: "1px solid #ccc", // Apply border styling consistently
            marginTop: "-1px", // Space between last input and button, adjust as needed
            disableAnimation: true, // Disable NextUI's button animation
          }}
        >
          Register
        </Button>
        <p style={{ marginTop: "15px", fontSize: "13px" }}>
          Already registered? Login{" "}
          <Link
            to="/login"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <strong>here</strong>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
