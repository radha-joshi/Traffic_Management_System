#!/usr/bin/env python3
"""
Corrected Server for Render Deployment
"""
import http.server
import socketserver
import json
import os
import threading
from traffic_system.db import get_connection, get_intersections, get_emergency_routes
from traffic_system.traffic_controller import start_traffic_controller
from traffic_system.emergency_handler import handle_emergency, clear_emergency, get_emergency_status

# Global controller variable
traffic_controller = None

class TrafficRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_cors_headers()
        if self.path.startswith('/api/'):
            api_path = self.path[4:]
            if api_path == 'signal/status': self.handle_signal_status()
            elif api_path == 'intersections': self.handle_intersections()
            elif api_path == 'emergency/routes': self.handle_emergency_routes()
            elif api_path == 'emergency/status': self.handle_emergency_status()
            else: self.send_error(404, "API endpoint not found")
        else:
            self.serve_static_file()

    def serve_static_file(self):
        path = self.path.split('?')[0]
        if path == '/': path = '/index.html'
        file_path = os.path.join('frontend', 'build', path.lstrip('/'))
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            ext = os.path.splitext(file_path)[1]
            content_type = {
                '.html': 'text/html', '.js': 'application/javascript',
                '.css': 'text/css', '.json': 'application/json',
                '.png': 'image/png', '.jpg': 'image/jpeg'
            }.get(ext, 'application/octet-stream')
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.end_headers()
            with open(file_path, 'rb') as f: self.wfile.write(f.read())
        else:
            index_path = os.path.join('frontend', 'build', 'index.html')
            if os.path.exists(index_path):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                with open(index_path, 'rb') as f: self.wfile.write(f.read())
            else:
                self.send_error(404, "File not found")

    def do_POST(self):
        self.send_cors_headers()
        if self.path.startswith('/api/'):
            api_path = self.path[4:]
            if api_path == 'traffic/update': self.handle_traffic_update()
            elif api_path == 'emergency/trigger': self.handle_emergency_trigger()
            elif api_path == 'emergency/clear': self.handle_emergency_clear()
            else: self.send_error(404, "API endpoint not found")
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_cors_headers()
        self.end_headers()

    def send_cors_headers(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')

    # --- Handlers ---
    def handle_signal_status(self):
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT ss.*, i.intersection_name, r.road_name, ir.direction
                FROM signal_status ss
                JOIN intersections i ON ss.intersection_id = i.intersection_id
                JOIN roads r ON ss.road_id = r.road_id
                JOIN intersection_roads ir ON ss.intersection_id = ir.intersection_id AND ss.road_id = ir.road_id
            """)
            data = [dict(row) for row in cursor.fetchall()]
            conn.close()
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_intersections(self):
        try:
            self.end_headers()
            self.wfile.write(json.dumps(get_intersections()).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_routes(self):
        try:
            self.end_headers()
            self.wfile.write(json.dumps(get_emergency_routes()).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_status(self):
        try:
            self.end_headers()
            self.wfile.write(json.dumps({"active_emergency": get_emergency_status()}).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_traffic_update(self):
        try:
            length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(length).decode())
            conn = get_connection()
            conn.execute("INSERT INTO traffic_data (intersection_id, road_id, vehicle_count) VALUES (?, ?, ?)",
                         (data.get("intersection_id"), data.get("road_id"), data.get("vehicle_count")))
            conn.commit()
            conn.close()
            if traffic_controller: traffic_controller.update_signal_logic()
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_trigger(self):
        try:
            length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(length).decode())
            result = handle_emergency(data.get("start_intersection"), data.get("end_intersection"), data.get("emergency_type"))
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_emergency_clear(self):
        try:
            self.end_headers()
            self.wfile.write(json.dumps(clear_emergency()).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def log_message(self, format, *args):
        return # Silence logs

def run_server():
    # --- CRITICAL FIX: Use Render's PORT ---
    port = int(os.environ.get("PORT", 5000))
    
    # Ensure we listen on 0.0.0.0 (all interfaces)
    server_address = ("0.0.0.0", port)
    
    with socketserver.TCPServer(server_address, TrafficRequestHandler) as httpd:
        print(f"🚦 Server running on port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    # 1. Initialize DB if missing
    if not os.path.exists('traffic.db'):
        print("Initializing Database...")
        from init_db import init_db
        init_db()

    # 2. Start Controller (Non-blocking)
    print("Starting Traffic Controller...")
    traffic_controller = start_traffic_controller()

    # 3. Run Server
    run_server()