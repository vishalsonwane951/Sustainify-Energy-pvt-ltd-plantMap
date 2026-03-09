import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";

/*  India map bounds  */
const INDIA_BOUNDS = [[6.0, 68.0], [37.5, 97.5]];
const PUNE_CENTER = [18.5204, 73.8567];

/* Extract coordinates */
function extractCoordinates(url) {
  if (!url || url === 'NA') return null;
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return { lat: 20.59, lng: 78.96 };
}

// Date Validation
function formatPlantCOD(cod) {
  if (!cod) return "NA";
  const yearStr = cod.slice(0, 4);
  if (yearStr === "0000" || yearStr === "0001") return "NA";
  const date = new Date(cod);
  if (isNaN(date.getTime())) return "NA";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


// Solar Panel Pin Icon  
function createSolarIcon(isSelected, status) {
  const active = status === "active";
  const color = isSelected ? "#ef4444" : (active ? "#16a34a" : "#f59e0b");
  const size = isSelected ? 32 : 26;
  const inner = Math.round(size / 2);

  // Use a wrapper with explicit background-color to prevent bleed-through
  const html = `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;background-color:${color};"><div style="width:${inner}px;height:${inner}px;border-radius:50%;transform:rotate(45deg);background-color:#ffffff;"></div></div>`;

  return L.divIcon({
    className: "",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

// Fly-to on select 
function FlyTo({ plant }) {
  const map = useMap();
  useEffect(() => {
    if (plant) map.flyTo([plant.lat, plant.lng], 12, { duration: 1 });
  }, [plant, map]);
  return null;
}

// Fit bounds 
function FitBounds({ plants }) {
  const map = useMap();
  useEffect(() => {
    if (plants.length > 0) {
      let bounds = L.latLngBounds(plants.map(p => [p.lat, p.lng]));
      const indiaBounds = L.latLngBounds(INDIA_BOUNDS);
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      bounds = L.latLngBounds(
        L.latLng(Math.max(sw.lat, indiaBounds.getSouthWest().lat), Math.max(sw.lng, indiaBounds.getSouthWest().lng)),
        L.latLng(Math.min(ne.lat, indiaBounds.getNorthEast().lat), Math.min(ne.lng, indiaBounds.getNorthEast().lng))
      );
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [plants, map]);
  return null;
}

function SolarPanelIcon({ size = 40 }) {
  const { scene } = useGLTF("/models/solar_panel.glb");
  return <primitive object={scene} scale={size / 100} />;
}

// Stats Row 

function StatsRow({ plants = [] }) {
  const total = plants.length;
  const active = plants.filter(p => p.status === "active").length;
  const totalCap = plants.reduce((s, p) => s + parseFloat(p.capacity || 0), 0);
  const MW = parseFloat((totalCap / 1000).toFixed(2));

  const stats = [
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="10" width="40" height="26" rx="2" fill="#1e3a5f" stroke="#2d5a8e" strokeWidth="1.5" />
          {[0, 1, 2].map(row => [0, 1, 2, 3].map(col => (
            <rect key={`${row}-${col}`} x={6 + col * 9.5} y={12 + row * 7.5} width={8.5} height={6.5} rx="0.5" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="0.4" opacity="0.9" />
          )))}
          <rect x="4" y="10" width="40" height="8" rx="2" fill="white" opacity="0.06" />
          <line x1="24" y1="36" x2="20" y2="42" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="36" x2="28" y2="42" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="42" x2="31" y2="42" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Total Plants",
      value: total,
      color: "#1d4ed8",
      // bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      border: "#bfdbfe",
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <style>{`@keyframes sun-pulse{0%,100%{opacity:0.15}50%{opacity:0.35}}.sp{animation:sun-pulse 2s ease-in-out infinite}`}</style>
          <circle className="sp" cx="24" cy="24" r="18" fill="#22c55e" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return <line key={i} x1={24 + Math.cos(rad) * 14} y1={24 + Math.sin(rad) * 14} x2={24 + Math.cos(rad) * 19} y2={24 + Math.sin(rad) * 19} stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />;
          })}
          <circle cx="24" cy="24" r="9" fill="#16a34a" stroke="#4ade80" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="5" fill="#22c55e" />
          <path d="M20 24l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: "Active",
      value: active,
      color: "#15803d",
      // bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      border: "#bbf7d0",
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <style>{`@keyframes bolt-glow{0%,100%{opacity:0.5}50%{opacity:1}}.bg{animation:bolt-glow 1.5s ease-in-out infinite}`}</style>
          <circle className="bg" cx="24" cy="24" r="18" fill="#fbbf24" opacity="0.12" />
          <rect x="14" y="8" width="20" height="12" rx="1.5" fill="#1e3a5f" stroke="#2d5a8e" strokeWidth="1" />
          {[0, 1].map(row => [0, 1, 2].map(col => (
            <rect key={`${row}-${col}`} x={15.5 + col * 6} y={9.5 + row * 5} width={5} height={4} rx="0.3" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="0.3" opacity="0.9" />
          )))}
          <line x1="24" y1="20" x2="24" y2="25" stroke="#fbbf24" strokeWidth="2" strokeDasharray="2 1" />
          <path d="M28 25l-6 9h5l-3 7 8-11h-5l3-5z" fill="#f59e0b" stroke="#fbbf24" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      ),
      label: "Capacity",
      value: `${MW} MW`,
      color: "#b45309",
      // bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      border: "#fde68a",
    },
  ];

  return (
    <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e7f5ec" }}>
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            padding: "15px 0px",
            textAlign: "center",
            background: s.bg,
            borderRight: i < 2 ? `1px solid ${s.border}` : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))" }}>
            {s.icon}
          </div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// Plant Card
function PlantCard({ plant, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = "#86efac"; e.currentTarget.style.background = "#f0fdf4"; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; } }}
      style={{
        padding: "12px 14px 0px 15px",
        borderRadius: 10,
        marginBottom: 7,
        cursor: "pointer",
        marginLeft: 15,
        border: selected ? "1.5px solid #065f46" : "1.5px solid #e5e7eb",
        background: selected ? "#d1fae6" : "#fafafa",
        boxShadow: selected ? "0 2px 12px rgba(6,95,70,0.18)" : "none",
        transition: "all 0.18s",
      }}
    >
      <div style={{ padding: 10, borderBottom: "1px solid #eee" }}>
        <div className="flex justify-between items-start" style={{ gap: 6 }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: "#14532d", lineHeight: 1.3, flex: 1 }}>
            {plant.name}
          </div>
          <span style={{ flexShrink: 0, fontSize: 9, padding: "2px 7px", borderRadius: 20, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }} />
        </div>

        <div style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 6px" }}>
          👤{plant.location}
        </div>

        <div className="flex flex-wrap" style={{ gap: 10 }}>
          <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>⚡ {plant.capacity} KW</span>
        </div>
      </div>
    </div>
  );
}

//  Detail Card (map overlay) 
function DetailCard({ plant, onClose, isMobile }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        ...(isMobile
          ? { bottom: 0, left: 0, right: 0, borderRadius: "16px 16px 0 0" }
          : { bottom: 16, right: 16, width: 280, borderRadius: 16 }),
        zIndex: 1000,
        background: "#fff",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        border: "1px solid rgba(34,197,94,0.25)",
        animation: "panelIn 0.3s cubic-bezier(.34,1.56,.64,1) both",
      }}
    >
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#14532d", marginBottom: 2 }}>{plant.name}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>📍 {plant.location}</div>
        <div className="grid grid-cols-2" style={{ gap: 7 }}>
          {[
            ["👤", "Client", plant.name],
            ["📞", "Contact", plant.contact || 'NA'],
            ["⚡", "Capacity", `${plant.capacity} KW`],
            ["📅", "Installation Date", plant.year || 'NA'],
          ].map(([ico, lbl, val]) => (
            <div key={lbl} style={{ background: "#f0fdf4", borderRadius: 8, padding: "7px 9px" }}>
              <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 2 }}>{ico} {lbl}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#14532d" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Component 
export default function PlantMap() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showList, setShowList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch(`https://backend.pvvigilance.com/api/v1/solar-plant/all-solar-plants/pva82798f9c`);
        const result = await res.json();
        const plants = result.data;
        const formatted = plants.map((plant, index) => {
          const coords = extractCoordinates(plant.site_location_url);
          if (!coords) return null;
          return {
            id: plant._id || index,
            name: plant.plant_name,
            location: plant.client_name || "Unknown",
            capacity: plant.plant_capacity,
            contact: plant.site_contact_number || 'NA',
            lat: coords.lat || "null",
            lng: coords.lng || "null",
            year: formatPlantCOD(plant.plant_cod),
            client: plant.client,
            status: plant.status || "active",
          };
        }).filter(Boolean);
        setPlants(formatted);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlants();
  }, []);

  useEffect(() => {
    setMounted(true);
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSelect = (plant) => {
    setSelectedPlant(prev => prev?.id === plant.id ? null : plant);
    if (isMobile) setShowList(false);
  };

  const totalCap = plants.reduce((s, p) => s + parseFloat(p.capacity), 0);
  const totalCapRounded = parseFloat(totalCap.toFixed(2));

  // Filter plants by search query
  const filteredPlants = plants.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      String(p.capacity)?.toLowerCase().includes(q) ||
      p.client?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg,#f0fdf4,#f9fafb 60%,#ecfdf5)",
        fontFamily: "'Rajdhani','Segoe UI',sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Rajdhani:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes panelIn { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .leaflet-container { font-family: 'Rajdhani',sans-serif !important; }
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.14) !important;
          border: 1.5px solid rgba(34,197,94,0.25) !important;
          padding: 0 !important; overflow: hidden;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 10px rgba(0,0,0,0.12) !important; }
        .leaflet-control-zoom a { border-radius: 8px !important; border: none !important; color: #14532d !important; font-weight: 700 !important; }
        .se-scroll::-webkit-scrollbar { width: 4px; }
        .se-scroll::-webkit-scrollbar-thumb { background: #86efac; border-radius: 4px; }
        .anim-1 { animation: fadeUp 0.45s 0.08s ease both; opacity: 0; animation-fill-mode: forwards; }
        .anim-2 { animation: fadeUp 0.45s 0.16s ease both; opacity: 0; animation-fill-mode: forwards; }
        .plant-search::placeholder { color: #9ca3af; }
        .plant-search:focus { outline: none; }
      `}</style>

       {/* SECTION TITLE */}
      <div
        className={`${mounted ? "anim-1" : ""}`}
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          width: "100%",
          padding: isMobile ? "22px 20px 14px" : "28px 24px 16px",
          opacity: 0,
        }}
      >
        <div
          className={`flex justify-between ${isMobile ? "flex-col items-start" : "flex-row items-center"}`}
          style={{ gap: 8 }}
        >
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? 22 : 28, fontWeight: 800, color: "#14532d", lineHeight: 1.15 }}>
              Our Plant Locations
            </h2>
            <p style={{ fontSize: 13, color: "black", marginTop: 4, lineHeight: 1.5 }}>
              <span className="font-bold"> {plants.length}</span> solar plants under AMC across India · <span className="font-bold">{totalCapRounded}</span> kW total capacity
            </p>
          </div>

          {isMobile && (
            <button
              onClick={() => setShowList(p => !p)}
              style={{
                background: "#14532d", color: "#fff", border: "none", borderRadius: 8,
                padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Rajdhani',sans-serif", letterSpacing: 0.5,
              }}
            >
              {showList ? "🗺 Show Map" : "📋 Plant List"}
            </button>
          )}
        </div>
      </div>

      {/*  MAIN CONTENT  */}
      <div
        className={`flex-1 ${mounted ? "anim-2" : ""}`}
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          width: "100%",
          padding: isMobile ? "0 0 32px" : "0 24px 40px",
          opacity: 0,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: isMobile ? "1fr" : "300px 1fr",
            gap: isMobile ? 0 : 18,
            minHeight: isMobile ? "auto" : 560,
          }}
        >

          {/*  LEFT SIDEBAR  */}
          {(!isMobile || showList) && (
            <div
              className="flex flex-col overflow-hidden"
              style={{
                background: "#fff",
                borderRadius: isMobile ? 0 : 14,
                boxShadow: isMobile ? "none" : "0 4px 24px rgba(0,0,0,0.07)",
                border: isMobile ? "none" : "1px solid rgba(34,197,94,0.15)",
                margin: isMobile ? "0 20px 16px" : 0,
              }}
            >
              {/* <StatsRow plants={plants} /> */}

              <div style={{ padding: "12px 10px 10px", flex: 1, display: "flex", flexDirection: "column" }}>

                {/*  SEARCH BAR  */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    padding: "7px 10px",
                    borderRadius: 8,
                    border: searchFocused ? "1.5px solid #22c55e" : "1.5px solid #e5e7eb",
                    background: searchFocused ? "#f0fdf4" : "#f9fafb",
                    transition: "all 0.18s",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, color: searchFocused ? "#16a34a" : "#9ca3af" }}>
                    <circle cx="9" cy="9" r="7" stroke={searchFocused ? "#16a34a" : "#9ca3af"} strokeWidth="2" />
                    <path d="M14.5 14.5L18 18" stroke={searchFocused ? "#16a34a" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <input
                    className="plant-search"
                    type="text"
                    placeholder="Search plants..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    style={{
                      flex: 1,
                      border: "none",
                      background: "transparent",
                      fontSize: 12,
                      color: "#374151",
                      fontFamily: "'Rajdhani','Segoe UI',sans-serif",
                      fontWeight: 500,
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: 0, lineHeight: 1, color: "#9ca3af", fontSize: 14,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* ALL PLANTS LABEL */}
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700, color: "#14532d", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
                  📋 All Plants ({filteredPlants.length}{searchQuery ? ` of ${plants.length}` : ""})
                </div>

                {/* PLANT LIST */}
                <div
                  className="se-scroll overflow-y-auto"
                  style={{ marginLeft: -15, maxHeight: isMobile ? 300 : 480, flex: 1 }}
                >
                  {filteredPlants.length > 0 ? (
                    filteredPlants.map(p => (
                      <PlantCard
                        key={p.id}
                        plant={p}
                        selected={selectedPlant?.id === p.id}
                        onClick={() => handleSelect(p)}
                      />
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "24px 10px", color: "#9ca3af" }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>🔍</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>No plants found</div>
                      <div style={{ fontSize: 11, marginTop: 3 }}>Try a different search term</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MAP */}
          {(!isMobile || !showList) && (
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: isMobile ? 0 : 14,
                border: isMobile ? "none" : "1px solid rgba(34,197,94,0.15)",
                minHeight: isMobile ? 420 : 560,
              }}
            >
              <MapContainer
                center={PUNE_CENTER}
                zoom={11}
                minZoom={4}
                maxZoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <FitBounds plants={plants.filter(p => p.location.includes("Pune"))} />
                {selectedPlant && <FlyTo plant={selectedPlant} />}

                {plants.map(p => (
                  <Marker
                    key={p.id}
                    position={[p.lat, p.lng]}
                    icon={createSolarIcon(selectedPlant?.id === p.id, p.status)}
                    zIndexOffset={selectedPlant?.id === p.id ? 1000 : 0}
                    eventHandlers={{
                      click: () => handleSelect(p),
                      mouseover: (e) => e.target.openPopup(),
                      mouseout: (e) => { if (selectedPlant?.id !== p.id) e.target.closePopup(); },
                    }}
                  >
                    <Popup>
                      <div style={{ padding: "10px 13px", minWidth: 170 }}>
                        <div style={{ fontWeight: "700", color: "#14532d" }}>{p.name}</div>
                        <div style={{ fontSize: 11 }}>👤 {p.location}</div>
                        <div style={{ fontSize: 11, color: "#16a34a" }}>⚡ {p.capacity} KW</div>
                        <div style={{ fontSize: 10 }}>📅 {formatPlantCOD(p.year)}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map top-left label */}
              <div className="mt-5 absolute top-3 right-2 w-43 z-900 flex items-center gap-1 bg-white/90 backdrop-blur-md px-4 py-2 pr-6 rounded-xl shadow-lg border border-green-200">

                <span className="text-xl">🌿</span>

                <div className="leading-tight">
                  <p className="text-xs  font-semibold text-green-900">
                    Sustainify Energy Pvt. Ltd
                  </p>
                </div>

              </div>

              {/* Legend
              <div
                className={`absolute top-12 right-3 h-5 text-center z-1000 w-12 bg-white/95 rounded-[9px] px-3 py-2 
                shadow-md border border-green-200 backdrop-blur-md 
                ${isMobile ? "top-3" : "bottom-8"}`}
              >
                {[["#22c55e", "Active"]].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full gap-2"
                      style={{ background: c }}
                    />
                    <span className="text-[10px] text-gray-700 font-medium px-2 py-2">
                      {l}
                    </span>
                  </div>
                ))}
              </div> */}



              {/* Detail card */}
              {selectedPlant && (
                <DetailCard plant={selectedPlant} onClose={() => setSelectedPlant(null)} isMobile={isMobile} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}