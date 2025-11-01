import sqlite3

DB_NAME = "expenses.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    return conn

def create_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            vendor TEXT,
            amount REAL,
            category TEXT,
            raw_text TEXT
        )
    """)
    conn.commit()
    conn.close()
