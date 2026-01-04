#!/usr/bin/env python3
"""
Simple HTTP Server for Traffic Management System
No Flask dependency - pure Python standard library
"""

import http.server
import socketserver
import json
import urllib.parse
import mysql.connector
import os
from traffic_system.db import get_connection, get_intersections, get_emergency_routes
from traffic_system.traffic_controller import controller, start_traffic_controller
from traffic_system.emergency_handler import handle_emergency, clear_emergency, get_emergency_status, handle_emergency_legacy, clear_emergency_legacy

# Initialize traffic controller
traffic_controller = start_traffic_controller()

class TrafficRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        self.send_cors_headers()

        if self.path.startswith('/api/'):
            # API endpoints
            api_path = self.path[4:]  # Remove /api/ prefix
            if api_path == 'signal/status':
                self.handle_signal_status()
            elif api_path == 'intersections':
                self.handle_intersections()
            elif api_path == 'emergency/routes':
                self.handle_emergency_routes()
            elif api_path == 'emergency/status':
                self.handle_emergency_status()
            else:
                self.send_error(404, "API endpoint not found")
        else:
            # Serve static files from frontend/build
            self.serve_static_file()

    def serve_static_file(self):
        """Serve static files from frontend/build directory"""
        # Remove query parameters
        path = self.path.split('?')[0]
        
        # Default to index.html for root path
        if path == '/':
            path = '/index.html'
        
        # Build the file path
        file_path = os.path.join('frontend', 'build', path.lstrip('/'))
        
        # Check if file exists
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # Determine content type
            if path.endswith('.html'):
                content_type = 'text/html'
            elif path.endswith('.js'):
                content_type = 'application/javascript'
            elif path.endswith('.css'):
                content_type = 'text/css'
            elif path.endswith('.json'):
                content_type = 'application/json'
            elif path.endswith('.png'):
                content_type = 'image/png'
            elif path.endswith('.jpg') or path.endswith('.jpeg'):
                content_type = 'image/jpeg'
            else:
                content_type = 'application/octet-stream'
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.end_headers()
            
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            # Serve index.html for SPA routing
            index_path = os.path.join('frontend', 'build', 'index.html')
            if os.path.exists(index_path):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                with open(index_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "File not found")

    def do_POST(self):
        """Handle POST requests"""
        self.send_cors_headers()

        if self.path.startswith('/api/'):
            api_path = self.path[4:]  # Remove /api/ prefix
            if api_path == 'traffic/update':
                self.handle_traffic_update()
            elif api_path == 'emergency/trigger':
                self.handle_emergency_trigger()
            elif api_path == 'emergency/clear':
                self.handle_emergency_clear()
            else:
                self.send_error(404, "API endpoint not found")
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_cors_headers()
        self.end_headers()

    def send_cors_headers(self):
        """Send CORS headers"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')

    def handle_signal_status(self):
        """Get current signal status"""
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT ss.*, i.intersection_name, r.road_name, ir.direction
                FROM signal_status ss
                JOIN intersections i ON ss.intersection_id = i.intersection_id
                JOIN roads r ON ss.road_id = r.road_id
                JOIN intersection_roads ir ON ss.intersection_id = ir.intersection_id AND ss.road_id = ir.road_id
                ORDER BY ss.intersection_id, ss.road_id
            """)
            data = cursor.fetchall()
            cursor.close()
            conn.close()

            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_intersections(self):
        """Get intersections data"""
        try:
            intersections = get_intersections()
            self.end_headers()
            self.wfile.write(json.dumps(intersections).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_routes(self):
        """Get emergency routes"""
        try:
            routes = get_emergency_routes()
            self.end_headers()
            self.wfile.write(json.dumps(routes).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_status(self):
        """Get emergency status"""
        try:
            status = get_emergency_status()
            self.end_headers()
            self.wfile.write(json.dumps({"active_emergency": status}).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_traffic_update(self):
        """Update traffic data"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())

            intersection_id = data.get("intersection_id")
            road_id = data.get("road_id")
            vehicle_count = data.get("vehicle_count")

            if not all([intersection_id, road_id, vehicle_count is not None]):
                self.send_error(400, "intersection_id, road_id, and vehicle_count required")
                return

            # Update traffic_data table
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO traffic_data (intersection_id, road_id, vehicle_count)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE vehicle_count=%s
            """, (intersection_id, road_id, vehicle_count, vehicle_count))
            conn.commit()
            cursor.close()
            conn.close()

            # Update signal logic
            controller.update_signal_logic()

            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_trigger(self):
        """Trigger emergency"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())

            start_intersection = data.get("start_intersection")
            end_intersection = data.get("end_intersection")
            emergency_type = data.get("emergency_type", "Emergency Vehicle")

            if not start_intersection or not end_intersection:
                self.send_error(400, "start_intersection and end_intersection required")
                return

            result = handle_emergency(start_intersection, end_intersection, emergency_type)

            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_clear(self):
        """Clear emergency"""
        try:
            result = clear_emergency()
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def log_message(self, format, *args):
        """Override to reduce log noise"""
        return

def run_server(port=5000):
    """Run the HTTP server"""
    with socketserver.TCPServer(("0.0.0.0", port), TrafficRequestHandler) as httpd:
        print(f"🚦 Traffic Management Server running on port {port}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()