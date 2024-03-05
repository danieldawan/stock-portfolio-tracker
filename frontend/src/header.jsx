import React from "react";
import { Button, Card, CardHeader } from "@nextui-org/react";

const Header = () => {
  return (
    <header
      style={{
        width: "100%",
        height: "120px",
        backgroundColor: "black",
        position: "fixed",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "space-between", // Keeps left and right elements at the edges
        alignItems: "center",
        padding: "0 20px", // Adjust padding as needed
      }}
    >
      {/* Left Container for the Total Value Card */}
      <div style={{ display: "flex" }}>
        <Card
          className="my-4"
          style={{
            width: "110px",
            backgroundColor: "black", // Set the background color to black
            color: "white", // Ensure text color is white for visibility
          }}
          bordered // Adds a border to the card for better visibility
        >
          <CardHeader className="flex-col items-start justify-between">
            <h4 style={{ margin: 0, fontWeight: "bold" }}>Total Value</h4>
            <small>$1,234.56</small> {/* Static value */}
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
