import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function PortfolioSummary({ portfolio, pastRecords, getCurrentPrice }) {
  const totalInvestedAmount = portfolio.reduce(
    (total, stock) => total + stock.quantity * stock.price,
    0
  );

  const currentPortfolioValue = portfolio.reduce(
    (total, stock) => total + stock.quantity * getCurrentPrice(stock.symbol),
    0
  );

  const totalUnrealizedProfitLoss = currentPortfolioValue - totalInvestedAmount;
  const totalUnrealizedProfitLossPercentage =
    totalInvestedAmount !== 0
      ? (totalUnrealizedProfitLoss / totalInvestedAmount) * 100
      : 0;

  const portfolioPerformance = portfolio.map((stock) => ({
    ...stock,
    currentPrice: getCurrentPrice(stock.symbol),
    profitLoss: (getCurrentPrice(stock.symbol) - stock.price) * stock.quantity,
    profitLossPercentage:
      stock.price !== 0
        ? ((getCurrentPrice(stock.symbol) - stock.price) / stock.price) * 100
        : 0,
  }));

  const topPerformingStock =
    portfolioPerformance.length > 0
      ? portfolioPerformance.reduce(
          (top, stock) =>
            stock.profitLossPercentage > top.profitLossPercentage ? stock : top,
          portfolioPerformance[0]
        )
      : null;

  const worstPerformingStock =
    portfolioPerformance.length > 0
      ? portfolioPerformance.reduce(
          (worst, stock) =>
            stock.profitLossPercentage < worst.profitLossPercentage
              ? stock
              : worst,
          portfolioPerformance[0]
        )
      : null;

  const totalRealizedProfitLoss = pastRecords.reduce(
    (total, record) => total + record.profit,
    0
  );

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Portfolio Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-card-dark p-4 rounded-lg">
          <p className="text-text-secondary mb-2">Total Invested Amount</p>
          <p className="text-3xl font-bold">
            ${totalInvestedAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-card-dark p-4 rounded-lg">
          <p className="text-text-secondary mb-2">Unrealized Profit/Loss</p>
          <p
            className={`text-3xl font-bold ${
              totalUnrealizedProfitLoss >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            ${totalUnrealizedProfitLoss.toFixed(2)} (
            {totalUnrealizedProfitLossPercentage.toFixed(2)}%)
          </p>
        </div>
        <div className="bg-card-dark p-4 rounded-lg">
          <p className="text-text-secondary mb-2">Realized Profit/Loss</p>
          <p
            className={`text-3xl font-bold ${
              totalRealizedProfitLoss >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            ${totalRealizedProfitLoss.toFixed(2)}
          </p>
        </div>
        {topPerformingStock && (
          <div className="bg-card-dark p-4 rounded-lg">
            <p className="text-text-secondary mb-2">Top Performing Stock</p>
            <div className="flex items-center">
              <FaArrowUp className="text-profit mr-2" />
              <p className="text-2xl font-bold">{topPerformingStock.symbol}</p>
            </div>
            <p className="text-profit">
              {topPerformingStock.profitLossPercentage.toFixed(2)}%
            </p>
          </div>
        )}
        {worstPerformingStock && (
          <div className="bg-card-dark p-4 rounded-lg">
            <p className="text-text-secondary mb-2">Worst Performing Stock</p>
            <div className="flex items-center">
              <FaArrowDown className="text-loss mr-2" />
              <p className="text-2xl font-bold">
                {worstPerformingStock.symbol}
              </p>
            </div>
            <p className="text-loss">
              {worstPerformingStock.profitLossPercentage.toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioSummary;
