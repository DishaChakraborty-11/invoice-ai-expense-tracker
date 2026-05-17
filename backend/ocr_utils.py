import requests
import re

def extract_text_from_image(image_path):
    """
    Uses the Free OCR.space API instead of local Tesseract binary
    so it works flawlessly on Vercel serverless functions.
    """
    # Replace 'DONT_SHARE_THIS_KEY' with the free key they email you
    # Or leave 'helloworld' for testing (it works but has a low limit)
    api_key = 'helloworld' 
    
    url = "https://api.ocr.space/parse/image"
    
    with open(image_path, 'rb') as f:
        payload = {
            'apikey': 'K85418050388957',
            'language': 'eng',
            'isOverlayRequired': False,
            'FileType': 'PNG'
        }
        files = {
            'file': f
        }
        
        response = requests.post(url, data=payload, files=files)
        result = response.json()
        
    if result.get("OCRExitCode") == 1:
        # Successfully extracted text!
        parsed_results = result.get("ParsedResults", [])
        if parsed_results:
            return parsed_results[0].get("ParsedText", "")
    else:
        # Log the error message from the API if it fails
        error_msg = result.get("ErrorMessage", ["Unknown OCR Error"])
        raise Exception(f"OCR Space API Failed: {error_msg[0]}")
        
    return ""

def parse_invoice_fields(text):
    """
    Basic parsing engine to find Vendor, Date, and Amount from the text.
    """
    data = {"vendor": "Unknown Vendor", "date": "Not Found", "amount": "Not Found"}
    if not text:
        return data

    # 1. Try to guess the vendor from the first line of text
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        data["vendor"] = lines[0]

    # 2. Extract Total Amount using Regex (looking for $, Total, Due followed by numbers)
    amount_match = re.search(r'(?:total|amount|due|net|gross)[:\s]*\$?\s*([\d,]+\.\d{2})', text, re.IGNORECASE)
    if amount_match:
        data["amount"] = f"${amount_match.group(1)}"

    # 3. Extract Date using Regex (formats like MM/DD/YYYY, DD-MM-YYYY, or Month DD, YYYY)
    date_match = re.search(r'(\b\d{1,2}[/\.-]\d{1,2}[/\.-]\d{2,4}\b)|(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b)', text, re.IGNORECASE)
    if date_match:
        data["date"] = date_match.group(0)

    return data
