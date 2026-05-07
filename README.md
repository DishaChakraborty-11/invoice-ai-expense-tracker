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

## Screenshots
<img width="1424" height="836" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/28dd8e7f-8e00-4e23-9a87-9db401f8320e" />
<img width="1444" height="843" alt="Screenshot (7)" src="https://github.com/user-attachments/assets/a53d4d01-6f2b-48af-8fa2-601a1e60b2a1" />
<img width="1434" height="822" alt="Screenshot (8)" src="https://github.com/user-attachments/assets/ad505d95-2e0b-4d91-bb59-b6bdecb2f8c3" />
<img width="1434" height="833" alt="Screenshot (9)" src="https://github.com/user-attachments/assets/3978c2f9-6a8c-4a9c-bc90-62cc79bf0e5d" />
<img width="1428" height="851" alt="Screenshot (10)" src="https://github.com/user-attachments/assets/a7fed420-b9c0-4b47-ac2f-cf84dbf596ea" />
<img width="1424" height="838" alt="Screenshot (11)" src="https://github.com/user-attachments/assets/ef64d275-70da-4243-a321-36ede12848e6" />
<img width="1425" height="839" alt="Screenshot (12)" src="https://github.com/user-attachments/assets/3ece205b-980b-4972-8310-bc9717978d93" />
<img width="1433" height="844" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/1d20286e-c051-47d0-b918-2dcd8db7dd0f" />

---

🪄 Acknowledgements

Tesseract OCR

spaCy

Flask

Chart.js


