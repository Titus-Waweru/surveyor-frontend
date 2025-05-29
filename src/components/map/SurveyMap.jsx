import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function SurveyMap({ bookings }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  useEffect(() => {
    if (!mapRef.current || bookings.length === 0) return;

    const first = bookings.find(b => b.latitude && b.longitude);
    if (!first) return;

    // Initialize map only once
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView(
        [first.latitude, first.longitude],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap.current);
    }

    // Remove old markers
    leafletMap.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        leafletMap.current.removeLayer(layer);
      }
    });

    // Add new markers
    bookings.forEach(booking => {
      if (booking.latitude && booking.longitude) {
        L.marker([booking.latitude, booking.longitude])
          .addTo(leafletMap.current)
          .bindPopup(`<strong>${booking.address || "Survey Location"}</strong>`);
      }
    });

    leafletMap.current.invalidateSize();
  }, [bookings]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] mb-8 rounded-lg border border-gray-300"
    />
  );
}
