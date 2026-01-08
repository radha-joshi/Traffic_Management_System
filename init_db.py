import sqlite3

def init_db():
    # Connect to SQLite database (creates file if it doesn't exist)
    conn = sqlite3.connect('traffic.db')
    cur = conn.cursor()

    # Read the SQL file
    with open('traffic_sys.sql', 'r') as f:
        sql_script = f.read()

    # Execute the entire script at once
    try:
        cur.executescript(sql_script)
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.commit()
        conn.close()

if __name__ == "__main__":
    init_db()