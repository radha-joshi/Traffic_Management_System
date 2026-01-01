import threading
import time

# Critical Section Lock (OS concept)
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
