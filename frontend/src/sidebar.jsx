import React, { useState, useEffect } from "react";
import { Card, CardHeader, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showSearchBox, setShowSearchBox] = useState(false); // State to control the visibility of the search box

  useEffect(() => {
    fetch(`https://mcsbt-integration-416413.lm.r.appspot.com`)
      .then((response) => response.json())
      .then((data) => {
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
      const updatedItems = portfolioItems.map((item, index) => ({
        ...item,
        percent_change: results[index].percent_change || "N/A",
      }));

      setPortfolioItems(updatedItems);
    };

    if (portfolioItems.length > 0) {
      fetchPercentageChanges().catch(console.error);
    }
  }, [portfolioItems.length]);

  return (
    <div style={{ marginLeft: "30px" }}>
      <Card
        className="my-4"
        style={{ width: "200px", backgroundColor: "rgb(55, 55, 61)" }}
        isPressable={true}
        disableRipple={true}
        onPress={() => navigate("/summary")}
      >
        <CardHeader className="flex-col items-center justify-between">
          <h4 className="font-bold">Summary →</h4>
        </CardHeader>
      </Card>

      {portfolioItems.map((item, index) => (
        <div
          style={{ position: "relative", width: "230px", marginBottom: "1rem" }}
          key={index}
        >
          <div
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{
              position: "absolute",
              top: "50%",
              right: "0",
              width: "30px",
              height: "100%",
              cursor: "pointer",
              zIndex: 10,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%) translateX(-10%)",
                right: "0",
                padding: "0px",
                fontSize: "20px",
                fontWeight: "normal",
                opacity: hoverIndex === index ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
              onClick={() => {
                const isConfirmed = window.confirm(
                  `Would you like to remove the ticker ${item.ticker}?`
                );
                if (isConfirmed) {
                  // Logic to remove the ticker
                  console.log(`Ticker ${item.ticker} removed.`);
                }
              }}
            >
              ✕
            </div>
          </div>

          <Card
            isPressable={true}
            disableRipple={true}
            onPress={() => navigate(`/${item.ticker}`)}
            style={{ width: "200px" }}
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
        </div>
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "200px",
        }}
      >
        <Button fullWidth onClick={() => setShowSearchBox(!showSearchBox)}>
          Add stock
        </Button>
        <div
          style={{
            opacity: showSearchBox ? 1 : 0,
            visibility: showSearchBox ? "visible" : "hidden",
            transition: "opacity 0.3s ease-in-out, visibility 0.3s",
            width: "200px",
            marginTop: "15px",
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <input
            type="text"
            placeholder="Enter a stock"
            style={{
              fontSize: "14px",
              borderRadius: "10px 0 0 10px",
              border: "1px solid #ccc",
              padding: "5px 10px",
              marginRight: "-1px",
              boxSizing: "border-box",
              width: "150px",
            }}
          />
          <Button
            style={{
              borderRadius: "0 10px 10px 0",
              padding: "0 12px",
              boxSizing: "border-box",
              minWidth: "50px",
              height: "35px",
            }}
            aria-label="Confirm ticker"
          >
            ✓
          </Button>
        </div>
      </div>
    </div>
  );
}
