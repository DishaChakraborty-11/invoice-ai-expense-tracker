import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = ({ expenses }) => {
  if (expenses.length === 0)
    return <p style={{ textAlign: "center", color: "gray" }}>No data yet — upload an invoice to see analysis.</p>;

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount.replace(/[^\d.-]/g, "")), 0);

  const categoryData = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount.replace(/[^\d.-]/g, ""));
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h2>Expense Dashboard 💰</h2>
      <h3>Total Spending: ₹{total.toFixed(2)}</h3>

      <div style={{ width: "400px", margin: "auto" }}>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "40px",
    padding: "20px",
  },
};

export default Dashboard;
