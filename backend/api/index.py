from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Added this import
import os
from ocr_utils import extract_text_from_image, parse_invoice_fields

app = Flask(__name__)
CORS(app)  # <-- Added this line to allow your AI frontend to connect!

@app.route("/upload", methods=["POST"])
def upload_invoice():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files["file"]
    filepath = "temp.png"
    file.save(filepath)

    text = extract_text_from_image(filepath)
    fields = parse_invoice_fields(text)

    # Clean up the file after processing
    if os.path.exists(filepath):
        os.path.remove(filepath)

    return jsonify({
        "vendor": fields.get("vendor", "Unknown"),
        "date": fields.get("date", "Unknown"),
        "amount": fields.get("amount", "Unknown"),
        "raw_text": text[:300]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
