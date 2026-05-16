from flask import Flask, request, jsonify
import os
from ocr_utils import extract_text_from_image, parse_invoice_fields

app = Flask(__name__)

@app.route("/")
def home():
    return "Invoice AI Backend is running!"

@app.route("/upload", methods=["POST"])
def upload_invoice():
    file = request.files["file"]
    filepath = "temp.png"
    file.save(filepath)

    text = extract_text_from_image(filepath)
    fields = parse_invoice_fields(text)

    return jsonify({
        "vendor": fields["vendor"],
        "date": fields["date"],
        "amount": fields["amount"],
        "raw_text": text[:300]
    })

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
