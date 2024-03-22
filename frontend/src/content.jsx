import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { AgChartsReact } from "ag-charts-react";
import { useUser } from "./UserContext";

const Content = ({ marginTop = "20px" }) => {
  const location = useLocation();
  const [stockInfo, setStockInfo] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [totalPortfolioValueChartOptions, setTotalPortfolioValueChartOptions] =
    useState({});
  const [
    individualStockPerformanceChartOptions,
    setIndividualStockPerformanceChartOptions,
  ] = useState({});
  const [individualStockOptions, setIndividualStockOptions] = useState({});
  const [is404Error, setIs404Error] = useState(false);
  const { ticker } = useParams();
  const { user, reloadTrigger } = useUser();

  const isSummaryPage =
    location.pathname.includes("summary") || typeof ticker === "undefined";

  useEffect(() => {
    if (!user || !user.username) {
      console.error("User information is not available.");
      return;
    }
    if (ticker) {
      fetchStockData(ticker);
    }
    if (isSummaryPage) {
      fetchPortfolioData(user.username);
    }
  }, [user, ticker, reloadTrigger]);

  const fetchStockData = (ticker) => {
    fetch(`https://mcsbt-integration-416413.lm.r.appspot.com/${ticker}`)
      .then((response) => {
        if (!response.ok && response.status === 404) {
          throw new Error("404");
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
          setIs404Error(false);
        } else {
          console.error("Missing or invalid stock_info data");
          setStockInfo([]);
        }
      })
      .catch((error) => {
        if (error.message === "404") {
          setIs404Error(true);
        } else {
          console.error("Error fetching stock information:", error);
        }
      });
  };

  const fetchPortfolioData = (username) => {
    // Simultaneous fetches for portfolio composition and value change data
    Promise.all([
      fetch(
        `https://mcsbt-integration-416413.lm.r.appspot.com/portfolio/${username}`
      ).then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("404");
          }
          throw new Error("Non-404 error");
        }
        return res.json();
      }),
      fetch(
        `https://mcsbt-integration-416413.lm.r.appspot.com/portfolio-value-and-stock-prices/${username}`
      ).then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("404");
          }
          throw new Error("Non-404 error");
        }
        return res.json();
      }),
    ])
      .then(([portfolioComposition, valueAndPrices]) => {
        // Processing data as before
        setIs404Error(false); // Reset or ensure 404 error state is false on successful data fetch

        const latestPrices = Object.fromEntries(
          Object.entries(valueAndPrices.individual_stock_closing_prices).map(
            ([ticker, prices]) => [ticker, prices[0].closing_price]
          )
        );

        const donutChartData = portfolioComposition.map((stock) => ({
          label: stock.ticker,
          value: stock.quantity * (latestPrices[stock.ticker] || 0),
        }));

        // Donut Chart Configuration
        setChartOptions({
          data: donutChartData,
          background: {
            visible: false,
          },
          legend: { enabled: false },
          series: [
            {
              type: "donut",
              angleKey: "value",
              calloutLabelKey: "label", // This is to ensure the property is supported
              innerRadiusRatio: 0.7, // Adjust the inner radius to make it a donut chart
              calloutLabel: { color: "white" },
              tooltip: {
                renderer: (params) => ({
                  content: `${
                    params.datum.label
                  }: $${params.datum.value.toFixed(2)}`,
                }),
              },
            },
          ],
        });

        // Total Portfolio Value Over Time Chart Configuration
        setTotalPortfolioValueChartOptions({
          data: valueAndPrices.total_portfolio_value_over_time,
          background: {
            visible: false, // Correctly set the background to be invisible
          },
          series: [
            {
              type: "line",
              xKey: "date",
              yKey: "total_portfolio_value",
              label: { color: "white" },
              tooltip: {
                renderer: (params) => ({
                  content: `Value: $${params.datum.total_portfolio_value.toFixed(
                    2
                  )}`,
                }),
              },
            },
          ],
          axes: [
            {
              type: "category",
              position: "bottom",
              title: { text: "Date", color: "white" },
              label: { color: "white" },
            },
            {
              type: "number",
              position: "left",
              title: { text: "Total Value ($)", color: "white" },
              label: {
                formatter: (params) => `$${params.value}`,
                color: "white",
              },
            },
          ],
        });

        let individualStocksData =
          valueAndPrices.individual_stock_closing_prices;
        let seriesData = Object.keys(individualStocksData).map((ticker) => ({
          type: "line",
          xKey: "date",
          yKey: "closing_price",
          yName: ticker,
          data: individualStocksData[ticker].map((entry) => ({
            date: entry.date,
            closing_price: entry.closing_price,
          })),
        }));

        // Individual Stock Value Over Time Chart Configuration
        setIndividualStockPerformanceChartOptions({
          background: {
            visible: false,
          },
          legend: { enabled: false },
          series: seriesData.map((series) => ({
            ...series,
            tooltip: {
              renderer: (params) => ({
                content: `Value: $${params.datum.closing_price.toFixed(2)}`,
              }),
            },
          })),
          axes: [
            {
              type: "category",
              position: "bottom",
              title: { text: "Date", color: "white" },
              label: { color: "white" },
            },

            {
              type: "number",
              position: "left",
              title: { text: "Closing Price ($)", color: "white" },
              label: {
                formatter: (params) => `$${params.value.toFixed(2)}`,
                color: "white",
              },
            },
          ],
        });
      })
      .catch((error) => {
        if (error.message === "404") {
          setIs404Error(true);
        } else {
          console.error("Error fetching portfolio data:", error);
        }
      });
  };

  useEffect(() => {
    if (stockInfo.length > 0) {
      const closingPricesData = stockInfo
        .map(({ date, close }) => ({
          date,
          close: Number(close),
        }))
        .reverse();

      setIndividualStockOptions({
        data: closingPricesData,
        background: {
          visible: false,
        },
        series: [
          {
            type: "line",
            xKey: "date",
            yKey: "close",
            label: { color: "white" },
            tooltip: {
              renderer: (params) => ({
                content: `Date: ${
                  params.datum.date
                }, Close: $${params.datum.close.toFixed(2)}`,
              }),
            },
          },
        ],
        axes: [
          {
            type: "category",
            position: "bottom",
            title: { text: "Date", color: "white" },
            label: { color: "white" },
          },
          {
            type: "number",
            position: "left",
            title: { text: "Price ($)", color: "white" },
            label: {
              formatter: (params) => `$${params.value.toFixed(2)}`,
              color: "white",
            },
          },
        ],
      });
    }
  }, [stockInfo]);

  const displayTicker = ticker ? ticker.toUpperCase() : "N/A";

  if (is404Error) {
    return (
      <div
        style={{
          marginTop,
          width: "100%",
          maxWidth: "800px",
          textAlign: "left",
          color: "white",
          fontSize: "20px",
          fontWeight: "300",
        }}
      >
        <h1>Portfolio Summary not available</h1>
      </div>
    );
  }

  if (isSummaryPage) {
    return (
      <div
        style={{
          marginTop,
          width: "100%",
          maxWidth: "800px",
          color: "white",
          fontSize: "24px",
          fontWeight: "500",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h1>Portfolio Composition</h1>
          <AgChartsReact options={chartOptions} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h1>Total Portfolio Value Over Time</h1>
          <AgChartsReact options={totalPortfolioValueChartOptions} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h1>Individual Stock Performance Over Time</h1>
          <AgChartsReact options={individualStockPerformanceChartOptions} />
        </div>
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
          fontSize: "24px",
        }}
      >
        {displayTicker} Weekly Time Series ($)
      </h2>
      <AgChartsReact options={individualStockOptions} />
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
