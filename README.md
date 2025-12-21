# 🧾 AI Invoice OCR + Expense Tracker

A full-stack AI-powered web application that extracts key information from invoices using **OCR (Optical Character Recognition)** and **NLP**, categorizes expenses automatically, and visualizes them in an interactive dashboard.

---
📂 Data

- Tested using sample and personal invoice PDFs
- Invoices contained varied layouts, vendors, and formats
- Dataset not publicly shared due to privacy concerns

---

## 🚀 Features
✅ Upload invoices (image or PDF)  
✅ Automatic text extraction using OCR  
✅ Smart field detection (Date, Vendor, Amount, Tax)  
✅ Expense categorization using keyword intelligence  
✅ Real-time visualization (Pie chart of spending by category)  
✅ Persistent storage with SQLite database  
✅ Simple, responsive React frontend  

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Axios, Chart.js |
| **Backend** | Flask, Python |
| **AI / NLP** | Tesseract OCR, spaCy |
| **Database** | SQLite |
| **Visualization** | Chart.js / React-ChartJS-2 |
| **Deployment (optional)** | Render (backend) + Vercel (frontend) |

---

## ⚙️ Installation & Setup

### 🖥️ Clone the Repository

git clone https://github.com/YOUR_USERNAME/AI-Invoice-Expense-Tracker.git
cd AI-Invoice-Expense-Tracker

🧩 Backend Setup
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py


Your Flask server should now run at 👉 http://127.0.0.1:5000

💻 Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs at 👉 http://localhost:3000

📂 Folder Structure
invoice-ai-expense-tracker/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── utils.py
│   ├── models/
│   │   ├── ocr_extractor.py
│   │   ├── nlp_parser.py
│   │   ├── classifier.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadInvoice.jsx
│   │   │   ├── Dashboard.jsx
│   │   ├── App.jsx
│
└── requirements.txt

🧾 How It Works

1️⃣ User uploads an invoice image/PDF

2️⃣ Flask backend extracts text using Tesseract OCR

3️⃣ NLP model detects vendor, date, and amount

4️⃣ Categorizer classifies the expense type

5️⃣ Data stored in SQLite database

6️⃣ React dashboard updates with charts and totals

🧠 Example Output

    {

        "status": "success",
  
        "extracted_data":
     {
  
    "date": "05/09/2025",
    
    "vendor": "Amazon",
    
    "amount": "₹1,250.00",
    
    "category": "Office Supplies"
    
     }
  
    }

---

Limitations

- Tested on a limited number of invoices
- Performance depends on OCR quality
- Not optimized for large-scale enterprise use

---
🪄 Acknowledgements

Tesseract OCR

spaCy

Flask

Chart.js


