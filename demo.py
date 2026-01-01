#!/usr/bin/env python3
"""
Demo script to show server capabilities
"""

import json
import sys

def demo_server():
    """Demonstrate server functionality"""
    print("🚦 Traffic Management System Demo")
    print("=" * 40)

    print("This system uses pure Python (no Flask) with:")
    print("  • Python HTTP server (standard library)")
    print("  • MySQL database for data persistence")
    print("  • React frontend for user interface")
    print()

    print("API Endpoints available:")
    print()

    endpoints = [
        ("GET /intersections", "Get all intersections"),
        ("GET /signal/status", "Get current signal status"),
        ("GET /emergency/routes", "Get predefined emergency routes"),
        ("GET /emergency/status", "Check active emergency status"),
        ("POST /traffic/update", "Update vehicle count at intersection"),
        ("POST /emergency/trigger", "Create green corridor"),
        ("POST /emergency/clear", "Clear active emergency"),
    ]

    for endpoint, description in endpoints:
        print(f"  {endpoint:<25} - {description}")

    print()
    print("To run the complete system:")
    print("  1. Start MySQL server")
    print("  2. Run: python server.py")
    print("  3. Open http://localhost:5000 in browser")
    print()
    print("The React frontend will automatically connect")
    print("to provide the full traffic management interface.")

if __name__ == "__main__":
    demo_server()