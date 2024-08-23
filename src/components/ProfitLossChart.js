import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

  return (
    <div className="mb-8">
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
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
              stroke="#E2E8F0"
            />
            <YAxis
              tickFormatter={(value) =>
                `₹${formatIndianRupee(value.toFixed(0))}`
              }
              stroke="#E2E8F0"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#E2E8F0" />
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
