import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

  // Parse the hash part of the URL to get the route
  const pathSegments = location.hash.substring(1).split("/"); // Remove the '#' and split
  const isSummaryPage = pathSegments[1] === "summary"; // Check if the path is for the summary page
  const ticker = pathSegments[1]; // The ticker would be the second segment in a hash-based route

  useEffect(() => {
    if (!isSummaryPage) {
      fetch(`https://mcsbt-integration-416413.lm.r.appspot.com/${ticker}`)
        .then((response) => response.json())
        .then((data) => {
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

          // Sort the data in reverse chronological order by date
          formattedData.sort((a, b) => {
            return b.date.localeCompare(a.date);
          });

          setStockInfo(formattedData);
        })
        .catch((error) =>
          console.error("Error fetching stock information:", error)
        );
    }
  }, [location.hash]); // Depend on location.hash for re-fetching when the hash changes

  if (isSummaryPage) {
    return (
      <div
        style={{ marginTop, width: "100%", maxWidth: "800px", color: "white" }}
      >
        <h1>Summary page is under development 🫥</h1>
      </div>
    );
  }

  // Render stock information table for specific ticker routes
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
        {ticker.toUpperCase()} Weekly Time Series ($)
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
