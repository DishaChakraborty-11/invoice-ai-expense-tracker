import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { useDropzone } from 'react-dropzone';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setLoading(true);
        const formData = new FormData();
        formData.append('invoice', file);

        try {
          const response = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          setMessage(`✅ ${response.data.vendor} - $${response.data.total.toFixed(2)} (${response.data.category})`);
          fetchExpenses();
          fetchStats();
        } catch (error) {
          setMessage('❌ Error processing invoice');
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
  });

  const fetchExpenses = async () => {
    const response = await axios.get('http://localhost:5000/api/expenses');
    setExpenses(response.data);
  };

  const fetchStats = async () => {
    const response = await axios.get('http://localhost:5000/api/stats');
    setStats(response.data);
  };

  const chartData = {
    labels: stats.map(s => s.category.charAt(0).toUpperCase() + s.category.slice(1)),
    datasets: [{
      data: stats.map(s => s.total_spent),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384'
      ]
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Invoice Tracker
          </h1>
          <p className="text-xl text-gray-600">Upload invoices and track expenses automatically</p>
        </header>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div
            {...getRootProps()}
            className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-all cursor-pointer bg-gray-50 hover:bg-blue-50"
          >
            <input {...getInputProps()} />
            <div>
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {loading ? 'Processing...' : 'Drop invoice image or PDF here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">Supports JPG, PNG, PDF</p>
            </div>
          </div>
          {message && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dashboard Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Spending by Category</h2>
            <div className="h-80">
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Expenses</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {expenses.slice(0, 5).map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{expense.vendor}</p>
                    <p className="text-sm text-gray-500">{expense.date} • {expense.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-blue-600">${expense.total.toFixed(2)}</p>
                    {expense.image_path && (
                      <img src={`http://localhost:5000/${expense.image_path}`} 
                           alt="Invoice" 
                           className="w-12 h-12 object-cover rounded mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
