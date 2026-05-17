from flask import Flask, request, jsonify
from flask_cors import CORS
import os
# Added the dot (.) so Vercel finds the file inside the api/ directory
from .ocr_utils import extract_text_from_image, parse_invoice_fields

app = Flask(__name__)
CORS(app) # Allows your v0 frontend to connect safely

@app.route("/upload", methods=["POST"])
def upload_invoice():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files["file"]
    
    # CRUCIAL FIX: Saved to the /tmp folder because Vercel's main filesystem is read-only
    filepath = os.path.join("/tmp", "temp.png")
    file.save(filepath)

    try:
        text = extract_text_from_image(filepath)
        fields = parse_invoice_fields(text)

        # Clean up the file after processing
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({
            "vendor": fields.get("vendor", "Unknown"),
            "date": fields.get("date", "Unknown"),
            "amount": fields.get("amount", "Unknown"),
            "raw_text": text[:300]
        })
        
    except Exception as e:
        # Make sure we clean up the file even if the OCR fails
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": str(e)}), 500

# Vercel needs this stripped out or it confuses the serverless handler
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)
