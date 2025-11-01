import pytesseract
from PIL import Image
import os

def extract_text_from_image(file_path):
    """
    Reads image and returns raw extracted text using Tesseract OCR.
    """
    try:
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        return text
    except Exception as e:
        print("OCR Error:", e)
        return ""
