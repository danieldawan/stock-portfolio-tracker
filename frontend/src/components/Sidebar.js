import React, { useState } from "react";

function Sidebar() {
  const [stocks, setStocks] = useState(["AAPL", "GOOG", "MSFT", "AMZN"]);

  return (
    <div className="sidebar">
      <h2>Stocks</h2>
      {stocks.map((stock, index) => (
        <div key={index} className="stock">
          {stock}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
