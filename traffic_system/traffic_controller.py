from .db import get_connection
import time
import threading

class TrafficController:
    def __init__(self):
        self.cycle_time = 60  # seconds for full cycle
        self.green_time_per_direction = 15  # seconds green per direction
        self.is_emergency_active = False
        self.emergency_route = None
        self.scheduler_thread = None
        self.emergency_thread = None

    def calculate_green_time(self, vehicle_count):
        """Calculate green time based on traffic density."""
        if vehicle_count <= 5:
            return 10
        elif vehicle_count <= 15:
            return 20
        else:
            return 30

    def get_traffic_data(self):
        """Get current traffic data for all intersections."""
        conn = get_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT i.intersection_id, i.intersection_name,
                   ir.road_id, r.road_name, ir.direction,
                   COALESCE(td.vehicle_count, 0) as vehicle_count,
                   COALESCE(td.density_level, 'LOW') as density_level
            FROM intersections i
            JOIN intersection_roads ir ON i.intersection_id = ir.intersection_id
            JOIN roads r ON ir.road_id = r.road_id
            LEFT JOIN traffic_data td ON i.intersection_id = td.intersection_id
                AND ir.road_id = td.road_id
            ORDER BY i.intersection_id, ir.direction
        """)

        traffic_data = cur.fetchall()
        conn.close()
        return traffic_data

    def update_signal_logic(self):
        """Update signals based on traffic priority (normal operation)."""
        if self.is_emergency_active:
            return  # Don't update during emergency

        traffic_data = self.get_traffic_data()

        # Group by intersection
        intersections = {}
        for row in traffic_data:
            iid = row['intersection_id']
            if iid not in intersections:
                intersections[iid] = []
            intersections[iid].append(row)

        conn = get_connection()
        cur = conn.cursor()

        # For each intersection, prioritize direction with most traffic
        for intersection_id, roads in intersections.items():
            if not roads:
                continue

            # Sort roads by vehicle count (descending)
            roads_sorted = sorted(roads, key=lambda x: x['vehicle_count'], reverse=True)

            # Set all to RED first
            cur.execute("""
                UPDATE signal_status
                SET signal_color='RED', green_time=0
                WHERE intersection_id=%s
            """, (intersection_id,))

            # Give GREEN to highest traffic direction
            if roads_sorted:
                top_road = roads_sorted[0]
                green_time = self.calculate_green_time(top_road['vehicle_count'])
                cur.execute("""
                    UPDATE signal_status
                    SET signal_color='GREEN', green_time=%s
                    WHERE intersection_id=%s AND road_id=%s
                """, (green_time, intersection_id, top_road['road_id']))

        conn.commit()
        conn.close()

    def create_green_corridor(self, route_path, emergency_type):
        """Create a green corridor along the specified route."""
        self.is_emergency_active = True
        self.emergency_route = route_path

        conn = get_connection()
        cur = conn.cursor()

        # Log the emergency
        cur.execute("""
            INSERT INTO emergency_logs (route_id, emergency_type, status)
            VALUES (%s, %s, 'ACTIVE')
        """, (None, emergency_type))  # route_id can be NULL for dynamic routes

        # Set corridor timing - each intersection gets green for 20 seconds
        corridor_green_time = 20

        # Clear all signals to RED first
        cur.execute("UPDATE signal_status SET signal_color='RED', green_time=0")

        # Set green corridor along the path
        for i, intersection_id in enumerate(route_path):
            # For each intersection in path, set the appropriate direction to GREEN
            # This is simplified - in reality, we'd need to know which direction the vehicle is coming from
            # For now, we'll set all directions at each intersection to GREEN briefly

            cur.execute("""
                UPDATE signal_status
                SET signal_color='GREEN', green_time=%s
                WHERE intersection_id=%s
            """, (corridor_green_time, intersection_id))

            if i < len(route_path) - 1:  # Not the last intersection
                time.sleep(corridor_green_time)  # Wait for vehicle to pass through

                # Reset this intersection back to RED after vehicle passes
                cur.execute("""
                    UPDATE signal_status
                    SET signal_color='RED', green_time=0
                    WHERE intersection_id=%s
                """, (intersection_id,))

        conn.commit()
        conn.close()

        # Start monitoring for corridor completion
        self.emergency_thread = threading.Thread(target=self.monitor_emergency_completion)
        self.emergency_thread.start()

    def monitor_emergency_completion(self):
        """Monitor and complete emergency after corridor is used."""
        # In a real system, this would use GPS tracking or manual clearance
        # For demo, we'll wait a fixed time then clear
        time.sleep(120)  # 2 minutes for demo

        self.clear_emergency()

    def clear_emergency(self):
        """Clear emergency and resume normal operation."""
        self.is_emergency_active = False
        self.emergency_route = None

        conn = get_connection()
        cur = conn.cursor()

        # Update emergency log
        cur.execute("""
            UPDATE emergency_logs
            SET status='CLEARED', cleared_at=NOW()
            WHERE status='ACTIVE'
            ORDER BY created_at DESC LIMIT 1
        """)

        conn.commit()
        conn.close()

        # Resume normal scheduling
        self.start_scheduler()

    def start_scheduler(self):
        """Start the normal traffic scheduling cycle."""
        if self.scheduler_thread and self.scheduler_thread.is_alive():
            return  # Already running

        self.scheduler_thread = threading.Thread(target=self._scheduler_loop, daemon=True)
        self.scheduler_thread.start()

    def _scheduler_loop(self):
        """Main scheduler loop for normal traffic management."""
        while not self.is_emergency_active:
            self.update_signal_logic()
            time.sleep(self.cycle_time)

    def stop_scheduler(self):
        """Stop the scheduler."""
        self.is_emergency_active = True  # This will stop the loop
        if self.scheduler_thread:
            self.scheduler_thread.join(timeout=5)

# Global controller instance
controller = TrafficController()

def update_signal_logic():
    """Legacy function for backward compatibility."""
    return controller.update_signal_logic()

def start_traffic_controller():
    """Initialize and start the traffic controller."""
    controller.start_scheduler()
    return controller
