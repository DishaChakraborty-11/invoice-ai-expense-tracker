import React, { useState } from "react";
import UploadInvoice from "./components/UploadInvoice";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [expenses, setExpenses] = useState([]);

  const handleNewExpense = (data) => {
    setExpenses((prev) => [...prev, data]);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>AI Invoice OCR + Expense Tracker</h1>
      <UploadInvoice onUploadSuccess={handleNewExpense} />
      <Dashboard expenses={expenses} />
    </div>
  );
};

export default App;
