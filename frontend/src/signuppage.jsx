import React, { useState } from "react";
import { Button } from "@nextui-org/react"; // Import Button from @nextui-org/react
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
          gap: "20px", // Controls the distance between elements
          width: "300px", // Adjust the form width here
          textAlign: "center", // Ensures text elements inside the form are centered
        }}
      >
        <h2
          style={{
            fontSize: "24px", // Makes the header larger
            margin: "0 0 10px 0", // Adjusts spacing to match the form's gap
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
            borderRadius: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            width: "100%", // Adjust the width of input elements
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            fontSize: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            width: "100%", // Adjust the width of input elements
          }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          style={{
            fontSize: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            width: "100%", // Adjust the width of input elements
          }}
        />
        <Button
          fullWidth
          auto
          onClick={handleSubmit} // Use the Button from @nextui-org/react for the submit action
          css={{
            borderRadius: "10px",
          }}
        >
          Register
        </Button>
        <p style={{ marginTop: "10px", fontSize: "13px" }}>
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
