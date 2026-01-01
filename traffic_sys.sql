create database smart_traffic;
use smart_traffic;
CREATE TABLE roads (
    road_id INT AUTO_INCREMENT PRIMARY KEY,
    road_name VARCHAR(50) NOT NULL
);

-- Traffic Data Table
CREATE TABLE traffic_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    road_id INT,
    vehicle_count INT,
    density_level VARCHAR(20),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (road_id) REFERENCES roads(road_id)
);

-- Signal Status Table
CREATE TABLE signal_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    road_id INT,
    signal_color VARCHAR(10),
    green_time INT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (road_id) REFERENCES roads(road_id)
);

-- Emergency Logs
CREATE TABLE emergency_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    road_id INT,
    emergency_type VARCHAR(50),
    status VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert 4 Roads (4-way intersection)
INSERT INTO roads (road_name)
VALUES ('North Road'), ('South Road'), ('East Road'), ('West Road');
