import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"; // Import useParams
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const Content = ({ marginTop = "20px" }) => {
  const location = useLocation();
  const [stockInfo, setStockInfo] = useState([]);
  const { ticker } = useParams(); // Use useParams to get the ticker

  // Determine if the current page is the summary page based on the ticker
  const isSummaryPage =
    location.pathname.includes("summary") || typeof ticker === "undefined";

  console.log({
    location,
    stockInfo,
    isSummaryPage,
    ticker, // Now directly obtained from useParams
  });

  useEffect(() => {
    // Check if the ticker is defined before attempting to fetch stock info
    if (ticker) {
      fetch(`https://mcsbt-integration-416413.lm.r.appspot.com/${ticker}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.stock_info) {
            let formattedData = Object.entries(data.stock_info).map(
              ([date, info]) => ({
                date,
                open: info["1. open"],
                high: info["2. high"],
                low: info["3. low"],
                close: info["4. close"],
                volume: info["5. volume"],
              })
            );
            formattedData.sort((a, b) => b.date.localeCompare(a.date));
            setStockInfo(formattedData);
          } else {
            console.error("Missing or invalid stock_info data");
            setStockInfo([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching stock information:", error);
          setStockInfo([]);
        });
    }
  }, [ticker]); // Depend on ticker for re-fetching data

  const displayTicker = ticker ? ticker.toUpperCase() : "N/A";

  if (isSummaryPage) {
    return (
      <div
        style={{ marginTop, width: "100%", maxWidth: "800px", color: "white" }}
      >
        <h1>Summary page is under development 🫥</h1>
      </div>
    );
  }

  return (
    <div style={{ marginTop, width: "100%", maxWidth: "800px" }}>
      <h2
        style={{
          color: "white",
          margin: "0 0 20px",
          fontWeight: "500",
          fontSize: "20px",
        }}
      >
        {displayTicker} Weekly Time Series ($)
      </h2>
      <Table aria-label="Stock Information Table">
        <TableHeader>
          <TableColumn width="17%">Date</TableColumn>
          <TableColumn width="17%">Open</TableColumn>
          <TableColumn width="17%">High</TableColumn>
          <TableColumn width="17%">Low</TableColumn>
          <TableColumn width="17%">Close</TableColumn>
          <TableColumn width="17%">Volume</TableColumn>
        </TableHeader>
        <TableBody>
          {stockInfo.map((info, index) => (
            <TableRow key={index}>
              <TableCell>{info.date}</TableCell>
              <TableCell>{info.open}</TableCell>
              <TableCell>{info.high}</TableCell>
              <TableCell>{info.low}</TableCell>
              <TableCell>{info.close}</TableCell>
              <TableCell>{info.volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Content;
