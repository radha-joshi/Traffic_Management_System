import mysql.connector

def get_connection():
    """Return a new MySQL connection. Configure via environment or edit defaults."""
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Computer@12",
        database="smart_traffic"
    )
