create database smart_traffic;
use smart_traffic;

-- Roads Table
CREATE TABLE roads (
    road_id INT AUTO_INCREMENT PRIMARY KEY,
    road_name VARCHAR(50) NOT NULL
);

-- Intersections Table (representing traffic lights at intersections)
CREATE TABLE intersections (
    intersection_id INT AUTO_INCREMENT PRIMARY KEY,
    intersection_name VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Intersection-Road relationships (which roads meet at each intersection)
CREATE TABLE intersection_roads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intersection_id INT,
    road_id INT,
    direction VARCHAR(20), -- 'north', 'south', 'east', 'west'
    FOREIGN KEY (intersection_id) REFERENCES intersections(intersection_id),
    FOREIGN KEY (road_id) REFERENCES roads(road_id)
);

-- Traffic Data Table
CREATE TABLE traffic_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intersection_id INT,
    road_id INT,
    vehicle_count INT,
    density_level VARCHAR(20),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intersection_id) REFERENCES intersections(intersection_id),
    FOREIGN KEY (road_id) REFERENCES roads(road_id)
);

-- Signal Status Table (one per intersection-road combination)
CREATE TABLE signal_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intersection_id INT,
    road_id INT,
    signal_color VARCHAR(10) DEFAULT 'RED',
    green_time INT DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intersection_id) REFERENCES intersections(intersection_id),
    FOREIGN KEY (road_id) REFERENCES roads(road_id),
    UNIQUE KEY unique_signal (intersection_id, road_id)
);

-- Emergency Routes (predefined paths for emergency vehicles)
CREATE TABLE emergency_routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    start_intersection_id INT,
    end_intersection_id INT,
    path_order JSON, -- Array of intersection_ids in order
    FOREIGN KEY (start_intersection_id) REFERENCES intersections(intersection_id),
    FOREIGN KEY (end_intersection_id) REFERENCES intersections(end_intersection_id)
);

-- Emergency Logs
CREATE TABLE emergency_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT,
    emergency_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    cleared_at DATETIME NULL,
    FOREIGN KEY (route_id) REFERENCES emergency_routes(route_id)
);

-- Insert sample data
-- Roads
INSERT INTO roads (road_name) VALUES
('Main Street North'), ('Main Street South'), ('Elm Avenue East'), ('Elm Avenue West'),
('Oak Street North'), ('Oak Street South'), ('Pine Avenue East'), ('Pine Avenue West');

-- Intersections (4-way intersections)
INSERT INTO intersections (intersection_name, latitude, longitude) VALUES
('Downtown Center', 40.7128, -74.0060),
('North District', 40.7589, -73.9851),
('East District', 40.7505, -73.9934),
('South District', 40.7282, -74.0776),
('West District', 40.7831, -73.9712);

-- Intersection-Road relationships
-- Downtown Center (intersection 1)
INSERT INTO intersection_roads (intersection_id, road_id, direction) VALUES
(1, 1, 'north'), (1, 2, 'south'), (1, 3, 'east'), (1, 4, 'west');

-- North District (intersection 2)
INSERT INTO intersection_roads (intersection_id, road_id, direction) VALUES
(2, 1, 'south'), (2, 5, 'north'), (2, 7, 'east'), (2, 8, 'west');

-- East District (intersection 3)
INSERT INTO intersection_roads (intersection_id, road_id, direction) VALUES
(3, 5, 'south'), (3, 6, 'north'), (3, 3, 'west'), (3, 7, 'east');

-- South District (intersection 4)
INSERT INTO intersection_roads (intersection_id, road_id, direction) VALUES
(4, 2, 'north'), (4, 6, 'south'), (4, 3, 'east'), (4, 4, 'west');

-- West District (intersection 5)
INSERT INTO intersection_roads (intersection_id, road_id, direction) VALUES
(5, 1, 'east'), (5, 2, 'west'), (5, 7, 'south'), (5, 8, 'north');

-- Initialize signal status for all intersection-road combinations
INSERT INTO signal_status (intersection_id, road_id, signal_color, green_time)
SELECT ir.intersection_id, ir.road_id, 'RED', 0
FROM intersection_roads ir;

-- Sample emergency routes
INSERT INTO emergency_routes (route_name, start_intersection_id, end_intersection_id, path_order) VALUES
('Hospital Route 1', 1, 2, '[1, 2]'),
('Fire Station Route', 1, 3, '[1, 3]'),
('Police Route', 4, 5, '[4, 1, 5]');
