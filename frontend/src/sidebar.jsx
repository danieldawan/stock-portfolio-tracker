import React from "react";
import { Card, CardHeader } from "@nextui-org/react";
import portfolioData from "/Users/danieldawan/VSCode/stock-portfolio-tracker/backend/portfolio.json";

export default function Sidebar() {
  // Assuming we're only interested in the first portfolio for simplicity
  const portfolioItems = portfolioData.portfolios[0].items;

  return (
    <div>
      {portfolioItems.map((item, index) => (
        <Card
          key={index}
          className="my-4"
          style={{ width: "200px" }}
          isPressable="True"
          onPress={() => {
            window.location.href = `/${item.ticker}`;
          }}
        >
          <CardHeader className="flex-col items-start justify-between">
            <h4 className="font-bold">{item.ticker}</h4>
            {/* Static price change; replace with dynamic data as needed */}
            <small>+24% from yesterday</small>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
