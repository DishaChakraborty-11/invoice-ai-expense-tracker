import requests
import re
import os

def extract_text_from_image(image_path):
    api_key = os.environ.get("OCR_SPACE_API_KEY", "helloworld")
    url = "https://api.ocr.space/parse/image"
    
    with open(image_path, 'rb') as f:
        payload = {
            'apikey': api_key,
            'language': 'eng',
            'isOverlayRequired': False,
            'FileType': 'PNG'
        }
        files = {'file': f}
        response = requests.post(url, data=payload, files=files)
        result = response.json()
        
    if result.get("OCRExitCode") == 1:
        parsed_results = result.get("ParsedResults", [])
        if parsed_results:
            return parsed_results[0].get("ParsedText", "")
    else:
        error_msg = result.get("ErrorMessage", ["Unknown OCR Error"])
        raise Exception(f"OCR Space API Failed: {error_msg[0]}")
        
    return ""

def parse_invoice_fields(text):
    data = {"vendor": "Unknown Vendor", "date": "Not Found", "amount": "Not Found"}
    if not text:
        return data
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        data["vendor"] = lines[0]
    amount_match = re.search(r'(?:total|amount|due|net|gross)[:\s]*\$?\s*([\d,]+\.\d{2})', text, re.IGNORECASE)
    if amount_match:
        data["amount"] = f"${amount_match.group(1)}"
    date_match = re.search(r'(\b\d{1,2}[/\.-]\d{1,2}[/\.-]\d{2,4}\b)|(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b)', text, re.IGNORECASE)
    if date_match:
        data["date"] = date_match.group(0)
    return data
