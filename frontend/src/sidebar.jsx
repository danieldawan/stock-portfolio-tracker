import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@nextui-org/react";
import portfolioData from "/Users/danieldawan/VSCode/stock-portfolio-tracker/backend/portfolio.json";

export default function Sidebar() {
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    setPortfolioItems(portfolioData.portfolios[0].items);
  }, []);

  useEffect(() => {
    const fetchPercentageChanges = async () => {
      const promises = portfolioItems.map((item) =>
        fetch(`http://127.0.0.1:5000/${item.ticker}`).then((response) =>
          response.json()
        )
      );

      const results = await Promise.all(promises);
      const updatedItems = portfolioItems.map((item, index) => {
        const { percent_change } = results[index];
        return { ...item, percent_change: percent_change || "N/A" };
        g;
      });

      setPortfolioItems(updatedItems);
    };

    if (portfolioItems.length > 0) {
      fetchPercentageChanges().catch(console.error);
    }
  }, [portfolioItems.length]);

  return (
    <div style={{ marginLeft: "20px" }}>
      {/* Overview Card */}
      <Card
        className="my-4"
        style={{ width: "200px", backgroundColor: "rgb(55, 55, 61)" }}
        isPressable={true}
        disableRipple={true}
        onPress={() => {
          window.location.href = `/summary`;
        }}
      >
        <CardHeader className="flex-col items-center justify-between">
          <h4 className="font-bold">Summary →</h4>
        </CardHeader>
      </Card>

      {/* Stock Ticker Cards */}
      {portfolioItems.map((item, index) => (
        <Card
          key={index}
          className="my-4"
          style={{ width: "200px" }}
          isPressable={true}
          disableRipple={true}
          onPress={() => {
            window.location.href = `/${item.ticker}`;
          }}
        >
          <CardHeader className="flex-col items-start justify-between">
            <h4 className="font-bold">{item.ticker}</h4>
            <small>
              {item.percent_change
                ? `${parseFloat(item.percent_change).toFixed(
                    2
                  )}% from previous week`
                : "Loading..."}
            </small>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
