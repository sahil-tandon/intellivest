import React, { useState, useEffect } from "react";
import EditStockForm from "../components/EditStockForm";
import PortfolioSummary from "../components/PortfolioSummary";
import StockTransactionForm from "../components/StockTransactionForm";
import SortableTable from "../components/SortableTable";
import { motion } from "framer-motion";
import { FaEdit, FaMoneyBillWave, FaPlusCircle, FaTrash } from "react-icons/fa";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [pastRecords, setPastRecords] = useState([]);
  const [sellStock, setSellStock] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

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
    setShowAddForm(false);
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

  const deletePastRecord = (id) => {
    setPastRecords(pastRecords.filter((record) => record.id !== id));
  };

  const handleEditStock = (updatedStock) => {
    setPortfolio(
      portfolio.map((stock) =>
        stock.id === updatedStock.id ? { ...stock, ...updatedStock } : stock
      )
    );
    setEditingStock(null);
  };

  const handleEditRecord = (updatedRecord) => {
    setPastRecords(
      pastRecords.map((record) =>
        record.id === updatedRecord.id
          ? { ...record, ...updatedRecord }
          : record
      )
    );
    setEditingRecord(null);
  };

  const handleSellStock = (stock, sellPrice, sellQuantity, sellDate) => {
    const totalSellAmount = sellQuantity * sellPrice;
    const totalBuyAmount = sellQuantity * stock.price;
    const profit = totalSellAmount - totalBuyAmount;
    const profitPercentage = (profit / totalBuyAmount) * 100;

    const soldRecord = {
      id: Date.now(),
      symbol: stock.symbol,
      quantity: sellQuantity,
      purchasePrice: stock.price,
      purchaseDate: stock.date,
      sellPrice,
      sellDate,
      profit,
      profitPercentage,
      daysHeld: calculateDaysHeld(stock.date, sellDate),
    };

    setPastRecords([...pastRecords, soldRecord]);

    if (sellQuantity === stock.quantity) {
      setPortfolio(portfolio.filter((s) => s.id !== stock.id));
    } else {
      setPortfolio(
        portfolio.map((s) =>
          s.id === stock.id ? { ...s, quantity: s.quantity - sellQuantity } : s
        )
      );
    }

    setSellStock(null);
  };

  const portfolioColumns = [
    { key: "symbol", label: "Symbol" },
    { key: "quantity", label: "Quantity" },
    {
      key: "price",
      label: "Purchase Price",
      render: (stock) => `$${Number(stock.price).toFixed(2)}`,
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
          (getCurrentPrice(stock.symbol) - Number(stock.price)) *
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
          ((getCurrentPrice(stock.symbol) - Number(stock.price)) /
            Number(stock.price)) *
          100;
        return (
          <span className={profitPercentage >= 0 ? "text-profit" : "text-loss"}>
            {profitPercentage.toFixed(2)}%
          </span>
        );
      },
    },
    { key: "date", label: "Purchase Date" },
    {
      key: "daysHeld",
      label: "Days Held",
      render: (stock) => calculateDaysHeld(stock.date),
    },
  ];

  const pastRecordsColumns = [
    { key: "symbol", label: "Symbol" },
    { key: "quantity", label: "Quantity" },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      render: (record) => `$${Number(record.purchasePrice).toFixed(2)}`,
    },
    {
      key: "sellPrice",
      label: "Sell Price",
      render: (record) => `$${Number(record.sellPrice).toFixed(2)}`,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (record) =>
        `$${(record.quantity * Number(record.sellPrice)).toFixed(2)}`,
    },
    {
      key: "profit",
      label: "Profit/Loss",
      render: (record) => (
        <span className={record.profit >= 0 ? "text-profit" : "text-loss"}>
          ${Number(record.profit).toFixed(2)}
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
          {Number(record.profitPercentage).toFixed(2)}%
        </span>
      ),
    },
    { key: "purchaseDate", label: "Purchase Date" },
    { key: "sellDate", label: "Sell Date" },
    { key: "daysHeld", label: "Days Held" },
  ];

  const renderSellForm = (stock) => (
    <tr>
      <td colSpan={portfolioColumns.length + 1}>
        <StockTransactionForm
          onSubmit={(sellData) =>
            handleSellStock(
              stock,
              sellData.price,
              sellData.quantity,
              sellData.date
            )
          }
          initialData={{
            symbol: stock.symbol,
            quantity: stock.quantity,
            price: getCurrentPrice(stock.symbol),
            date: new Date().toISOString().split("T")[0],
          }}
          submitButtonText="Sell Stock"
          fields={[
            {
              name: "quantity",
              label: "Quantity to Sell",
              type: "number",
              max: stock.quantity,
            },
            {
              name: "price",
              label: "Sell Price",
              type: "number",
              step: "0.01",
            },
            { name: "date", label: "Sell Date", type: "date" },
          ]}
        />
        <button
          onClick={() => setSellStock(null)}
          className="mt-2 bg-text-secondary text-background px-4 py-2 rounded hover:bg-opacity-90 transition duration-200"
        >
          Cancel
        </button>
      </td>
    </tr>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Portfolio</h1>
      <PortfolioSummary
        portfolio={portfolio}
        pastRecords={pastRecords}
        getCurrentPrice={getCurrentPrice}
      />
      <SortableTable
        columns={portfolioColumns}
        data={portfolio}
        actions={(stock) => (
          <>
            <button
              onClick={() => setEditingStock(stock)}
              className="text-primary hover:text-secondary mr-2"
            >
              <FaEdit />
            </button>
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
        renderExpandedRow={(stock) =>
          editingStock && editingStock.id === stock.id ? (
            <tr>
              <td colSpan={portfolioColumns.length + 1}>
                <EditStockForm
                  stock={editingStock}
                  onSubmit={handleEditStock}
                  onCancel={() => setEditingStock(null)}
                />
              </td>
            </tr>
          ) : (
            sellStock && sellStock.id === stock.id && renderSellForm(stock)
          )
        }
      />

      {showAddForm ? (
        <div className="mt-4">
          <StockTransactionForm
            onSubmit={addStock}
            submitButtonText="Add Stock"
            fields={[
              { name: "symbol", label: "Stock Symbol", type: "text" },
              { name: "quantity", label: "Quantity", type: "number" },
              {
                name: "price",
                label: "Purchase Price",
                type: "number",
                step: "0.01",
              },
              { name: "date", label: "Purchase Date", type: "date" },
            ]}
          />
          <button
            onClick={() => setShowAddForm(false)}
            className="mt-2 bg-text-secondary text-background px-4 py-2 rounded hover:bg-opacity-90 transition duration-200"
          >
            Cancel
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="mt-4 bg-primary text-background px-4 py-2 rounded hover:bg-opacity-90 transition duration-200 flex items-center"
        >
          <FaPlusCircle className="mr-2" /> Add Stock
        </motion.button>
      )}

      <h2 className="text-2xl font-bold mt-12 mb-4 text-primary">
        Past Records
      </h2>
      <SortableTable
        columns={pastRecordsColumns}
        data={pastRecords}
        actions={(record) => (
          <>
            <button
              onClick={() => setEditingRecord(record)}
              className="text-primary hover:text-secondary mr-2"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => deletePastRecord(record.id)}
              className="text-loss hover:text-primary"
            >
              <FaTrash />
            </button>
          </>
        )}
        renderExpandedRow={(stock) =>
          editingStock && editingStock.id === stock.id ? (
            <tr>
              <td colSpan={portfolioColumns.length + 1}>
                <EditStockForm
                  stock={editingStock}
                  onSubmit={handleEditStock}
                  onCancel={() => setEditingStock(null)}
                />
              </td>
            </tr>
          ) : (
            sellStock && sellStock.id === stock.id && renderSellForm(stock)
          )
        }
      />
    </div>
  );
}

export default Portfolio;
