from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
import sqlite3
import os

pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

app = Flask(__name__)

def extract_text(image_path):
    img = Image.open(image_path)
    return pytesseract.image_to_string(img)

@app.route("/upload", methods=["POST"])
def upload_invoice():
    file = request.files["file"]
    filepath = os.path.join("temp.png")
    file.save(filepath)

    text = extract_text(filepath)

    # Dummy parsing (replace with your NLP logic)
    data = {
        "vendor": "Detected Vendor",
        "amount": "Detected Amount",
        "raw_text": text[:200]
    }

    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
