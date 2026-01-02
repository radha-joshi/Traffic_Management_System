# Smart Traffic Management System - Green Corridor

## Project Purpose

In emergency situations, every second counts. First responder vehicles—ambulances, fire trucks, and police cars—often face significant delays due to traffic congestion, which can be the difference between life and death. The Smart Traffic Management System addresses this critical issue by creating "Green Corridors" for emergency vehicles.

A Green Corridor is a dynamically cleared path through traffic where traffic signals are automatically set to green along the vehicle's route, allowing emergency responders to reach their destination as quickly as possible without getting stuck in traffic. This system ensures that emergency services can operate at maximum efficiency, potentially saving lives and reducing response times.

The system combines real-time traffic monitoring, intelligent signal control, and emergency routing algorithms to create these priority corridors on-demand, while maintaining safety and minimizing disruption to regular traffic flow.

## Features

- **Real-time Traffic Monitoring**: Track vehicle counts at intersections
- **Dynamic Signal Control**: Automatically adjust traffic lights based on traffic density
- **Green Corridor System**: Create priority routes for emergency vehicles
- **Web-based Dashboard**: Monitor and control the system through a modern web interface
- **Emergency Vehicle Priority**: Automatically clear paths for ambulances, fire trucks, and police vehicles

## System Architecture

### Step 1: Data Foundation

- **Database**: MySQL database with tables for intersections, roads, traffic data, and signal status
- **Schema**: Comprehensive schema supporting multiple intersections and emergency routes

### Step 2: Core Components

- **traffic_controller.py**: Manages signal timing and green corridor creation
- **emergency_handler.py**: Handles emergency vehicle routing and corridor activation
- **scheduler.py**: Manages normal traffic flow cycles
- **db.py**: Database connection and utility functions

### Step 3: Web Interface

- **server.py**: Pure Python HTTP server with REST API (no Flask)
- **frontend/**: React-based modern web dashboard built with TypeScript for monitoring and control

### Step 4: Green Corridor Logic

The system creates green corridors by:

1. Receiving emergency dispatch requests
2. Calculating optimal routes between intersections
3. Setting traffic signals to green along the route
4. Timing the corridor to allow vehicle passage
5. Automatically reverting to normal operation

## Quick Start

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Traffic_Management_System
   ```

2. **Run the setup script**:

   ```bash
   ./setup.sh
   ```

   This will:

   - Create a Python virtual environment
   - Install Python dependencies (MySQL connector only)
   - Set up the MySQL database
   - Build the React frontend
   - Run validation tests

3. **Start the system**:

   ```bash
   source .venv/bin/activate
   python server.py
   ```

4. **Access the dashboard**:
   Open `http://localhost:5000` in your browser.

## Docker Deployment

For easier deployment and development, use Docker:

### Prerequisites for Docker

- Docker and Docker Compose installed
- Node.js 14+ and npm (for building the frontend)

### Docker Quick Start

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Traffic_Management_System
   ```

2. **Build the React frontend**:

   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

3. **Start the system with Docker Compose**:

   ```bash
   docker-compose up --build
   ```

   This will:

   - Start a MySQL database container
   - Initialize the database with the schema
   - Build and start the Python application container
   - Make the application available at `http://localhost:5000`

4. **Access the dashboard**:
   Open `http://localhost:5000` in your browser.

### Docker Commands

- **Start in background**: `docker-compose up -d`
- **Stop the system**: `docker-compose down`
- **View logs**: `docker-compose logs -f`
- **Rebuild after code changes**: `docker-compose up --build`

The MySQL data is persisted in a Docker volume, so your data will survive container restarts.

## Prerequisites

- Python 3.8+ (with standard library - no additional frameworks)
- MySQL Server
- Node.js 14+ and npm
- TypeScript (for frontend development)
- Docker and Docker Compose (for containerized deployment)

## Local Development Setup

If you prefer manual setup without Docker:

1. **Create Python virtual environment**:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Setup database**:

   ```bash
   mysql -u root -p < traffic_sys.sql
   ```

3. **Build React frontend**:

   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Configure database connection**:
   Edit `traffic_system/db.py` with your MySQL credentials if different from defaults.

5. **Run the server**:
   ```bash
   python server.py
   ```

## API Endpoints

### Traffic Management

- `GET /signal/status` - Get current signal status for all intersections
- `POST /traffic/update` - Update vehicle count at an intersection
- `GET /intersections` - Get intersection data
- `GET /emergency/routes` - Get predefined emergency routes

### Emergency Management

- `POST /emergency/trigger` - Create green corridor for emergency vehicle
- `POST /emergency/clear` - Clear active emergency and resume normal operation
- `GET /emergency/status` - Check current emergency status

## Usage

### Normal Operation

The system automatically cycles traffic signals based on vehicle density at each intersection.

### Emergency Response

1. Select start and end intersections from the dropdown
2. Choose emergency vehicle type
3. Click "Create Green Corridor"
4. The system will:
   - Set signals to green along the route
   - Time the corridor for vehicle passage
   - Automatically clear after completion

### Manual Traffic Updates

Update vehicle counts at any intersection to adjust signal timing dynamically.

## Configuration

### Database Schema

The system uses a MySQL database with the following key tables:

- `intersections`: Traffic intersections with GPS coordinates
- `roads`: Road segments connecting intersections
- `signal_status`: Current signal states for each intersection-road combination
- `traffic_data`: Real-time vehicle count data
- `emergency_routes`: Predefined routes for emergency vehicles
- `emergency_logs`: History of emergency activations

### Signal Timing

- Normal cycle: 60 seconds
- Green time per direction: 10-30 seconds (based on traffic)
- Emergency corridor: 20 seconds per intersection

## Security Features

- Emergency override logging
- Authorized access controls (configurable)
- Audit trail for all emergency activations
- Protection against unauthorized signal manipulation

## Future Enhancements

- GPS integration for real-time vehicle tracking
- Machine learning for traffic prediction
- Mobile app for emergency dispatch
- Integration with city-wide traffic systems
- Advanced pathfinding algorithms

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions, please create an issue in the GitHub repository.
