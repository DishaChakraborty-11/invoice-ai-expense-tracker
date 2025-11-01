from database import get_connection

def save_to_db(date, vendor, amount, category, raw_text):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO expenses (date, vendor, amount, category, raw_text)
        VALUES (?, ?, ?, ?, ?)
    """, (date, vendor, amount, category, raw_text))
    conn.commit()
    conn.close()
