import React, { useState, useEffect } from "react";
import AddStockForm from "../components/AddStockForm";
import { motion } from "framer-motion";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const savedPortfolio = localStorage.getItem("portfolio");
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const addStock = (stock) => {
    setPortfolio([...portfolio, { ...stock, id: Date.now() }]);
  };

  const getCurrentPrice = (symbol) => {
    return Math.random() * 100 + 50;
  };

  const sortedPortfolio = React.useMemo(() => {
    let sortableItems = [...portfolio];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [portfolio, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Portfolio</h1>
      <AddStockForm onAddStock={addStock} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card rounded-lg shadow-lg">
          <thead>
            <tr>
              <th
                onClick={() => requestSort("symbol")}
                className="p-4 cursor-pointer"
              >
                Symbol
              </th>
              <th
                onClick={() => requestSort("purchasePrice")}
                className="p-4 cursor-pointer"
              >
                Purchase Price
              </th>
              <th
                onClick={() => requestSort("quantity")}
                className="p-4 cursor-pointer"
              >
                Quantity
              </th>
              <th
                onClick={() => requestSort("purchaseDate")}
                className="p-4 cursor-pointer"
              >
                Purchase Date
              </th>
              <th
                onClick={() => requestSort("daysHeld")}
                className="p-4 cursor-pointer"
              >
                Days Held
              </th>
              <th
                onClick={() => requestSort("totalProfit")}
                className="p-4 cursor-pointer"
              >
                Total Profit
              </th>
              <th
                onClick={() => requestSort("profitPercent")}
                className="p-4 cursor-pointer"
              >
                Profit %
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPortfolio.map((stock) => {
              const currentPrice = getCurrentPrice(stock.symbol);
              const value = currentPrice * stock.quantity;
              const profit = value - stock.purchasePrice * stock.quantity;
              const profitPercentage =
                (profit / (stock.purchasePrice * stock.quantity)) * 100;
              const purchaseDate = new Date(stock.purchaseDate);
              const daysHeld = Math.floor(
                (new Date() - purchaseDate) / (1000 * 60 * 60 * 24)
              );

              return (
                <tr key={stock.id} className="border-b border-border">
                  <td className="p-4">{stock.symbol}</td>
                  <td className="p-4">${stock.purchasePrice.toFixed(2)}</td>
                  <td className="p-4">{stock.quantity}</td>
                  <td className="p-4">{purchaseDate.toLocaleDateString()}</td>
                  <td className="p-4">{daysHeld}</td>
                  <td
                    className={`p-4 ${
                      profit >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    ${profit.toFixed(2)}
                  </td>
                  <td
                    className={`p-4 ${
                      profit >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    {profitPercentage.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Portfolio;
