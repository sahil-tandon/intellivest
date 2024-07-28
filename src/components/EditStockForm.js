import React, { useState } from "react";
import StockTransactionForm from "./StockTransactionForm";

function EditStockForm({ stock, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(stock);

  const handleSubmit = (updatedData) => {
    onSubmit(updatedData);
  };

  return (
    <div>
      <StockTransactionForm
        initialData={formData}
        onSubmit={handleSubmit}
        submitButtonText="Update"
        onCancel={onCancel}
      />
    </div>
  );
}

export default EditStockForm;
