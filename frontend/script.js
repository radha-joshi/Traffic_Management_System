// Global variables
let intersections = [];
let signalStatus = [];

// Fetch intersections data
function fetchIntersections() {
    fetch("/intersections")
        .then(res => res.json())
        .then(data => {
            intersections = data;
            populateIntersectionSelectors();
            fetchSignalStatus();
        })
        .catch(err => console.error("Error fetching intersections:", err));
}

// Populate intersection selectors
function populateIntersectionSelectors() {
    const startSelect = document.getElementById("startIntersection");
    const endSelect = document.getElementById("endIntersection");

    startSelect.innerHTML = '<option value="">Select Start Intersection</option>';
    endSelect.innerHTML = '<option value="">Select End Intersection</option>';

    intersections.forEach(intersection => {
        const option1 = document.createElement("option");
        option1.value = intersection.intersection_id;
        option1.textContent = intersection.intersection_name;
        startSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = intersection.intersection_id;
        option2.textContent = intersection.intersection_name;
        endSelect.appendChild(option2);
    });
}

// Fetch signal status from backend
function fetchSignalStatus() {
    fetch("/signal/status")
        .then(res => res.json())
        .then(data => {
            signalStatus = data;
            renderDashboard();
        })
        .catch(err => console.error("Error fetching status:", err));
}

// Check emergency status
function checkEmergencyStatus() {
    fetch("/emergency/status")
        .then(res => res.json())
        .then(data => {
            const banner = document.getElementById("emergencyStatus");
            const message = document.getElementById("emergencyMessage");

            if (data.active_emergency) {
                banner.style.display = "block";
                message.textContent = `🚨 EMERGENCY ACTIVE: ${data.active_emergency.emergency_type} - Green Corridor Engaged`;
                banner.className = "emergency-banner active";
            } else {
                banner.style.display = "none";
            }
        })
        .catch(err => console.error("Error checking emergency status:", err));
}

// Render dashboard dynamically
function renderDashboard() {
    const container = document.getElementById("intersectionsContainer");
    container.innerHTML = ""; // clear old

    // Group signals by intersection
    const intersectionSignals = {};
    signalStatus.forEach(signal => {
        const iid = signal.intersection_id;
        if (!intersectionSignals[iid]) {
            intersectionSignals[iid] = {
                intersection_name: signal.intersection_name,
                signals: []
            };
        }
        intersectionSignals[iid].signals.push(signal);
    });

    // Render each intersection
    Object.keys(intersectionSignals).forEach(intersectionId => {
        const intersection = intersectionSignals[intersectionId];
        const intersectionDiv = document.createElement("div");
        intersectionDiv.className = "intersection";

        let signalsHtml = `<h3>${intersection.intersection_name}</h3>`;
        intersection.signals.forEach(signal => {
            const color = signal.signal_color.toLowerCase();
            const trafficData = getTrafficData(signal.intersection_id, signal.road_id);
            signalsHtml += `
                <div class="signal">
                    <strong>${signal.road_name} (${signal.direction})</strong><br>
                    <span class="signal-light ${color}">${signal.signal_color}</span><br>
                    <small>Traffic: ${trafficData ? trafficData.vehicle_count : 0} vehicles</small><br>
                    <input type="number" id="traffic_${signal.intersection_id}_${signal.road_id}"
                           placeholder="Update count" value="${trafficData ? trafficData.vehicle_count : 0}">
                    <button onclick="updateTraffic(${signal.intersection_id}, ${signal.road_id})">Update</button>
                </div>
            `;
        });

        intersectionDiv.innerHTML = signalsHtml;
        container.appendChild(intersectionDiv);
    });
}

// Get traffic data for specific intersection/road
function getTrafficData(intersectionId, roadId) {
    // This would need to be fetched from the API in a real implementation
    // For now, return mock data
    return { vehicle_count: Math.floor(Math.random() * 20) };
}

// Update traffic count
function updateTraffic(intersectionId, roadId) {
    const input = document.getElementById(`traffic_${intersectionId}_${roadId}`);
    const count = parseInt(input.value);

    fetch("/traffic/update", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            intersection_id: intersectionId,
            road_id: roadId,
            vehicle_count: count
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        fetchSignalStatus(); // refresh dashboard
    })
    .catch(err => console.error("Error updating traffic:", err));
}

// Trigger emergency with green corridor
function triggerEmergency() {
    const startIntersection = document.getElementById("startIntersection").value;
    const endIntersection = document.getElementById("endIntersection").value;
    const emergencyType = document.getElementById("emergencyType").value;

    if (!startIntersection || !endIntersection) {
        alert("Please select both start and end intersections");
        return;
    }

    fetch("/emergency/trigger", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            start_intersection: parseInt(startIntersection),
            end_intersection: parseInt(endIntersection),
            emergency_type: emergencyType
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert(`🚨 ${emergencyType} Green Corridor Activated!\nRoute: ${data.route_path.join(' → ')}`);
            checkEmergencyStatus();
            fetchSignalStatus();
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => console.error("Error triggering emergency:", err));
}

// Clear emergency
function clearEmergency() {
    fetch("/emergency/clear", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
        alert("Emergency cleared - resuming normal traffic management");
        checkEmergencyStatus();
        fetchSignalStatus();
    })
    .catch(err => console.error("Error clearing emergency:", err));
}

// Auto-refresh every 5 seconds
setInterval(() => {
    fetchSignalStatus();
    checkEmergencyStatus();
}, 5000);

// Initial load
window.onload = function() {
    fetchIntersections();
    checkEmergencyStatus();
};
