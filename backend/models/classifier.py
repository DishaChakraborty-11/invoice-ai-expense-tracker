def categorize_expense(vendor, text):
    vendor = vendor.lower() if vendor else ""
    text = text.lower()

    if "uber" in vendor or "ola" in text:
        return "Travel"
    elif "amazon" in vendor or "flipkart" in text:
        return "Office Supplies"
    elif "swiggy" in text or "zomato" in text:
        return "Food"
    elif "google" in vendor or "adobe" in text:
        return "Software/Subscription"
    else:
        return "Miscellaneous"
