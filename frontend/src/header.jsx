import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext"; // Import the useUser hook

const Header = () => {
  const [totalValue, setTotalValue] = useState(null);
  const { user, setUserData } = useUser(); // Use the user context
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User object:", user);
    if (!user) {
      console.error("User ID is not available.");
      return;
    }

    console.log("User ID is", user.id); // Move inside useEffect to access user object

    fetch(
      `https://mcsbt-integration-416413.lm.r.appspot.com/total-portfolio-value/${user.username}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio value");
        }
        return response.json();
      })
      .then((data) => {
        setTotalValue(data.total_portfolio_value);
      })
      .catch((error) => {
        console.error("Error fetching total portfolio value:", error);
        setTotalValue("0");
      });
  }, [user]);

  const handleLogout = async () => {
    // Optionally make a logout API call to your backend
    try {
      const response = await fetch(
        "https://mcsbt-integration-416413.lm.r.appspot.com/logout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle any errors from your API
        throw new Error("Logout failed");
      }

      // Successfully logged out from backend
      console.log("Logged out successfully");
    } catch (error) {
      console.error(error.message);
    }

    // Clear the user context
    setUserData(null);
    navigate("/login");
  };

  return (
    <header
      style={{
        width: "100%",
        height: "100px",
        backgroundColor: "black",
        position: "fixed",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex" }}>
        <Card
          style={{ width: "110px", backgroundColor: "black", color: "white" }}
          bordered
        >
          <CardHeader className="flex-col items-start justify-between">
            <h4 style={{ margin: 0, fontWeight: "bold" }}>Total Value</h4>
            <small>
              {totalValue === null ? "Loading..." : `$${totalValue}`}
            </small>
          </CardHeader>
        </Card>
      </div>

      <h1
        style={{
          margin: 0,
          fontWeight: "600",
          color: "white",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "30px",
        }}
      >
        Stock Portfolio Tracker
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {user && (
          <span style={{ color: "white", fontSize: "13px" }}>
            Logged in as <b>{user.username}</b>{" "}
            {/* Display the dynamically logged-in username */}
          </span>
        )}
        <Button color="default" auto onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
