import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatIndianRupee } from "../utils/currencyFormatting";

const ProfitLossChart = ({ pastRecords }) => {
  const chartData = useMemo(() => {
    if (!pastRecords || pastRecords.length === 0) {
      return [];
    }
    const isWeekend = (date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };

    const getNextWeekday = (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      while (isWeekend(nextDay)) {
        nextDay.setDate(nextDay.getDate() + 1);
      }
      return nextDay;
    };

    const sortedRecords = [...pastRecords].sort(
      (a, b) => new Date(a.sellDate) - new Date(b.sellDate)
    );

    const profitByDate = new Map();
    let cumulativeProfitLoss = 0;
    sortedRecords.forEach((record) => {
      const date = new Date(record.sellDate);
      if (!isWeekend(date)) {
        const dateString = date.toISOString().split("T")[0];
        cumulativeProfitLoss += record.profit;
        profitByDate.set(dateString, cumulativeProfitLoss);
      }
    });

    let startDate = new Date(sortedRecords[0].sellDate);
    let endDate = new Date(sortedRecords[sortedRecords.length - 1].sellDate);

    while (isWeekend(startDate)) {
      startDate = getNextWeekday(startDate);
    }
    while (isWeekend(endDate)) {
      endDate = new Date(endDate.setDate(endDate.getDate() - 1));
    }

    const allDates = [];
    for (let d = new Date(startDate); d <= endDate; d = getNextWeekday(d)) {
      allDates.push(d.toISOString().split("T")[0]);
    }

    let lastKnownProfit = 0;
    return allDates.map((date) => {
      if (profitByDate.has(date)) {
        lastKnownProfit = profitByDate.get(date);
      }
      return {
        date: date,
        profitLoss: lastKnownProfit,
      };
    });
  }, [pastRecords]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border border-text-secondary rounded shadow-lg">
          <p className="text-sm text-text-primary">
            {`Date: ${new Date(label).toLocaleDateString()}`}
          </p>
          <p className="text-lg font-bold text-primary">
            {`₹${formatIndianRupee(payload[0].value.toFixed(2))}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-96 bg-card rounded-lg shadow-lg p-6 mb-8 flex items-center justify-center">
        <p className="text-xl text-text-secondary">
          No profit/loss data available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-card rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Net Realized Profit/Loss
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorProfitLoss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            tickFormatter={(value) => `₹${formatIndianRupee(value.toFixed(0))}`}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="profitLoss"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorProfitLoss)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitLossChart;
