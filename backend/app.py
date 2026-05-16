from flask import Flask, request, jsonify
import os
from ocr_utils import extract_text_from_image, parse_invoice_fields

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
