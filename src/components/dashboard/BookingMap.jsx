import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ---------- Default Leaflet marker fix ----------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* // Optional: custom branded icon
const customIcon = new L.Icon({
  iconUrl: "/custom-marker.png", // place image in /public
  iconSize: [32, 40],
  iconAnchor: [16, 40],
});
*/

export default function BookingMap({
  onSelectLocation,
  latitude,
  longitude,
  searchQuery,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // 🌍 Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map without default zoom controls
    mapInstance.current = L.map(mapRef.current, {
      center: [latitude || -1.2921, longitude || 36.8219],
      zoom: 7,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    // Add custom‑positioned zoom
    L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);

    // Tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    // Existing marker
    if (latitude && longitude) {
      markerRef.current = L.marker([latitude, longitude] /* , { icon: customIcon } */)
        .addTo(mapInstance.current)
        .bindPopup("Pinned Location")
        .openPopup();
    }

    // Click to select
    if (onSelectLocation) {
      mapInstance.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        onSelectLocation({ latitude: lat, longitude: lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng] /* , { icon: customIcon } */)
            .addTo(mapInstance.current);
        }
        markerRef.current.bindTooltip("You selected this spot").openTooltip();
      });
    }

    // Fix Leaflet resize bug
    setTimeout(() => mapInstance.current.invalidateSize(), 300);

    return () => mapInstance.current.remove();
  }, [latitude, longitude, onSelectLocation]);

  // 🔍 Handle search query
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!searchQuery || !mapInstance.current) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const latLng = [parseFloat(lat), parseFloat(lon)];

          mapInstance.current.setView(latLng, 14);

          if (markerRef.current) {
            markerRef.current.setLatLng(latLng);
          } else {
            markerRef.current = L.marker(latLng /* , { icon: customIcon } */)
              .addTo(mapInstance.current);
          }
          markerRef.current.bindPopup("Searched Location").openPopup();

          if (onSelectLocation) onSelectLocation({ latitude: lat, longitude: lon });
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinates();
  }, [searchQuery, onSelectLocation]);

  // ---------- JSX ----------
  return (
    <div className="relative">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/70 rounded">
          <span className="text-blue-700 font-medium animate-pulse">
            Locating...
          </span>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={() => {
          if (mapInstance.current) {
            mapInstance.current.setView(
              [latitude || -1.2921, longitude || 36.8219],
              7
            );
          }
        }}
        className="absolute top-2 right-2 z-[60] bg-white border shadow px-3 py-1 text-sm rounded hover:bg-gray-100 transition"
      >
        Reset View
      </button>

      {/* Map */}
      <div
        ref={mapRef}
        className="rounded shadow border border-blue-100 overflow-hidden transition-shadow hover:shadow-lg"
        style={{ height: "256px", width: "100%" }}
      ></div>
    </div>
  );
}
