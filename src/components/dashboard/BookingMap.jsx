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

export default function BookingMap({ onSelectLocation }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [-1.2921, 36.8219], // Nairobi default
      zoom: 7,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    mapInstance.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (onSelectLocation) {
        onSelectLocation({ latitude: lat, longitude: lng });
      }

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng])
          .addTo(mapInstance.current)
          .bindPopup("Selected Location")
          .openPopup();
      }
    });

    setTimeout(() => {
      mapInstance.current.invalidateSize();
    }, 300);

    return () => {
      mapInstance.current.remove();
    };
  }, [onSelectLocation]);

  return (
    <div
      ref={mapRef}
      className="rounded shadow border"
      style={{ height: "256px", width: "100%" }}
    ></div>
  );
}
