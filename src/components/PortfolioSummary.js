import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatIndianRupee } from "../utils/currencyFormatting";

function PortfolioSummary({ portfolio, pastRecords, getCurrentPrice }) {
  const totalInvestedAmount = portfolio.reduce(
    (total, stock) => total + stock.quantity * stock.price,
    0
  );

  const currentPortfolioValue = portfolio.reduce((total, stock) => {
    const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
    return currentPrice !== null
      ? total + stock.quantity * currentPrice
      : total;
  }, 0);

  const totalUnrealizedProfitLoss = currentPortfolioValue - totalInvestedAmount;
  const totalUnrealizedProfitLossPercentage =
    totalInvestedAmount !== 0
      ? ((currentPortfolioValue - totalInvestedAmount) / totalInvestedAmount) *
        100
      : 0;

  const totalRealizedProfitLoss = pastRecords.reduce(
    (total, record) => total + record.profit,
    0
  );

  const stocksInProfit = portfolio.filter((stock) => {
    const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
    return currentPrice !== null && currentPrice > stock.price;
  }).length;

  const stocksInLoss = portfolio.filter((stock) => {
    const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
    return currentPrice !== null && currentPrice < stock.price;
  }).length;

  const bestPerformingStock = portfolio.reduce(
    (best, stock) => {
      const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
      if (currentPrice === null) return best;
      const profitPercentage =
        ((currentPrice - stock.price) / stock.price) * 100;
      return profitPercentage > best.profitPercentage
        ? { ...stock, profitPercentage }
        : best;
    },
    { profitPercentage: -Infinity }
  );

  const worstPerformingStock = portfolio.reduce(
    (worst, stock) => {
      const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
      if (currentPrice === null) return worst;
      const profitPercentage =
        ((currentPrice - stock.price) / stock.price) * 100;
      return profitPercentage < worst.profitPercentage
        ? { ...stock, profitPercentage }
        : worst;
    },
    { profitPercentage: Infinity }
  );

  const longestHeldStock = portfolio.reduce(
    (longest, stock) => {
      const daysHeld = Math.floor(
        (new Date() - new Date(stock.date)) / (1000 * 60 * 60 * 24)
      );
      return daysHeld > longest.daysHeld ? { ...stock, daysHeld } : longest;
    },
    { daysHeld: 0 }
  );

  const mostRecentlyAddedStock = portfolio.reduce(
    (mostRecent, stock) => {
      return new Date(stock.date) > new Date(mostRecent.date)
        ? stock
        : mostRecent;
    },
    { date: new Date(0) }
  );

  const averageDaysHeld =
    portfolio.reduce((total, stock) => {
      return (
        total +
        Math.floor((new Date() - new Date(stock.date)) / (1000 * 60 * 60 * 24))
      );
    }, 0) / portfolio.length;

  const bestPerformingStockPercent = portfolio.reduce(
    (best, stock) => {
      const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
      if (currentPrice === null) return best;
      const profitPercentage =
        ((currentPrice - stock.price) / stock.price) * 100;
      return profitPercentage > best.profitPercentage
        ? { ...stock, profitPercentage, currentPrice }
        : best;
    },
    { profitPercentage: -Infinity }
  );

  const bestPerformingStockAmount = portfolio.reduce(
    (best, stock) => {
      const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
      if (currentPrice === null) return best;
      const profitAmount = (currentPrice - stock.price) * stock.quantity;
      return profitAmount > best.profitAmount
        ? { ...stock, profitAmount, currentPrice }
        : best;
    },
    { profitAmount: -Infinity }
  );

  const worstPerformingStockPercent = portfolio.reduce(
    (worst, stock) => {
      const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
      if (currentPrice === null) return worst;
      const profitPercentage =
        ((currentPrice - stock.price) / stock.price) * 100;
      return profitPercentage < worst.profitPercentage
        ? { ...stock, profitPercentage, currentPrice }
        : worst;
    },
    { profitPercentage: Infinity }
  );

  const worstPerformingStockAmount = portfolio.reduce(
    (worst, stock) => {
      const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
      if (currentPrice === null) return worst;
      const profitAmount = (currentPrice - stock.price) * stock.quantity;
      return profitAmount < worst.profitAmount
        ? { ...stock, profitAmount, currentPrice }
        : worst;
    },
    { profitAmount: Infinity }
  );

  const StatBox = ({ title, value, subValue, valueColor }) => (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-2 text-text-secondary">
        {title}
      </h3>
      <p className={`text-xl font-bold ${valueColor || "text-primary"}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-sm text-text-secondary mt-1">{subValue}</p>
      )}
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Portfolio Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatBox
          title="Total Portfolio Value"
          value={`₹${formatIndianRupee(currentPortfolioValue.toFixed(2))}`}
        />
        <StatBox
          title="Total Invested Amount"
          value={`₹${formatIndianRupee(totalInvestedAmount.toFixed(2))}`}
        />
        <StatBox
          title="Unrealized Profit/Loss"
          value={`₹${formatIndianRupee(
            Math.abs(totalUnrealizedProfitLoss).toFixed(2)
          )}`}
          subValue={`${totalUnrealizedProfitLossPercentage.toFixed(2)}%`}
          valueColor={
            totalUnrealizedProfitLoss >= 0 ? "text-profit" : "text-loss"
          }
        />
        <StatBox
          title="Realized Profit/Loss"
          value={`₹${formatIndianRupee(
            Math.abs(totalRealizedProfitLoss).toFixed(2)
          )}`}
          valueColor={
            totalRealizedProfitLoss >= 0 ? "text-profit" : "text-loss"
          }
        />
        <StatBox
          title="Stocks Performance"
          value={
            <>
              <span className="text-profit">
                {stocksInProfit} <FaArrowUp className="inline" />
              </span>{" "}
              /{" "}
              <span className="text-loss">
                {stocksInLoss} <FaArrowDown className="inline" />
              </span>
            </>
          }
        />
        <StatBox
          title="Best Performing Stock"
          value={`${
            bestPerformingStockPercent.symbol
          } (${bestPerformingStockPercent.profitPercentage.toFixed(2)}%)`}
          subValue={`${bestPerformingStockAmount.symbol} (₹${formatIndianRupee(
            bestPerformingStockAmount.profitAmount.toFixed(2)
          )})`}
          valueColor="text-profit"
        />
        <StatBox
          title="Worst Performing Stock"
          value={`${
            worstPerformingStockPercent.symbol
          } (${worstPerformingStockPercent.profitPercentage.toFixed(2)}%)`}
          subValue={`${worstPerformingStockAmount.symbol} (₹${formatIndianRupee(
            Math.abs(worstPerformingStockAmount.profitAmount).toFixed(2)
          )})`}
          valueColor="text-loss"
        />
        <StatBox
          title="Longest Held Stock"
          value={longestHeldStock.symbol}
          subValue={`${longestHeldStock.daysHeld} days`}
        />
        <StatBox
          title="Most Recently Added"
          value={mostRecentlyAddedStock.symbol}
          subValue={new Date(mostRecentlyAddedStock.date).toLocaleDateString()}
        />
      </div>
    </div>
  );
}

export default PortfolioSummary;
