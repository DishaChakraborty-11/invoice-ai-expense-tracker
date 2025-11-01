import re
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_fields(text):
    """
    Extracts vendor, date, and amount from invoice text.
    """
    doc = nlp(text)

    # Extract vendor name (assume first proper noun as vendor)
    vendor = None
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PERSON"]:
            vendor = ent.text
            break

    # Extract date
    date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
    dates = re.findall(date_pattern, text)
    date = dates[0] if dates else None

    # Extract amount
    amount_pattern = r'(\₹?\s?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)'
    amounts = re.findall(amount_pattern, text)
    amount = amounts[-1] if amounts else None

    return {
        "vendor": vendor or "Unknown Vendor",
        "date": date or "Unknown Date",
        "amount": amount or "0.00"
    }
