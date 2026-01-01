from .db import get_connection

def handle_emergency(road_id, emergency_type):
    conn = get_connection()
    cur = conn.cursor()

    # Log Emergency
    cur.execute("""
        INSERT INTO emergency_logs (road_id, emergency_type, status)
        VALUES (%s,%s,'ACTIVE')
    """, (road_id, emergency_type))

    # Give GREEN immediately
    cur.execute("UPDATE signal_status SET signal_color='RED', green_time=0")
    cur.execute("""
        REPLACE INTO signal_status(road_id, signal_color, green_time)
        VALUES (%s,'GREEN',40)
    """, (road_id,))

    conn.commit()
    conn.close()

def clear_emergency(road_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE emergency_logs SET status='CLEARED' WHERE road_id=%s
    """, (road_id,))

    conn.commit()
    conn.close()
