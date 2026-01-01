from db import get_connection

def calculate_green_time(vehicle_count):
    if vehicle_count <= 5:
        return 10
    elif vehicle_count <= 15:
        return 20
    else:
        return 30

def update_signal_logic():
    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT r.road_id, r.road_name, IFNULL(t.vehicle_count,0) as vehicle_count 
        FROM roads r 
        LEFT JOIN traffic_data t ON r.road_id = t.road_id 
        ORDER BY t.timestamp DESC
    """)
    roads = cur.fetchall()

    # Sort roads by vehicle_count descending
    roads_sorted = sorted(roads, key=lambda x: x['vehicle_count'], reverse=True)

    # Everyone Red first
    cur.execute("UPDATE signal_status SET signal_color='RED', green_time=0")

    # Give GREEN to highest traffic road
    if roads_sorted:
        top = roads_sorted[0]
        green = calculate_green_time(top['vehicle_count'])
        cur.execute("""
            REPLACE INTO signal_status(road_id, signal_color, green_time)
            VALUES (%s,'GREEN',%s)
        """, (top['road_id'], green))

    conn.commit()
    conn.close()

    return roads_sorted
