import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatIndianRupee } from "../utils/currencyFormatting";

function PortfolioSummary({ portfolio, pastRecords, getCurrentPrice }) {
  const totalInvestedAmount = portfolio.reduce(
    (total, stock) => total + stock.quantity * stock.price,
    0
  );

  const hasUnavailablePrice = portfolio.some(
    (stock) => getCurrentPrice(stock.symbol, stock.exchange) === null
  );

  const currentPortfolioValue = portfolio.reduce((total, stock) => {
    const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
    return currentPrice !== null
      ? total + stock.quantity * currentPrice
      : total;
  }, 0);

  const totalUnrealizedProfitLoss = hasUnavailablePrice
    ? "-"
    : currentPortfolioValue - totalInvestedAmount;
  const totalUnrealizedProfitLossPercentage = hasUnavailablePrice
    ? "-"
    : totalInvestedAmount !== 0
    ? ((currentPortfolioValue - totalInvestedAmount) / totalInvestedAmount) *
      100
    : 0;

  const totalRealizedProfitLoss = pastRecords.reduce(
    (total, record) => total + record.profit,
    0
  );

  const portfolioPerformance = portfolio.map((stock) => {
    const currentPrice = getCurrentPrice(stock.symbol, stock.exchange);
    return {
      ...stock,
      currentPrice,
      profitLoss:
        currentPrice !== null
          ? (currentPrice - stock.price) * stock.quantity
          : "-",
      profitLossPercentage:
        currentPrice !== null
          ? ((currentPrice - stock.price) / stock.price) * 100
          : "-",
    };
  });

  const topPerformingStock = portfolioPerformance
    .filter((stock) => typeof stock.profitLossPercentage === "number")
    .reduce(
      (top, stock) =>
        stock.profitLossPercentage > top.profitLossPercentage ? stock : top,
      portfolioPerformance.find(
        (stock) => typeof stock.profitLossPercentage === "number"
      ) || null
    );

  const worstPerformingStock = portfolioPerformance
    .filter((stock) => typeof stock.profitLossPercentage === "number")
    .reduce(
      (worst, stock) =>
        stock.profitLossPercentage < worst.profitLossPercentage ? stock : worst,
      portfolioPerformance.find(
        (stock) => typeof stock.profitLossPercentage === "number"
      ) || null
    );

  return (
    <div className="p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Portfolio Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-4">
          <p className="text-text-secondary mb-2">Total Invested Amount</p>
          <p className="text-3xl font-bold">
            ₹{formatIndianRupee(totalInvestedAmount.toFixed(2))}
          </p>
        </div>
        <div className="p-4">
          <p className="text-text-secondary mb-2">Unrealized Profit/Loss</p>
          <p
            className={`text-3xl font-bold ${
              totalUnrealizedProfitLoss >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {totalUnrealizedProfitLoss === "-"
              ? "-"
              : `₹${formatIndianRupee(totalUnrealizedProfitLoss)}`}
            {totalUnrealizedProfitLossPercentage === "-"
              ? ""
              : ` (${totalUnrealizedProfitLossPercentage.toFixed(2)}%)`}
          </p>
        </div>
        <div className="p-4">
          <p className="text-text-secondary mb-2">Realized Profit/Loss</p>
          <p
            className={`text-3xl font-bold ${
              totalRealizedProfitLoss >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            ₹{formatIndianRupee(totalRealizedProfitLoss.toFixed(2))}
          </p>
        </div>
        {topPerformingStock && (
          <div className="p-4">
            <p className="text-text-secondary mb-2">Top Performing Stock</p>
            <div className="flex items-center">
              <FaArrowUp className="text-profit mr-2" />
              <p className="text-2xl font-bold">{topPerformingStock.symbol}</p>
            </div>
            <p className="text-profit">
              {typeof topPerformingStock.profitLossPercentage === "number"
                ? `${topPerformingStock.profitLossPercentage.toFixed(2)}%`
                : "-"}
            </p>
          </div>
        )}
        {worstPerformingStock && (
          <div className="p-4">
            <p className="text-text-secondary mb-2">Worst Performing Stock</p>
            <div className="flex items-center">
              <FaArrowDown className="text-loss mr-2" />
              <p className="text-2xl font-bold">
                {worstPerformingStock.symbol}
              </p>
            </div>
            <p className="text-loss">
              {typeof worstPerformingStock.profitLossPercentage === "number"
                ? `${worstPerformingStock.profitLossPercentage.toFixed(2)}%`
                : "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioSummary;
