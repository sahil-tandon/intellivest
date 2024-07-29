import React, { useState } from "react";
import { motion } from "framer-motion";

function StockTransactionForm({
  onSubmit,
  initialData = {},
  submitButtonText = "Submit",
  fields,
}) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(
        formData.price || formData.purchasePrice || formData.sellPrice
      ),
    };
    onSubmit(processedData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderField = (field) => (
    <div key={field.name}>
      <label className="block text-sm font-medium text-text-secondary">
        {field.label}
      </label>
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleInputChange}
        className="mt-1 block w-full bg-background text-text-primary border border-border rounded p-2"
        required
        {...field}
      />
    </div>
  );

  const exchangeOptions = [
    { value: "NSE", label: "NSE (India)" },
    { value: "BSE", label: "BSE (India)" },
  ];

  const defaultFields = [
    { name: "symbol", label: "Stock Symbol", type: "text" },
    { name: "quantity", label: "Quantity", type: "number" },
    { name: "price", label: "Price", type: "number", step: "0.01" },
    { name: "date", label: "Transaction Date", type: "date" },
  ];

  const fieldsToRender = fields || defaultFields;

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-card rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldsToRender.map(renderField)}
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary">
          Exchange
        </label>
        <select
          name="exchange"
          value={formData.exchange || ""}
          onChange={handleInputChange}
          className="mt-1 block w-full bg-background text-text-primary border border-border rounded p-2"
          required
        >
          <option value="">Select Exchange</option>
          {exchangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="mt-4 bg-primary text-background px-4 py-2 rounded hover:bg-opacity-90 transition duration-200"
      >
        {submitButtonText}
      </motion.button>
    </form>
  );
}

export default StockTransactionForm;
