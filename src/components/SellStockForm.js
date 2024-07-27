import React, { useState } from "react";
import { motion } from "framer-motion";

function SellStockForm({ stock, onSell, onCancel }) {
  const [sellPrice, setSellPrice] = useState("");
  const [sellQuantity, setSellQuantity] = useState(stock.quantity);
  const [sellDate, setSellDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSell(stock.id, Number(sellPrice), Number(sellQuantity), sellDate);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-primary">
        Sell {stock.symbol}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">
            Sell Price
          </label>
          <input
            type="number"
            step="0.01"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            className="mt-1 block w-full bg-background text-text-primary border border-border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">
            Quantity (max {stock.quantity})
          </label>
          <input
            type="number"
            max={stock.quantity}
            value={sellQuantity}
            onChange={(e) =>
              setSellQuantity(Math.min(e.target.value, stock.quantity))
            }
            className="mt-1 block w-full bg-background text-text-primary border border-border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">
            Sell Date
          </label>
          <input
            type="date"
            value={sellDate}
            onChange={(e) => setSellDate(e.target.value)}
            className="mt-1 block w-full bg-background text-text-primary border border-border rounded p-2"
            required
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancel}
          className="bg-text-secondary text-background px-4 py-2 rounded hover:bg-opacity-90 transition duration-200"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-primary text-background px-4 py-2 rounded hover:bg-opacity-90 transition duration-200"
        >
          Sell
        </motion.button>
      </div>
    </form>
  );
}

export default SellStockForm;
