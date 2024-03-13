import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Header = ({ onLogout }) => {
  const [totalValue, setTotalValue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://mcsbt-integration-416413.lm.r.appspot.com/total-portfolio-value"
    )
      .then((response) => response.json())
      .then((data) => {
        setTotalValue(data.total_portfolio_value);
      })
      .catch((error) => {
        console.error("Error fetching total portfolio value:", error);
        setTotalValue("Error");
      });
  }, []);

  const handleLogout = () => {
    onLogout(false);
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

      <div style={{ display: "flex" }}>
        <Button color="default" auto onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
