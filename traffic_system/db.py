import mysql.connector
import json

def get_connection():
    """Return a new MySQL connection. Configure via environment or edit defaults."""
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Computer@12",
        database="smart_traffic"
    )

def get_intersections():
    """Get all intersections with their connected roads."""
    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT i.*, GROUP_CONCAT(ir.road_id) as road_ids,
               GROUP_CONCAT(r.road_name) as road_names,
               GROUP_CONCAT(ir.direction) as directions
        FROM intersections i
        JOIN intersection_roads ir ON i.intersection_id = ir.intersection_id
        JOIN roads r ON ir.road_id = r.road_id
        GROUP BY i.intersection_id
    """)

    intersections = cur.fetchall()
    conn.close()

    # Parse the grouped data
    for intersection in intersections:
        intersection['road_ids'] = intersection['road_ids'].split(',') if intersection['road_ids'] else []
        intersection['road_names'] = intersection['road_names'].split(',') if intersection['road_names'] else []
        intersection['directions'] = intersection['directions'].split(',') if intersection['directions'] else []

    return intersections

def get_emergency_routes():
    """Get all predefined emergency routes."""
    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT * FROM emergency_routes")
    routes = cur.fetchall()

    conn.close()

    # Parse JSON path_order
    for route in routes:
        route['path_order'] = json.loads(route['path_order'])

    return routes
