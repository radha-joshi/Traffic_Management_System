from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from db import get_connection
from traffic_controller import update_signal_logic
from emergency_handler import handle_emergency, clear_emergency

app = Flask(__name__)

# --------------------------
# Serve Frontend Files
# --------------------------

# Dashboard
@app.route("/")
def serve_dashboard():
    return send_from_directory("../Frontend", "index.html")

# JavaScript
@app.route("/script.js")
def serve_js():
    return send_from_directory("../Frontend", "script.js")

# CSS
@app.route("/style.css")
def serve_css():
    return send_from_directory("../Frontend", "style.css")

# --------------------------
# API Routes
# --------------------------

# Get current signal status
@app.route("/signal/status", methods=["GET"])
def get_signal_status():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM signal_status")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

# Update traffic (vehicle count)
@app.route("/traffic/update", methods=["POST"])
def update_traffic():
    payload = request.get_json()
    road_id = payload.get("road_id")
    vehicle_count = payload.get("vehicle_count")

    # Update traffic_data table
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO traffic_data (road_id, vehicle_count)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE vehicle_count=%s
    """, (road_id, vehicle_count, vehicle_count))
    conn.commit()
    cursor.close()
    conn.close()

    # Update signal logic after traffic change
    update_signal_logic()
    return jsonify({"status": "success"})

# Trigger emergency
@app.route("/emergency/trigger", methods=["POST"])
def trigger_emergency():
    payload = request.get_json()
    road_id = payload.get("road_id")
    emergency_type = payload.get("type")

    handle_emergency(road_id, emergency_type)
    return jsonify({"status": "emergency triggered"})

# Clear emergency
@app.route("/emergency/clear", methods=["POST"])
def clear_emergency_route():
    clear_emergency()
    return jsonify({"status": "emergency cleared"})

# --------------------------
# Run Server
# --------------------------

if __name__ == "__main__":
    app.run(debug=True)
