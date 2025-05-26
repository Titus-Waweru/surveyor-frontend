import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function SurveyMap({ bookings }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  useEffect(() => {
    if (!mapRef.current || bookings.length === 0) return;

    // Initialize map only once
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView(
        [bookings[0].latitude, bookings[0].longitude],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap.current);
    }

    // Clear old markers
    leafletMap.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        leafletMap.current.removeLayer(layer);
      }
    });

    // Add markers
    bookings.forEach((booking) => {
      if (booking.latitude && booking.longitude) {
        L.marker([booking.latitude, booking.longitude])
          .addTo(leafletMap.current)
          .bindPopup(`<strong>${booking.address || "Survey Location"}</strong>`);
      }
    });
  }, [bookings]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] mb-8 rounded-lg border border-gray-300"
    />
  );
}
