from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from database import create_table
from utils import save_to_db
from models.ocr_extractor import extract_text_from_image
from models.nlp_parser import extract_fields
from models.classifier import categorize_expense

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize DB
create_table()

@app.route('/')
def home():
    return jsonify({"message": "Invoice OCR Backend Running ✅"})

@app.route('/upload', methods=['POST'])
def upload_invoice():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Step 1: OCR
    text = extract_text_from_image(file_path)

    # Step 2: NLP Extraction
    fields = extract_fields(text)

    # Step 3: Categorization
    category = categorize_expense(fields['vendor'], text)

    # Step 4: Save to DB
    save_to_db(fields['date'], fields['vendor'], fields['amount'], category, text)

    return jsonify({
        "status": "success",
        "extracted_data": {
            "date": fields['date'],
            "vendor": fields['vendor'],
            "amount": fields['amount'],
            "category": category
        }
    })

if __name__ == '__main__':
    app.run(debug=True)
