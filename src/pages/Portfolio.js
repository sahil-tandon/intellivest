import React, { useState, useEffect } from "react";
import AddStockForm from "../components/AddStockForm";
import SellStockForm from "../components/SellStockForm";
import SortableTable from "../components/SortableTable";
import { motion } from "framer-motion";
import { FaTrash, FaMoneyBillWave } from "react-icons/fa";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [pastRecords, setPastRecords] = useState([]);
  const [portfolioSortConfig, setPortfolioSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [pastRecordsSortConfig, setPastRecordsSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [sellStock, setSellStock] = useState(null);

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

  const calculateDaysHeld = (purchaseDate, sellDate = new Date()) => {
    const purchase = new Date(purchaseDate);
    const sell = new Date(sellDate);
    return Math.floor((sell - purchase) / (1000 * 60 * 60 * 24));
  };

  const deleteStock = (id) => {
    setPortfolio(portfolio.filter((stock) => stock.id !== id));
  };

  const handleSellStock = (id, sellPrice, sellQuantity, sellDate) => {
    const stock = portfolio.find((s) => s.id === id);
    if (!stock) return;

    const totalSellAmount = sellQuantity * sellPrice;
    const totalBuyAmount = sellQuantity * stock.purchasePrice;
    const profit = totalSellAmount - totalBuyAmount;
    const profitPercentage = (profit / totalBuyAmount) * 100;

    const soldRecord = {
      id: Date.now(),
      symbol: stock.symbol,
      quantity: sellQuantity,
      purchasePrice: stock.purchasePrice,
      purchaseDate: stock.purchaseDate,
      sellPrice,
      sellDate,
      profit,
      profitPercentage,
      daysHeld: calculateDaysHeld(stock.purchaseDate, sellDate),
    };

    setPastRecords([...pastRecords, soldRecord]);

    if (sellQuantity === stock.quantity) {
      setPortfolio(portfolio.filter((s) => s.id !== id));
    } else {
      setPortfolio(
        portfolio.map((s) =>
          s.id === id ? { ...s, quantity: s.quantity - sellQuantity } : s
        )
      );
    }

    setSellStock(null);
  };

  const sortData = (data, sortConfig) => {
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

  const handleSort = (key, setSortConfig) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          ...prevConfig,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  };

  const portfolioColumns = [
    { key: "symbol", label: "Symbol" },
    { key: "quantity", label: "Quantity" },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      render: (stock) => `$${stock.purchasePrice.toFixed(2)}`,
    },
    {
      key: "currentPrice",
      label: "Current Price",
      render: (stock) => `$${getCurrentPrice(stock.symbol).toFixed(2)}`,
    },
    {
      key: "totalValue",
      label: "Total Value",
      render: (stock) =>
        `$${(stock.quantity * getCurrentPrice(stock.symbol)).toFixed(2)}`,
    },
    {
      key: "profit",
      label: "Profit",
      render: (stock) => {
        const profit =
          (getCurrentPrice(stock.symbol) - stock.purchasePrice) *
          stock.quantity;
        return (
          <span className={profit >= 0 ? "text-profit" : "text-loss"}>
            ${profit.toFixed(2)}
          </span>
        );
      },
    },
    {
      key: "profitPercentage",
      label: "Profit %",
      render: (stock) => {
        const profitPercentage =
          ((getCurrentPrice(stock.symbol) - stock.purchasePrice) /
            stock.purchasePrice) *
          100;
        return (
          <span className={profitPercentage >= 0 ? "text-profit" : "text-loss"}>
            {profitPercentage.toFixed(2)}%
          </span>
        );
      },
    },
    { key: "purchaseDate", label: "Purchase Date" },
    {
      key: "daysHeld",
      label: "Days Held",
      render: (stock) => calculateDaysHeld(stock.purchaseDate),
    },
  ];

  const pastRecordsColumns = [
    { key: "symbol", label: "Symbol" },
    { key: "quantity", label: "Quantity" },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      render: (record) => `$${record.purchasePrice.toFixed(2)}`,
    },
    {
      key: "sellPrice",
      label: "Sell Price",
      render: (record) => `$${record.sellPrice.toFixed(2)}`,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (record) => `$${(record.quantity * record.sellPrice).toFixed(2)}`,
    },
    {
      key: "profit",
      label: "Profit/Loss",
      render: (record) => (
        <span className={record.profit >= 0 ? "text-profit" : "text-loss"}>
          ${record.profit.toFixed(2)}
        </span>
      ),
    },
    {
      key: "profitPercentage",
      label: "P/L %",
      render: (record) => (
        <span
          className={record.profitPercentage >= 0 ? "text-profit" : "text-loss"}
        >
          {record.profitPercentage.toFixed(2)}%
        </span>
      ),
    },
    { key: "purchaseDate", label: "Purchase Date" },
    { key: "sellDate", label: "Sell Date" },
    { key: "daysHeld", label: "Days Held" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Portfolio</h1>
      <AddStockForm onAddStock={addStock} />

      <SortableTable
        columns={portfolioColumns}
        data={sortData(portfolio, portfolioSortConfig)}
        sortConfig={portfolioSortConfig}
        onSort={(key) => handleSort(key, setPortfolioSortConfig)}
        actions={(stock) => (
          <>
            <button
              onClick={() => setSellStock(stock)}
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
          </>
        )}
      />

      {sellStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <SellStockForm
            stock={sellStock}
            onSell={handleSellStock}
            onCancel={() => setSellStock(null)}
          />
        </div>
      )}

      <h2 className="text-2xl font-bold mt-12 mb-4 text-primary">
        Past Records
      </h2>
      <SortableTable
        columns={pastRecordsColumns}
        data={sortData(pastRecords, pastRecordsSortConfig)}
        sortConfig={pastRecordsSortConfig}
        onSort={(key) => handleSort(key, setPastRecordsSortConfig)}
      />
    </div>
  );
}

export default Portfolio;
