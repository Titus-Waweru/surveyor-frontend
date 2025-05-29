// src/components/dashboard/BookingMap.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons not loading correctly
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function BookingMap({ onSelectLocation, latitude, longitude }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [latitude || -1.2921, longitude || 36.8219], // Default to Nairobi
      zoom: 7,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    // Show existing marker if coordinates provided
    if (latitude && longitude) {
      markerRef.current = L.marker([latitude, longitude])
        .addTo(mapInstance.current)
        .bindPopup("Pinned Location")
        .openPopup();
    }

    // Only allow setting new marker if onSelectLocation is provided (editable mode)
    if (onSelectLocation) {
      mapInstance.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        onSelectLocation({ latitude: lat, longitude: lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng])
            .addTo(mapInstance.current)
            .bindPopup("Selected Location")
            .openPopup();
        }
      });
    }

    setTimeout(() => {
      mapInstance.current.invalidateSize();
    }, 300);

    return () => {
      mapInstance.current.remove();
    };
  }, [latitude, longitude, onSelectLocation]);

  return (
    <div
      ref={mapRef}
      className="rounded shadow border"
      style={{ height: "256px", width: "100%" }}
    ></div>
  );
}
