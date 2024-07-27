import React, { useState, useEffect } from "react";
import AddStockForm from "../components/AddStockForm";
import { motion } from "framer-motion";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);

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

  // Placeholder function for fetching current price
  const getCurrentPrice = (symbol) => {
    // updated this later to fetch the current price from an API
    return Math.random() * 100 + 50;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Portfolio</h1>
      <AddStockForm onAddStock={addStock} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((stock) => {
          const currentPrice = getCurrentPrice(stock.symbol);
          const value = currentPrice * stock.quantity;
          const profit = value - stock.purchasePrice * stock.quantity;
          const profitPercentage =
            (profit / (stock.purchasePrice * stock.quantity)) * 100;

          return (
            <motion.div
              key={stock.id}
              className="bg-card p-6 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-bold mb-2 text-primary">
                {stock.symbol}
              </h2>
              <p>Quantity: {stock.quantity}</p>
              <p>Purchase Price: ${stock.purchasePrice.toFixed(2)}</p>
              <p>Current Price: ${currentPrice.toFixed(2)}</p>
              <p>Current Value: ${value.toFixed(2)}</p>
              <p className={profit >= 0 ? "text-profit" : "text-loss"}>
                Profit/Loss: ${profit.toFixed(2)} ({profitPercentage.toFixed(2)}
                %)
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Portfolio;
