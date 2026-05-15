import React, { useState } from "react";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("https://invoice-ai-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error uploading invoice");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>📊 AI Invoice Expense Tracker</h1>

      <input type="file" onChange={uploadFile} />

      {loading && <p>Processing invoice...</p>}

      {result && (
        <div className="result-box">
          <h3>Vendor: {result.vendor}</h3>
          <h3>Date: {result.date}</h3>
          <h3>Amount: {result.amount}</h3>

          <h4>OCR Extracted Text Preview:</h4>
          <pre>{result.raw_text}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
