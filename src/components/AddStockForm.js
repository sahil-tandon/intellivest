import React, { useState } from "react";
import { motion } from "framer-motion";

function AddStockForm({ onAddStock }) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddStock({
      symbol,
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      purchaseDate: new Date(purchaseDate),
    });
    setSymbol("");
    setQuantity("");
    setPurchasePrice("");
    setPurchaseDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-6 bg-card rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-primary">Add New Stock</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Stock Symbol"
          className="bg-background text-text-primary border border-border rounded p-2"
          required
        />
        <input
          type="number"
          step="any"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          placeholder="Purchase Price"
          className="bg-background text-text-primary border border-border rounded p-2"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="bg-background text-text-primary border border-border rounded p-2"
          required
        />
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="bg-background text-text-primary border border-border rounded p-2"
          required
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 px-4 py-2 bg-primary text-background rounded shadow-lg"
      >
        Add Stock
      </motion.button>
    </form>
  );
}

export default AddStockForm;
