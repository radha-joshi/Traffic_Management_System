"""Compatibility shims for moved modules.

These modules have been moved into the `traffic_system` package.
Keep small shims here so existing imports keep working.
"""

from traffic_system.db import get_connection

__all__ = ["get_connection"]
