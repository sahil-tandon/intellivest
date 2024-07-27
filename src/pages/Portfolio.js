import React, { useState, useEffect } from "react";
import AddStockForm from "../components/AddStockForm";
import { motion } from "framer-motion";
import { FaSort, FaTrash, FaMoneyBillWave } from "react-icons/fa";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [pastRecords, setPastRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const savedPortfolio = localStorage.getItem("portfolio");
    const savedPastRecords = localStorage.getItem("pastRecords");
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
    if (savedPastRecords) setPastRecords(JSON.parse(savedPastRecords));
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    localStorage.setItem("pastRecords", JSON.stringify(pastRecords));
  }, [portfolio, pastRecords]);

  const addStock = (stock) => {
    setPortfolio([...portfolio, { ...stock, id: Date.now() }]);
  };

  const getCurrentPrice = (symbol) => {
    // Placeholder function
    return Math.random() * 100 + 50;
  };

  const calculateDaysHeld = (purchaseDate) => {
    const today = new Date();
    const purchase = new Date(purchaseDate);
    return Math.floor((today - purchase) / (1000 * 60 * 60 * 24));
  };

  const deleteStock = (id) => {
    setPortfolio(portfolio.filter((stock) => stock.id !== id));
  };

  const sellStock = (id) => {
    const stock = portfolio.find((s) => s.id === id);
    if (!stock) return;

    const sellPrice = prompt(`Enter sell price for ${stock.symbol}:`);
    const sellQuantity = prompt(
      `Enter quantity to sell (max ${stock.quantity}):`
    );
    const sellDate = prompt("Enter sell date (YYYY-MM-DD):");

    if (!sellPrice || !sellQuantity || !sellDate) return;

    const soldQuantity = Math.min(Number(sellQuantity), stock.quantity);
    const totalSellAmount = soldQuantity * Number(sellPrice);
    const totalBuyAmount = soldQuantity * stock.purchasePrice;
    const profit = totalSellAmount - totalBuyAmount;
    const profitPercentage = (profit / totalBuyAmount) * 100;

    const soldRecord = {
      id: Date.now(),
      symbol: stock.symbol,
      quantity: soldQuantity,
      purchasePrice: stock.purchasePrice,
      purchaseDate: stock.purchaseDate,
      sellPrice: Number(sellPrice),
      sellDate,
      profit,
      profitPercentage,
    };

    setPastRecords([...pastRecords, soldRecord]);

    if (soldQuantity === stock.quantity) {
      setPortfolio(portfolio.filter((s) => s.id !== id));
    } else {
      setPortfolio(
        portfolio.map((s) =>
          s.id === id ? { ...s, quantity: s.quantity - soldQuantity } : s
        )
      );
    }
  };

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Portfolio</h1>
      <AddStockForm onAddStock={addStock} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-primary">
          <thead className="text-xs uppercase bg-card">
            <tr>
              {[
                "Symbol",
                "Quantity",
                "Purchase Price",
                "Current Price",
                "Total Value",
                "Profit",
                "Profit %",
                "Purchase Date",
                "Days Held",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 cursor-pointer"
                  onClick={() =>
                    sortTable(header.toLowerCase().replace(" ", ""))
                  }
                >
                  {header}{" "}
                  {renderSortIcon(header.toLowerCase().replace(" ", ""))}
                </th>
              ))}
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getSortedData(portfolio).map((stock) => {
              const currentPrice = getCurrentPrice(stock.symbol);
              const value = currentPrice * stock.quantity;
              const profit = value - stock.purchasePrice * stock.quantity;
              const profitPercentage =
                (profit / (stock.purchasePrice * stock.quantity)) * 100;
              const daysHeld = calculateDaysHeld(stock.purchaseDate);

              return (
                <tr
                  key={stock.id}
                  className="bg-background border-b border-border"
                >
                  <td className="px-6 py-4">{stock.symbol}</td>
                  <td className="px-6 py-4">{stock.quantity}</td>
                  <td className="px-6 py-4">
                    ${stock.purchasePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">${currentPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">${value.toFixed(2)}</td>
                  <td
                    className={`px-6 py-4 ${
                      profit >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    ${profit.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      profit >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    {profitPercentage.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4">{stock.purchaseDate}</td>
                  <td className="px-6 py-4">{daysHeld}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => sellStock(stock.id)}
                      className="text-secondary hover:text-primary mr-2"
                    >
                      <FaMoneyBillWave />
                    </button>
                    <button
                      onClick={() => deleteStock(stock.id)}
                      className="text-loss hover:text-primary"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4 text-primary">
        Past Records
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-primary">
          <thead className="text-xs uppercase bg-card">
            <tr>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Purchase Price</th>
              <th className="px-6 py-3">Sell Price</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Profit/Loss</th>
              <th className="px-6 py-3">P/L %</th>
              <th className="px-6 py-3">Purchase Date</th>
              <th className="px-6 py-3">Sell Date</th>
            </tr>
          </thead>
          <tbody>
            {pastRecords.map((record) => (
              <tr
                key={record.id}
                className="bg-background border-b border-border"
              >
                <td className="px-6 py-4">{record.symbol}</td>
                <td className="px-6 py-4">{record.quantity}</td>
                <td className="px-6 py-4">
                  ${record.purchasePrice.toFixed(2)}
                </td>
                <td className="px-6 py-4">${record.sellPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  ${(record.quantity * record.sellPrice).toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 ${
                    record.profit >= 0 ? "text-profit" : "text-loss"
                  }`}
                >
                  ${record.profit.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 ${
                    record.profit >= 0 ? "text-profit" : "text-loss"
                  }`}
                >
                  {record.profitPercentage.toFixed(2)}%
                </td>
                <td className="px-6 py-4">{record.purchaseDate}</td>
                <td className="px-6 py-4">{record.sellDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Portfolio;
