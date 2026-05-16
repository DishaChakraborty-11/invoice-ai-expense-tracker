import pytesseract
from PIL import Image
import re

# Tell pytesseract where tesseract is (needed on Render)
pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"


def extract_text_from_image(image_path):
    """Run OCR on image and return raw text"""
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    return text


def parse_invoice_fields(text):
    """
    Very simple rule-based NLP to extract:
    Vendor, Date, Amount
    You can improve this later with regex/transformers
    """

    # Amount detection
    amount_match = re.search(r'(\₹|\$)?\s?\d+[.,]?\d*', text)
    amount = amount_match.group() if amount_match else "Not Found"

    # Date detection
    date_match = re.search(r'\d{2}[/-]\d{2}[/-]\d{4}', text)
    date = date_match.group() if date_match else "Not Found"

    # Vendor guess = first line
    lines = text.split("\n")
    vendor = lines[0] if lines else "Unknown Vendor"

    return {
        "vendor": vendor.strip(),
        "date": date,
        "amount": amount
    }
