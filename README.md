# 🚦 Green Corridor: Smart Traffic Management System

> **GDG Techsprint Submission**

## 🚑 The Problem

In medical emergencies, seconds define the line between life and death. In India, emergency vehicles often face massive delays due to congestion and the inability of static traffic signals to adapt to urgent needs. We asked ourselves: **Why do ambulances have to wait at red lights?**

## 💡 Our Solution

**Green Corridor** is a prototype traffic management system designed to dynamically clear the path for emergency vehicles. By creating a temporary "Green Corridor," the system manipulates traffic signals along a route to ensure zero wait time for ambulances, fire trucks, and police vehicles.

## 🛠️ Tech Stack

We built this from the ground up to understand the core mechanics of web servers and state management:

- **Frontend:** React, TypeScript, Tailwind CSS (for a clean, modern UI).
- **Backend:** Pure Python (Custom HTTP Server) - _We chose not to use frameworks like Flask/Django to challenge ourselves and learn how HTTP requests work at a low level._
- **Database:** MySQL.
- **AI & Visualization:** Google Gemini API (for routing logic) & Google Charts.

## 🌟 Key Features

- **Emergency Trigger:** A manual override system to activate a "Green Corridor" between two points.
- **Live Simulation:** A visual dashboard using **Google Charts** to represent traffic density (Pie Charts) and signal status.
- **Gemini Integration:** Leverages AI to analyze traffic patterns (concept phase).
- **Custom Scheduler:** A Python-based signal timer that mimics real-world traffic cycles.

## ⚠️ Project Status (Hackathon Note)

- **Current State:** MVP / Prototype.
- **Simulation:** Due to the time constraints of the Techsprint, we were unable to fully deploy the Dockerized backend to a live cloud provider (Render/Railway).
- **Demo Mode:** To demonstrate the UI/UX vision effectively, the hosted frontend currently runs on **simulated data**. However, the backend logic (`traffic_controller.py`, `server.py`) included in this repo is fully functional locally and contains the actual logic for signal switching and database management.

## 🚀 How to Run Locally

Since this is a prototype, here is how you can spin it up on your machine:

1.  **Clone the Repo**

    ```bash
    git clone <your-repo-link>
    ```

2.  **Run the Setup Script** (Mac/Linux)

    ```bash
    ./setup.sh
    ```

    _This creates the Python virtual env, installs dependencies, and builds the React frontend._

3.  **Start the Server**

    ```bash
    source .venv/bin/activate
    python server.py
    ```

4.  **View the Dashboard**
    Open `http://localhost:5000` in your browser.

## 🔮 Future Roadmap

If we take this project forward, our next steps are:

1.  **Hardware Integration:** Connecting the Python backend to Arduino/Raspberry Pi controllers for physical traffic lights.
2.  **Computer Vision:** Using camera feeds to detect ambulances automatically instead of manual triggers.
3.  **Google Maps API:** Replacing our current chart visualization with real-time Maps overlay (once we have budget for API billing).

## 👥 Team

- **Kaushik Dubey**
- **Radha Joshi**
- **Ketan Nagpure**
- **Kshitij Bobde**

---

_Built with ❤️ and a lot of coffee for GDG Techsprint._
