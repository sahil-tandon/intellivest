import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
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

  const totalProfit = useMemo(() => {
    return chartData.length > 0
      ? chartData[chartData.length - 1].profitLoss
      : 0;
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border border-text-secondary rounded">
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

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatYAxis = (value) => {
    if (value === 0) return "₹0";
    if (Math.abs(value) >= 10000000)
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Net Realized Profit/Loss
      </h2>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-lg text-text-secondary">
          Total Realized:
          <span
            className={`ml-2 font-bold ${
              totalProfit >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            ₹{formatIndianRupee(totalProfit.toFixed(2))}
          </span>
        </p>
        <p className="text-sm text-text-secondary">
          {`${chartData.length} transactions`}
        </p>
      </div>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="#94A3B8"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickMargin={10}
              interval={"preserveStartEnd"}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="#94A3B8"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#4B5563" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="profitLoss"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, fill: "#8884d8", stroke: "#FFFFFF" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitLossChart;
