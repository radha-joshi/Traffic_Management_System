#!/usr/bin/env python3
"""
Test script for the Traffic Management System
Validates core functionality without requiring database connection
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all modules can be imported"""
    try:
        from traffic_system.db import get_connection
        from traffic_system.traffic_controller import TrafficController
        from traffic_system.emergency_handler import handle_emergency, clear_emergency
        from traffic_system.scheduler import start_scheduler
        print("✓ All imports successful")
        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False

def test_traffic_controller():
    """Test traffic controller initialization"""
    try:
        from traffic_system.traffic_controller import TrafficController
        controller = TrafficController()
        assert controller.cycle_time == 60
        assert controller.green_time_per_direction == 15
        assert not controller.is_emergency_active
        print("✓ Traffic controller initialization successful")
        return True
    except Exception as e:
        print(f"✗ Traffic controller test failed: {e}")
        return False

def test_emergency_handler():
    """Test emergency handler functions exist"""
    try:
        from traffic_system.emergency_handler import handle_emergency, clear_emergency
        # Just check functions exist, don't call them without DB
        assert callable(handle_emergency)
        assert callable(clear_emergency)
        print("✓ Emergency handler functions available")
        return True
    except Exception as e:
        print(f"✗ Emergency handler test failed: {e}")
        return False

def test_app_routes():
    """Test that server can be imported"""
    try:
        import server
        assert server is not None
        print("✓ HTTP server module available")
        return True
    except Exception as e:
        print(f"✗ HTTP server test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Running Traffic Management System Tests...")
    print("=" * 50)

    tests = [
        test_imports,
        test_traffic_controller,
        test_emergency_handler,
        test_app_routes
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        if test():
            passed += 1
        print()

    print("=" * 50)
    print(f"Tests passed: {passed}/{total}")

    if passed == total:
        print("🎉 All tests passed! System is ready.")
        return 0
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())