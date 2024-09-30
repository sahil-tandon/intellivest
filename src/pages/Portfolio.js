import React, { useState, useEffect } from "react";
import { ref, onValue, set, update } from "firebase/database";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import axios from "axios";
import EditStockForm from "../components/EditStockForm";
import { formatIndianRupee } from "../utils/currencyFormatting";
import PortfolioSummary from "../components/PortfolioSummary";
import StockTransactionForm from "../components/StockTransactionForm";
import SortableTable from "../components/SortableTable";
import ProfitLossChart from "../components/ProfitLossChart";
import { motion } from "framer-motion";
import { FaEdit, FaMoneyBillWave, FaPlusCircle, FaTrash } from "react-icons/fa";

const API_KEY = "70e08cfafcmshcdf8d1a000005e1p17818djsn9a3b752b554c";
const API_HOST = "apidojo-yahoo-finance-v1.p.rapidapi.com";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [pastRecords, setPastRecords] = useState([]);
  const [sellStock, setSellStock] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [stockPrices, setStockPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiLimitReached, setApiLimitReached] = useState(false);

  useEffect(() => {
    const portfolioRef = ref(db, "portfolio");
    const pastRecordsRef = ref(db, "pastRecords");
    const stockPricesRef = ref(db, "stockPrices");
    const lastUpdatedRef = ref(db, "lastUpdated");

    const unsubscribePortfolio = onValue(portfolioRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPortfolio(data);
    });

    const unsubscribePastRecords = onValue(pastRecordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPastRecords(data);
    });

    const unsubscribeStockPrices = onValue(stockPricesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("Loaded stock prices from Firebase:", data);
        setStockPrices(data);
      }
    });

    const unsubscribeLastUpdated = onValue(lastUpdatedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("Loaded last updated time from Firebase:", data);
        setLastUpdated(new Date(data));
      }
    });

    return () => {
      unsubscribePortfolio();
      unsubscribePastRecords();
      unsubscribeStockPrices();
      unsubscribeLastUpdated();
    };
  }, []);

  const savePortfolio = (newPortfolio) => {
    set(ref(db, "portfolio"), newPortfolio);
  };

  const savePastRecords = (newPastRecords) => {
    set(ref(db, "pastRecords"), newPastRecords);
  };

  const addStock = (stock) => {
    const newPortfolio = [...portfolio, { ...stock, id: Date.now() }];
    setPortfolio(newPortfolio);
    savePortfolio(newPortfolio);
    setShowAddForm(false);
  };

  const getCurrentPrice = (symbol) => {
    return stockPrices[symbol] || null;
  };

  const fetchStockPrices = async () => {
    try {
      const uniqueSymbols = [
        ...new Set(
          portfolio.map(
            (stock) =>
              `${stock.symbol}.${stock.exchange === "NSE" ? "NS" : "BO"}`
          )
        ),
      ];
      const region = "IN";

      const fetchBatch = async (symbols) => {
        const options = {
          method: "GET",
          url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
          params: { region, symbols: symbols.join(",") },
          headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
          },
        };

        const response = await axios.request(options);
        return response.data.quoteResponse.result;
      };

      const allQuotes = [];
      for (let i = 0; i < uniqueSymbols.length; i += 50) {
        const batch = uniqueSymbols.slice(i, i + 50);
        const batchQuotes = await fetchBatch(batch);
        allQuotes.push(...batchQuotes);
      }

      if (allQuotes && Array.isArray(allQuotes)) {
        const prices = {};
        portfolio.forEach((stock) => {
          const fullSymbol = `${stock.symbol}.${
            stock.exchange === "NSE" ? "NS" : "BO"
          }`;
          const quote = allQuotes.find((q) => q.symbol === fullSymbol);
          prices[stock.symbol] = quote ? quote.regularMarketPrice : null;
        });

        setStockPrices(prices);
        const now = new Date();
        setLastUpdated(now);

        const updates = {};
        updates["/stockPrices"] = prices;
        updates["/lastUpdated"] = now.toISOString();
        await update(ref(db), updates);
      }
    } catch (error) {
      console.error("Error fetching stock prices:", error);
      if (error.response && error.response.status === 429) {
        setApiLimitReached(true);
      }
    }
  };

  const calculateDaysHeld = (purchaseDate, sellDate = new Date()) => {
    const purchase = new Date(purchaseDate);
    const sell = new Date(sellDate);
    return Math.floor((sell - purchase) / (1000 * 60 * 60 * 24));
  };

  const deleteStock = (id) => {
    const newPortfolio = portfolio.filter((stock) => stock.id !== id);
    setPortfolio(newPortfolio);
    savePortfolio(newPortfolio);
    set(ref(db, "portfolio"), newPortfolio);
  };

  const deletePastRecord = (id) => {
    const newPastRecords = pastRecords.filter((record) => record.id !== id);
    setPastRecords(newPastRecords);
    savePastRecords(newPastRecords);
    set(ref(db, "pastRecords"), newPastRecords);
  };

  const handleEditStock = (updatedStock) => {
    const newPortfolio = portfolio.map((stock) =>
      stock.id === updatedStock.id ? { ...stock, ...updatedStock } : stock
    );
    setPortfolio(newPortfolio);
    savePortfolio(newPortfolio);

    const updates = {};
    updates["/portfolio"] = newPortfolio;
    update(ref(db), updates);

    setEditingStock(null);
  };

  const handleEditRecord = (updatedRecord) => {
    const newPastRecords = pastRecords.map((record) =>
      record.id === updatedRecord.id ? { ...record, ...updatedRecord } : record
    );
    setPastRecords(newPastRecords);
    savePastRecords(newPastRecords);

    const updates = {};
    updates["/pastRecords"] = newPastRecords;
    update(ref(db), updates);

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

    const newPastRecords = [...pastRecords, soldRecord];
    setPastRecords(newPastRecords);
    savePastRecords(newPastRecords);

    let newPortfolio;
    if (sellQuantity === stock.quantity) {
      newPortfolio = portfolio.filter((s) => s.id !== stock.id);
    } else {
      newPortfolio = portfolio.map((s) =>
        s.id === stock.id ? { ...s, quantity: s.quantity - sellQuantity } : s
      );
    }
    setPortfolio(newPortfolio);
    savePortfolio(newPortfolio);

    const updates = {};
    updates["/pastRecords"] = newPastRecords;
    updates["/portfolio"] = newPortfolio;
    update(ref(db), updates);

    setSellStock(null);
  };

  const portfolioColumns = [
    {
      key: "symbol",
      label: "Symbol",
      sortType: "string",
      render: (value, stock) => (
        <Link
          to={`/stock/${stock.symbol}`}
          className="text-primary hover:text-hover transition duration-200"
        >
          {value} ({stock.exchange})
        </Link>
      ),
    },
    { key: "quantity", label: "Quantity", sortType: "number" },
    {
      key: "price",
      label: "Avg Price",
      sortType: "number",
      render: (value) => `₹${formatIndianRupee(value.toFixed(2))}`,
    },
    {
      key: "currentPrice",
      label: "Mkt Price",
      sortType: "number",
      getValue: (stock) => getCurrentPrice(stock.symbol),
      render: (value) =>
        value !== null ? `₹${formatIndianRupee(value.toFixed(2))}` : "-",
    },
    {
      key: "totalValue",
      label: "Value",
      sortType: "number",
      getValue: (stock) => {
        const currentPrice = getCurrentPrice(stock.symbol);
        return currentPrice !== null ? stock.quantity * currentPrice : null;
      },
      render: (value) =>
        value !== null ? `₹${formatIndianRupee(value.toFixed(2))}` : "-",
    },
    {
      key: "profit",
      label: "P/L",
      sortType: "number",
      getValue: (stock) => {
        const currentPrice = getCurrentPrice(stock.symbol);
        return currentPrice !== null
          ? (currentPrice - stock.price) * stock.quantity
          : null;
      },
      render: (value) => {
        if (value === null) return "-";
        return (
          <span className={value >= 0 ? "text-profit" : "text-loss"}>
            ₹{formatIndianRupee(value.toFixed(2))}
          </span>
        );
      },
    },
    {
      key: "profitPercentage",
      label: "P/L%",
      sortType: "number",
      getValue: (stock) => {
        const currentPrice = getCurrentPrice(stock.symbol);
        return currentPrice !== null
          ? ((currentPrice - stock.price) / stock.price) * 100
          : null;
      },
      render: (value) => {
        if (value === null) return "-";
        return (
          <span className={value >= 0 ? "text-profit" : "text-loss"}>
            {value.toFixed(2)}%
          </span>
        );
      },
    },
    {
      key: "date",
      label: "Buy Date (Days Held)",
      sortType: "date",
      render: (value) => `${value} (${calculateDaysHeld(value)})`,
    },
  ];

  const pastRecordsColumns = [
    {
      key: "symbol",
      label: "Symbol",
      sortType: "string",
      render: (value, stock) => (
        <Link
          to={`/stock/${stock.symbol}`}
          className="text-primary hover:text-hover transition duration-200"
        >
          {value}
        </Link>
      ),
    },
    { key: "quantity", label: "Quantity", sortType: "number" },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      sortType: "number",
      render: (value) => `₹${formatIndianRupee(value.toFixed(2))}`,
    },
    {
      key: "sellPrice",
      label: "Sell Price",
      sortType: "number",
      render: (value) => `₹${formatIndianRupee(value.toFixed(2))}`,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      sortType: "number",
      getValue: (record) => record.quantity * record.sellPrice,
      render: (value) => `₹${formatIndianRupee(value.toFixed(2))}`,
    },
    {
      key: "profit",
      label: "Profit/Loss",
      sortType: "number",
      getValue: (record) => record.profit,
      render: (value) => {
        if (value === null) return "-";
        return (
          <span className={value >= 0 ? "text-profit" : "text-loss"}>
            ₹{formatIndianRupee(value.toFixed(2))}
          </span>
        );
      },
    },
    {
      key: "profitPercentage",
      label: "P/L %",
      sortType: "number",
      getValue: (record) => record.profitPercentage,
      render: (value) => {
        if (value === null) return "-";
        return (
          <span className={value >= 0 ? "text-profit" : "text-loss"}>
            {value.toFixed(2)}%
          </span>
        );
      },
    },
    {
      key: "purchaseDate",
      label: "Purchase Date",
      sortType: "date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "sellDate",
      label: "Sell Date",
      sortType: "date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { key: "daysHeld", label: "Days Held", sortType: "number" },
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
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>
      <div className="mb-8 flex">
        <div className="basis-1/2">
          <ProfitLossChart pastRecords={pastRecords} />
        </div>
        <div className="basis-1/2">
          <PortfolioSummary
            portfolio={portfolio}
            pastRecords={pastRecords}
            getCurrentPrice={(symbol) => getCurrentPrice(symbol)}
          />
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={fetchStockPrices}
          disabled={apiLimitReached}
          className="bg-primary text-background px-4 py-2 rounded hover:bg-opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh Stock Prices
        </button>
        {lastUpdated && (
          <span className="ml-4 text-text-secondary">
            Last updated: {lastUpdated.toLocaleString()}
          </span>
        )}
        {apiLimitReached && (
          <span className="ml-4 text-loss">
            API limit reached. Please try again later.
          </span>
        )}
      </div>
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
