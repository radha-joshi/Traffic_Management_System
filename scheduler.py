"""Compatibility shim for moved scheduler module."""

from traffic_system.scheduler import wait, critical_section

__all__ = ["wait", "critical_section"]
