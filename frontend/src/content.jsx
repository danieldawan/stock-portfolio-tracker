import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation instead of useParams
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const Content = ({ marginTop = "20px" }) => {
  const location = useLocation(); // Use useLocation to access the location object
  const [stockInfo, setStockInfo] = useState([]);
  const isSummaryPage = location.pathname === "/summary"; // Check if the current page is /summary

  useEffect(() => {
    if (!isSummaryPage) {
      const ticker = location.pathname.substring(1); // Extract ticker from the pathname
      fetch(`http://127.0.0.1:5000/${ticker}`)
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
  }, [location.pathname]); // Depend on location.pathname for fetching stock data

  // Render a simple message if the route is /summary
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
        {location.pathname.substring(1).toUpperCase()} Weekly Time Series ($)
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
