import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@nextui-org/react";

export default function Sidebar() {
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    // Fetch the portfolio data from the backend
    fetch(`https://mcsbt-integration-416413.lm.r.appspot.com`)
      .then((response) => response.json())
      .then((data) => {
        // Transform the fetched data into the expected format
        const items = Object.entries(data).map(([ticker, quantity]) => ({
          ticker,
          quantity,
        }));
        setPortfolioItems(items);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchPercentageChanges = async () => {
      const promises = portfolioItems.map((item) =>
        fetch(
          `https://mcsbt-integration-416413.lm.r.appspot.com/${item.ticker}`
        ).then((response) => response.json())
      );

      const results = await Promise.all(promises);
      const updatedItems = portfolioItems.map((item, index) => {
        const percent_change = results[index].percent_change || "N/A";
        return { ...item, percent_change };
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
