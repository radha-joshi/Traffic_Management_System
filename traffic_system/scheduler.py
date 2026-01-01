import threading
import time
from .traffic_controller import start_traffic_controller

# Critical Section Lock
lock = threading.Lock()

def wait(seconds):
    """Simulate waiting / sleep time"""
    time.sleep(seconds)

def critical_section(func, *args, **kwargs):
    """
    Simulate entering critical section with locking
    """
    with lock:
        result = func(*args, **kwargs)
    return result

def start_scheduler():
    """Start the traffic scheduling system."""
    controller = start_traffic_controller()
    return controller

def stop_scheduler():
    """Stop the traffic scheduling system."""
    from .traffic_controller import controller
    controller.stop_scheduler()
