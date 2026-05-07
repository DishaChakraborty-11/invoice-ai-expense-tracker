const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database setup
const db = new sqlite3.Database('expenses.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    vendor TEXT,
    amount REAL,
    tax REAL,
    total REAL,
    category TEXT,
    image_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Categories mapping
const CATEGORIES = {
  'restaurant': ['restaurant', 'food', 'dining', 'cafe', 'bar', 'pizza', 'sushi'],
  'grocery': ['grocery', 'supermarket', 'food store', 'market'],
  'transport': ['gas', 'fuel', 'uber', 'taxi', 'bus', 'train'],
  'utilities': ['electricity', 'water', 'internet', 'phone'],
  'shopping': ['amazon', 'walmart', 'target', 'clothing', 'electronics'],
  'office': ['office', 'stationery', 'supplies'],
  'other': []
};

// OCR Processing
async function processInvoice(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });

    // Extract fields using regex patterns
    const extracted = {
      date: extractDate(text),
      vendor: extractVendor(text),
      amount: extractAmount(text),
      tax: extractTax(text),
      total: extractTotal(text)
    };

    // Categorize expense
    extracted.category = categorizeExpense(extracted.vendor, text);

    return { ...extracted, success: true, rawText: text };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper functions
function extractDate(text) {
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g,
    /\b(\w+day)\s+(\d{1,2}),\s+(\d{4})\b/g
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return 'Unknown';
}

function extractVendor(text) {
  const lines = text.split('\n');
  for (const line of lines) {
    const cleanLine = line.trim().replace(/[\d$\.,]/g, '');
    if (cleanLine.length > 3 && cleanLine.length < 30) {
      return cleanLine;
    }
  }
  return 'Unknown Vendor';
}

function extractAmount(text) {
  const amountMatch = text.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
  return amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) || 0 : 0;
}

function extractTax(text) {
  const taxMatch = text.match(/(tax|vat|tst)[\s:]*\$?(\d+\.?\d*)/i);
  return taxMatch ? parseFloat(taxMatch[2]) || 0 : 0;
}

function extractTotal(text) {
  const totalMatch = text.match(/(total|balance due)[\s:]*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
  return totalMatch ? parseFloat(totalMatch[2].replace(/,/g, '')) || 0 : 0;
}

function categorizeExpense(vendor, text) {
  const lowerText = (vendor + ' ' + text).toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  return 'other';
}

// Routes
app.post('/api/upload', upload.single('invoice'), async (req, res) => {
  try {
    const result = await processInvoice(req.file.path);
    if (result.success) {
      // Save to database
      const stmt = db.prepare(`INSERT INTO expenses 
        (date, vendor, amount, tax, total, category, image_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`);
      
      stmt.run([
        result.date,
        result.vendor,
        result.amount,
        result.tax,
        result.total,
        result.category,
        req.file.path
      ], function(err) {
        if (err) throw err;
        res.json({ ...result, id: this.lastID });
      });
      stmt.finalize();
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/expenses', (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/stats', (req, res) => {
  db.all(`
    SELECT category, SUM(total) as total_spent, COUNT(*) as count 
    FROM expenses 
    GROUP BY category
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
