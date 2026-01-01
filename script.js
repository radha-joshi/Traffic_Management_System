// Global roads array
let roads = [];

// Fetch road & signal status from backend
function fetchSignalStatus() {
    fetch("/signal/status")
        .then(res => res.json())
        .then(data => {
            roads = data;
            renderDashboard();
        })
        .catch(err => console.error("Error fetching status:", err));
}

// Render dashboard dynamically
function renderDashboard() {
    const container = document.getElementById("roadsContainer");
    container.innerHTML = ""; // clear old

    roads.forEach(road => {
        const roadDiv = document.createElement("div");
        roadDiv.className = "road";

        roadDiv.innerHTML = `
            <h3>${road.name}</h3>
            <p>Traffic Density: ${road.traffic_density}</p>
            <p>Signal: <span style="color:${road.signal_status==='GREEN'?'green':'red'}">${road.signal_status}</span></p>
            <input type="number" id="vehicle_${road.id}" placeholder="Vehicle Count" value="${road.vehicle_count}">
            <button onclick="updateTraffic(${road.id})">Update Traffic</button>
            <button onclick="triggerEmergency(${road.id})">Trigger Emergency</button>
            <button onclick="clearEmergency(${road.id})">Clear Emergency</button>
        `;
        container.appendChild(roadDiv);
    });
}

// Update traffic count
window.updateTraffic = function(roadId) {
    const input = document.getElementById(`vehicle_${roadId}`);
    const count = parseInt(input.value);

    fetch("/traffic/update", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({road_id: roadId, vehicle_count: count})
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        fetchSignalStatus(); // refresh dashboard
    })
    .catch(err => console.error("Error updating traffic:", err));
}

// Trigger emergency
window.triggerEmergency = function(roadId) {
    fetch("/emergency/trigger", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({road_id: roadId, emergency_type: "Ambulance"})
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert(`Emergency triggered for road ID: ${roadId}`);
        fetchSignalStatus();
    })
    .catch(err => console.error("Error triggering emergency:", err));
}

// Clear emergency
window.clearEmergency = function(roadId) {
    fetch("/emergency/clear", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({road_id: roadId})
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert(`Emergency cleared for road ID: ${roadId}`);
        fetchSignalStatus();
    })
    .catch(err => console.error("Error clearing emergency:", err));
}

// Auto-refresh every 5 sec
setInterval(fetchSignalStatus, 5000);

// Initial load
window.onload = fetchSignalStatus;
