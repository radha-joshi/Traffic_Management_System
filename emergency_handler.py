"""Compatibility shim for moved emergency_handler module."""

from traffic_system.emergency_handler import handle_emergency, clear_emergency

__all__ = ["handle_emergency", "clear_emergency"]
