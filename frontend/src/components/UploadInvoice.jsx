import React, { useState } from "react";
import axios from "axios";

const UploadInvoice = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResponse(res.data.extracted_data);
      onUploadSuccess(res.data.extracted_data);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Invoice 🧾</h2>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button style={styles.button} onClick={handleUpload}>
        {loading ? "Processing..." : "Upload"}
      </button>

      {response && (
        <div style={styles.card}>
          <h4>Extracted Data:</h4>
          <p><b>Vendor:</b> {response.vendor}</p>
          <p><b>Date:</b> {response.date}</p>
          <p><b>Amount:</b> {response.amount}</p>
          <p><b>Category:</b> {response.category}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "12px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    width: "400px",
    margin: "20px auto",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    marginTop: "15px",
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
  },
};

export default UploadInvoice;
