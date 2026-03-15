// ========== DEBUGGING ==========
window.addEventListener('error', function (e) {
  alert('JS Error: ' + e.message + ' at ' + e.filename + ':' + e.lineno);
});

// ========== THEME MANAGEMENT ==========
let currentTileLayer = null;
let currentLabelLayer = null;

function applyMapTheme() {
  const isLight = document.body.classList.contains('light-mode');
  try {
    if (window.map) {
      if (currentTileLayer) window.map.removeLayer(currentTileLayer);
      if (currentLabelLayer) window.map.removeLayer(currentLabelLayer);

      // Esri World Imagery (Free Satellite)
      currentTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
      }).addTo(window.map);

      // CARTO Labels (Clean sans-serif typography)
      currentLabelLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        pane: 'markerPane'
      }).addTo(window.map);

      const tilePane = window.map.getPane('tilePane');
      const labelPane = window.map.getPane('markerPane');
      if (tilePane) {
        if (!isLight) {
          tilePane.style.filter = 'brightness(75%) contrast(110%)';
          if (labelPane) labelPane.style.filter = 'invert(1) hue-rotate(180deg) brightness(1.5)';
        } else {
          tilePane.style.filter = '';
          if (labelPane) labelPane.style.filter = '';
        }
      }
    }
  } catch (e) {
    console.error('Theme Error:', e);
  }
}

// ========== SCREEN NAVIGATION ==========

// Landing Screen Navigation
const getStartedBtn = document.getElementById('getStartedBtn');
if (getStartedBtn) {
  getStartedBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}

// Login Screen Navigation
const backToLandingBtn = document.getElementById('backToLandingBtn');
if (backToLandingBtn) {
  backToLandingBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

const signupToggleBtn = document.getElementById('signupToggleBtn');
if (signupToggleBtn) {
  signupToggleBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });
}

// Signup Screen Navigation
const backToLoginBtn = document.getElementById('backToLoginBtn');
if (backToLoginBtn) {
  backToLoginBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}


// ========== INCIDENT TYPES & SEVERITIES ==========

const INCIDENT_TYPES = [
  { key: "accident", label: "Accident", color: "#ff4d4d" },
  { key: "hazard", label: "Hazard", color: "#f5a524" },
  { key: "crime", label: "Crime", color: "#3b82f6" },
  { key: "flood", label: "Flood", color: "#22c55e" },
  { key: "other", label: "Other", color: "#a78bfa" },
];

const SEVERITIES = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

// ========== STATE ==========

const incidents = [];
const markerById = new Map();

let activeFilters = new Set(INCIDENT_TYPES.map((t) => t.key));
let pendingLatLng = null;
let pendingLocationName = "";
let selectedType = "hazard";
let selectedSeverity = "medium";
let pendingImageURL = null; // Still used for preview
let pendingImageFile = null; // Actual file for upload

// ========== RATE LIMITING STATE ==========
const MAX_DAILY_REPORTS = 20;
const MAX_REPORTS_PER_MIN = 5;
const COOLDOWN_SECONDS = 60;

let lastReportTime = 0;
let recentReports = [];
let cooldownTimer = null;

// ========== REAL-TIME UPDATES (SOCKET.IO) ==========
let socket = null;

if (typeof io !== 'undefined') {
  socket = io();

  socket.on('connect', () => {
    console.log('Connected to real-time updates server');
  });

  socket.on('new_incident', (incident) => {
    // Check if we already have this incident (e.g. if we reported it ourselves)
    if (!incidents.find(i => i.id === incident.id)) {
      // Normalize and add to map
      const normalized = {
        ...incident,
        locationName: incident.location_name,
        created_at: incident.created_at
      };
      incidents.push(normalized);
      addIncidentToMap(normalized);
      // Optionally alert the user or show a notification
      console.log('New real-time incident received:', normalized);
    }
  });

  socket.on('incident_voted', (updatedIncident) => {
    const idx = incidents.findIndex(i => i.id === updatedIncident.id);
    if (idx !== -1) {
      incidents[idx].upvote_count = updatedIncident.upvote_count;

      // Update marker popup if it exists
      const marker = markerById.get(updatedIncident.id);
      if (marker) {
        // Create normalized version for the popup helper
        const normalized = {
          ...incidents[idx],
          locationName: incidents[idx].location_name || incidents[idx].locationName,
        };

        const wasOpen = marker.getPopup().isOpen();
        marker.setPopupContent(makePopupHtml(normalized));
        if (wasOpen) marker.openPopup();

        // Update UI element if visible in an open popup
        const countEl = document.getElementById(`vote-count-${updatedIncident.id}`);
        if (countEl) countEl.textContent = updatedIncident.upvote_count || 0;
      }
    }
  });

  // ========== VOTING LOGIC ==========
  async function toggleVote(incidentId) {
    const btn = document.getElementById(`vote-btn-${incidentId}`);
    if (!btn) return;

    const isUpvoted = btn.classList.contains('active');
    const method = isUpvoted ? 'DELETE' : 'POST';
    const url = `/api/incidents/${incidentId}/upvote`;

    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // The socket listener 'incident_voted' will handle UI updates for everyone
        // but we can toggle local state for immediate feedback
        btn.classList.toggle('active', !isUpvoted);
      } else {
        const data = await response.json();
        alert(data.message || 'Voting failed');
      }
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  }

  window.toggleVote = toggleVote; // Expose to HTML onclick
}

// ========== DOM ELEMENTS ==========

const els = {
  panel: document.getElementById("panel"),
  coordsText: document.getElementById("coordsText"),
  filterRow: document.getElementById("filterRow"),
  typeButtons: document.getElementById("typeButtons"),
  severityButtons: document.getElementById("severityButtons"),
  desc: document.getElementById("desc"),
  charsLeft: document.getElementById("charsLeft"),
  errorBox: document.getElementById("errorBox"),
  dailyLimitBox: document.getElementById("dailyLimitBox"),
  submitBtn: document.getElementById("submitBtn"),
  clearBtn: document.getElementById("clearBtn"),
  closePanelBtn: document.getElementById("closePanelBtn"),
  imageUpload: document.getElementById("imageUpload"),
  imagePreviewContainer: document.getElementById("imagePreviewContainer"),
  imagePreview: document.getElementById("imagePreview"),
  removeImageBtn: document.getElementById("removeImageBtn"),
  uploadLabelText: document.getElementById("uploadLabelText"),
};

// ========== SPAM PREVENTION ==========

function getDailyKey() {
  const dateStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format based on local time
  const userKey = currentUser ? currentUser.email : "guest";
  return `vision_reports_${userKey}_${dateStr}`;
}

function getDailyCount() {
  return parseInt(localStorage.getItem(getDailyKey())) || 0;
}

function incrementDailyCount() {
  const key = getDailyKey();
  localStorage.setItem(key, (getDailyCount() + 1).toString());
}

function updateDailyLimitUI() {
  if (!els.dailyLimitBox) return;
  const remaining = Math.max(0, MAX_DAILY_REPORTS - getDailyCount());
  els.dailyLimitBox.textContent = `${remaining} report${remaining === 1 ? '' : 's'} remaining today`;

  if (remaining === 0) {
    els.dailyLimitBox.style.color = "var(--danger)";
    els.submitBtn.disabled = true;
    els.submitBtn.style.opacity = "0.5";
    els.submitBtn.style.cursor = "not-allowed";
  } else {
    els.dailyLimitBox.style.color = "var(--accent)";
    if (!cooldownTimer) {
      els.submitBtn.disabled = false;
      els.submitBtn.style.opacity = "1";
      els.submitBtn.style.cursor = "pointer";
    }
  }
}

function startCooldown() {
  if (cooldownTimer) clearInterval(cooldownTimer);

  let timeLeft = COOLDOWN_SECONDS;
  els.submitBtn.disabled = true;
  els.submitBtn.style.opacity = "0.7";
  els.submitBtn.style.cursor = "not-allowed";

  const tick = () => {
    els.submitBtn.textContent = `Wait ${timeLeft} seconds...`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
      els.submitBtn.textContent = "Broadcast Incident";
      updateDailyLimitUI();
    }
  };
  tick();
  cooldownTimer = setInterval(tick, 1000);
}

function checkSpamRules(newIncident) {
  const now = Date.now();

  // 1. Daily Limit
  if (getDailyCount() >= MAX_DAILY_REPORTS) {
    return "You've reached your daily limit. Try again tomorrow!";
  }

  // 2. Cooldown Timer
  if (now - lastReportTime < COOLDOWN_SECONDS * 1000) {
    const wait = Math.ceil(COOLDOWN_SECONDS - (now - lastReportTime) / 1000);
    return `Must wait ${wait} seconds between reports.`;
  }

  // 3. Per-Minute Rate Limit
  recentReports = recentReports.filter(time => now - time < 60000);
  if (recentReports.length >= MAX_REPORTS_PER_MIN) {
    return "You are reporting too fast. Please slow down (Max 5 per minute).";
  }

  // 4. Duplicate Detection
  const fiveMinsAgo = new Date(now - 5 * 60000).toISOString();
  const recentIncidents = incidents.filter(i => i.created_at >= fiveMinsAgo);

  const isDuplicate = recentIncidents.some(i => {
    const latDiff = Math.abs(i.latitude - newIncident.latitude);
    const lngDiff = Math.abs(i.longitude - newIncident.longitude);
    return i.type === newIncident.type &&
      i.description === newIncident.description &&
      latDiff < 0.0001 && lngDiff < 0.0001;
  });

  if (isDuplicate) {
    return "This exact incident was already reported nearby recently.";
  }

  return null;
}

// ========== HELPERS ==========

function typeMeta(typeKey) {
  return INCIDENT_TYPES.find((t) => t.key === typeKey) ?? INCIDENT_TYPES[0];
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ========== PANEL MANAGEMENT ==========

async function openPanel(latlng) {
  pendingLatLng = latlng;
  pendingLocationName = "";
  els.panel.classList.add("open");
  const latStr = latlng.lat.toFixed(5);
  const lngStr = latlng.lng.toFixed(5);
  els.coordsText.innerHTML = `Loading location...<br>(${latStr}, ${lngStr})`;
  updateDailyLimitUI();

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`, {
      headers: { 'Accept-Language': 'en' }
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        pendingLocationName = data.display_name;
      }
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  if (pendingLatLng === latlng) {
    if (pendingLocationName) {
      els.coordsText.innerHTML = `${escapeHtml(pendingLocationName)}<br>(${latStr}, ${lngStr})`;
    } else {
      els.coordsText.textContent = `${latStr}, ${lngStr}`;
    }
  }
}

function closePanel() {
  els.panel.classList.remove("open");
  pendingLatLng = null;
  pendingLocationName = "";
  els.coordsText.textContent = "Click the map to set a location";
  els.errorBox.style.display = "none";
  els.errorBox.textContent = "";
}

// ========== FORM CONTROL ==========

function setSelectedType(typeKey) {
  selectedType = typeKey;
  for (const btn of els.typeButtons.querySelectorAll("button[data-type]")) {
    btn.classList.toggle("selected", btn.dataset.type === typeKey);
  }
}

function setSelectedSeverity(sevKey) {
  selectedSeverity = sevKey;
  for (const btn of els.severityButtons.querySelectorAll("button[data-sev]")) {
    btn.classList.toggle("selected", btn.dataset.sev === sevKey);
  }
}

function validateForm() {
  const description = els.desc.value.trim();
  if (!pendingLatLng) return "Click the map to pick a location.";
  if (!selectedType) return "Select an incident type.";
  if (!description) return "Add a short description.";
  return null;
}

function clearForm() {
  els.desc.value = "";
  els.charsLeft.textContent = "280";
  setSelectedType("hazard");
  setSelectedSeverity("medium");
  els.errorBox.style.display = "none";
  els.errorBox.textContent = "";

  // Reset image upload
  pendingImageURL = null;
  els.imageUpload.value = "";
  els.imagePreviewContainer.style.display = "none";
  els.imagePreview.src = "";
  els.uploadLabelText.textContent = "📷 Add a Picture";
}

// ========== RENDERING ==========

function renderFilters() {
  els.filterRow.innerHTML = "";

  const allChip = document.createElement("div");
  allChip.className = "chip";
  allChip.textContent = "All";
  allChip.classList.toggle("active", activeFilters.size === INCIDENT_TYPES.length);
  allChip.onclick = () => {
    activeFilters = new Set(INCIDENT_TYPES.map((t) => t.key));
    renderFilters();
    applyMarkerFilters();
  };
  els.filterRow.appendChild(allChip);

  for (const t of INCIDENT_TYPES) {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.classList.toggle("active", activeFilters.has(t.key));

    const dot = document.createElement("span");
    dot.className = "dot";
    dot.style.background = t.color;

    const label = document.createElement("span");
    label.textContent = t.label;

    chip.appendChild(dot);
    chip.appendChild(label);

    chip.onclick = () => {
      if (activeFilters.has(t.key)) activeFilters.delete(t.key);
      else activeFilters.add(t.key);

      if (activeFilters.size === 0) {
        activeFilters = new Set(INCIDENT_TYPES.map((x) => x.key));
      }

      renderFilters();
      applyMarkerFilters();
    };

    els.filterRow.appendChild(chip);
  }
}

function renderTypeButtons() {
  els.typeButtons.innerHTML = "";
  for (const t of INCIDENT_TYPES) {
    const btn = document.createElement("button");
    btn.className = "seg-btn";
    btn.type = "button";
    btn.dataset.type = t.key;
    btn.textContent = t.label;
    btn.onclick = () => setSelectedType(t.key);
    els.typeButtons.appendChild(btn);
  }
  setSelectedType(selectedType);
}

function renderSeverityButtons() {
  els.severityButtons.innerHTML = "";
  for (const s of SEVERITIES) {
    const btn = document.createElement("button");
    btn.className = "seg-btn";
    btn.type = "button";
    btn.dataset.sev = s.key;
    btn.textContent = s.label;
    btn.onclick = () => setSelectedSeverity(s.key);
    els.severityButtons.appendChild(btn);
  }
  setSelectedSeverity(selectedSeverity);
}

function makePopupHtml(incident) {
  const t = typeMeta(incident.type);
  const imageHtml = incident.image
    ? `<div class="popup-image-container">
         <img src="${incident.image}" alt="Incident Photo" loading="lazy" />
       </div>`
    : "";

  return `
    <div id="popup-${incident.id}" style="min-width:200px">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
        <span class="dot" style="background:${t.color}; width:12px; height:12px; border-radius:50%; display:inline-block;"></span>
        <strong style="font-size:14px; color:var(--text);">${t.label}</strong>
        <span style="margin-left:auto; color:var(--muted); font-size:11px; font-weight:bold;">
          ${incident.severity.toUpperCase()}
        </span>
      </div>
      <div style="margin-bottom:8px; font-size:13px; line-height:1.4; color:var(--text);">
        ${escapeHtml(incident.description)}
      </div>
      <div style="color:var(--muted); font-size:11px; margin-bottom:10px;">
        ${incident.locationName ? escapeHtml(incident.locationName) + '<br/>' : ''}
        ${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}<br/>
        ${new Date(incident.created_at).toLocaleString()}
      </div>
      ${imageHtml}
      
      <div class="popup-actions" style="margin-top:12px; border-top: 1px solid var(--border); padding-top:10px; display:flex; align-items:center; justify-content:space-between;">
        <button class="vote-btn" onclick="toggleVote('${incident.id}')" id="vote-btn-${incident.id}" title="Upvote this report">
          <span class="vote-icon">▲</span>
          <span class="vote-count" id="vote-count-${incident.id}">${incident.upvote_count || 0}</span>
        </button>
        <span style="font-size:11px; color:var(--muted)">Verified by community</span>
      </div>
    </div>
  `;
}

function addIncidentToMap(incident) {
  if (incident.latitude == null || incident.longitude == null || isNaN(incident.latitude) || isNaN(incident.longitude)) {
    console.warn("Skipping incident with invalid coordinates:", incident);
    return;
  }
  const t = typeMeta(incident.type);

  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.style.backgroundColor = t.color;
  el.style.width = '18px';
  el.style.height = '18px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid rgba(255,255,255,0.8)';
  el.style.boxShadow = `0 0 10px ${t.color}, 0 0 20px ${t.color}`;
  el.style.opacity = '1';
  el.style.cursor = 'pointer';

  // Add flashing entrance animation if new (less than 10s old)
  const isNew = Date.now() - new Date(incident.created_at).getTime() < 10000;
  if (isNew) {
    el.style.animation = 'pulseGlow 2s infinite';
  }

  const icon = L.divIcon({
    html: el.outerHTML,
    className: '', // Clear default styling
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });

  const marker = L.marker([incident.latitude, incident.longitude], { icon })
    .bindPopup(makePopupHtml(incident), { closeButton: false })
    .addTo(map);

  markerById.set(incident.id, marker);
}

function applyMarkerFilters() {
  const visibleBounds = [];

  for (const incident of incidents) {
    const marker = markerById.get(incident.id);
    if (!marker) continue;
    const shouldShow = activeFilters.has(incident.type);
    if (shouldShow) {
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
      visibleBounds.push([incident.latitude, incident.longitude]);
    } else {
      marker.remove();
    }
  }

  // Gracefully swoop to highlight only the filtered markers
  if (visibleBounds.length > 0 && map) {
    map.flyToBounds(visibleBounds, {
      padding: [80, 80],
      maxZoom: 14,
      duration: 1.2,
      easeLinearity: 0.25
    });
  }
}

// ========== INITIALIZATION ==========

let map;

window.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // Render UI components
  renderFilters();
  renderTypeButtons();
  renderSeverityButtons();

  // Character counter
  els.desc.addEventListener("input", () => {
    const left = 280 - els.desc.value.length;
    els.charsLeft.textContent = String(Math.max(0, left));
  });

  // Button listeners
  els.closePanelBtn.onclick = closePanel;
  els.clearBtn.onclick = clearForm;

  // Image Upload Listeners
  const uploadLabel = document.querySelector('.file-upload-btn');
  if (uploadLabel) {
    uploadLabel.addEventListener("keydown", (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        els.imageUpload.click();
      }
    });
  }

  els.imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    pendingImageFile = file; // Store the file for upload

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      els.errorBox.textContent = "Image must be smaller than 20MB.";
      els.errorBox.style.display = "block";
      els.imageUpload.value = "";
      return;
    }

    els.errorBox.style.display = "none";

    const reader = new FileReader();
    reader.onerror = () => {
      els.errorBox.textContent = "Failed to completely read image file.";
      els.errorBox.style.display = "block";
    };
    reader.onload = (event) => {
      pendingImageURL = event.target.result;
      if (pendingImageURL) {
        els.imagePreview.src = pendingImageURL;
        els.imagePreviewContainer.style.display = "block";
        els.uploadLabelText.textContent = "📷 Change Picture";
      } else {
        els.errorBox.textContent = "Could not process image data.";
        els.errorBox.style.display = "block";
      }
    };
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      els.errorBox.textContent = "Error reading image: " + err.message;
      els.errorBox.style.display = "block";
    }
  });

  els.removeImageBtn.addEventListener("click", () => {
    pendingImageURL = null;
    pendingImageFile = null;
    els.imageUpload.value = "";
    els.imagePreviewContainer.style.display = "none";
    els.imagePreview.src = "";
    els.uploadLabelText.textContent = "📷 Add a Picture";
  });

  els.submitBtn.onclick = async () => {
    const err = validateForm();
    if (err) {
      els.errorBox.textContent = err;
      els.errorBox.style.display = "block";
      return;
    }

    // Use FormData for file upload support
    const formData = new FormData();
    formData.append('type', selectedType);
    formData.append('severity', selectedSeverity);
    formData.append('description', els.desc.value.trim());
    formData.append('latitude', pendingLatLng.lat);
    formData.append('longitude', pendingLatLng.lng);
    formData.append('locationName', pendingLocationName);
    
    if (pendingImageFile) {
      formData.append('image', pendingImageFile);
    }

    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        // Note: Don't set Content-Type header when sending FormData!
        // Browser will set it automatically with the correct boundary.
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save incident');
      }

      const { incident } = await response.json();

      // Record Spam Data locally for UX (though server should handle it too)
      const now = Date.now();
      lastReportTime = now;
      recentReports.push(now);
      incrementDailyCount();

      incidents.push(incident);
      addIncidentToMap(incident);
      applyMarkerFilters();

      clearForm();
      closePanel();

      // Start Cooldown in background so button is disabled when reopened
      startCooldown();
    } catch (err) {
      console.error(err);
      els.errorBox.textContent = "Error saving incident to database.";
      els.errorBox.style.display = "block";
    }
  };

  // Initial fetch from backend
  async function initIncidents() {
    try {
      const response = await fetch('/api/incidents');
      if (response.ok) {
        const data = await response.json();
        data.forEach(inc => {
          // Normalize names if necessary (backend uses snake_case usually)
          const normalized = {
            ...inc,
            locationName: inc.location_name,
            created_at: inc.created_at
          };
          incidents.push(normalized);
          addIncidentToMap(normalized);
        });
        applyMarkerFilters();
      }
    } catch (err) {
      console.error('Failed to load incidents:', err);
    }
  }

  initIncidents();

  // Initialize Leaflet map (Jamaica - Kingston area)
  map = L.map('map', { zoomControl: false }).setView([18.0179, -76.8099], 10);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  window.map = map;

  applyMapTheme();

  map.on("click", (e) => openPanel(e.latlng));
});
