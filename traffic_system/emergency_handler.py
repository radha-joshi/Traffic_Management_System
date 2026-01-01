from .db import get_connection, get_emergency_routes
from .traffic_controller import controller
import json

def get_route_path(start_intersection, end_intersection):
    """Find or calculate a path between two intersections."""
    # First check predefined routes
    routes = get_emergency_routes()
    for route in routes:
        if route['start_intersection_id'] == start_intersection and route['end_intersection_id'] == end_intersection:
            return route['path_order']

    # For now, return a simple path (in real system, use pathfinding algorithm)
    # This is a simplified implementation
    return [start_intersection, end_intersection]

def handle_emergency(start_intersection, end_intersection, emergency_type):
    """Handle emergency by creating a green corridor along the route."""
    # Get the path for the emergency vehicle
    route_path = get_route_path(start_intersection, end_intersection)

    if not route_path:
        raise ValueError("No valid route found between intersections")

    # Log the emergency
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO emergency_logs (route_id, emergency_type, status)
        SELECT route_id, %s, 'ACTIVE'
        FROM emergency_routes
        WHERE start_intersection_id = %s AND end_intersection_id = %s
        LIMIT 1
    """, (emergency_type, start_intersection, end_intersection))

    # If no predefined route, still log it
    if cur.rowcount == 0:
        cur.execute("""
            INSERT INTO emergency_logs (emergency_type, status)
            VALUES (%s, 'ACTIVE')
        """, (emergency_type,))

    conn.commit()
    conn.close()

    # Create the green corridor
    controller.create_green_corridor(route_path, emergency_type)

    return {
        "status": "success",
        "route_path": route_path,
        "message": f"Green corridor activated for {emergency_type} from intersection {start_intersection} to {end_intersection}"
    }

def clear_emergency():
    """Clear active emergency and resume normal operation."""
    controller.clear_emergency()

    conn = get_connection()
    cur = conn.cursor()

    # Update the most recent active emergency
    cur.execute("""
        UPDATE emergency_logs
        SET status='CLEARED', cleared_at=NOW()
        WHERE status='ACTIVE'
        ORDER BY created_at DESC LIMIT 1
    """)

    conn.commit()
    conn.close()

    return {"status": "emergency cleared"}

def get_emergency_status():
    """Get current emergency status."""
    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT * FROM emergency_logs
        WHERE status='ACTIVE'
        ORDER BY created_at DESC LIMIT 1
    """)

    active_emergency = cur.fetchone()
    conn.close()

    return active_emergency

# Legacy function for backward compatibility
def handle_emergency_legacy(road_id, emergency_type):
    """Legacy emergency handler for single road."""
    # Map road_id to intersection (simplified)
    intersection_id = road_id  # Assuming road_id maps to intersection_id for now

    return handle_emergency(intersection_id, intersection_id, emergency_type)

def clear_emergency_legacy(road_id):
    """Legacy clear emergency."""
    return clear_emergency()
