import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader } from "@nextui-org/react";

const Header = () => {
  // State to store the total portfolio value
  const [totalValue, setTotalValue] = useState("");

  // Fetch the total portfolio value from the backend on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000//total-portfolio-value")
      .then((response) => response.json())
      .then((data) => {
        setTotalValue(data.total_portfolio_value.toFixed(2));
      })
      .catch((error) => {
        console.error("Error fetching total portfolio value:", error);
        setTotalValue("Error");
      });
  }, []); // Empty dependency array means this effect runs once on mount

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
      {/* Left Container for the Total Value Card */}
      <div style={{ display: "flex" }}>
        <Card
          className="my-4"
          style={{
            width: "110px",
            backgroundColor: "black",
            color: "white",
          }}
          bordered
        >
          <CardHeader className="flex-col items-start justify-between">
            <h4 style={{ margin: 0, fontWeight: "bold" }}>Total Value</h4>
            {/* Dynamically display the total value */}
            <small>${totalValue}</small>
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
          fontSize: "30px", // Add font size parameter
        }}
      >
        Stock Portfolio Tracker
      </h1>

      {/* Right Container for the Logout Button */}
      <div style={{ display: "flex" }}>
        <Button color="default" auto>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
