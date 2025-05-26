// BookingMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function BookingMap({ bookings }) {
  const activeBookings = bookings.filter(
    (b) => b.latitude && b.longitude && b.status !== "completed"
  );

  return (
    <div className="h-[300px] w-full">
      <MapContainer
        center={[-1.2921, 36.8219]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full w-full rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activeBookings.map((booking) => (
          <Marker
            key={booking.id}
            position={[booking.latitude, booking.longitude]}
          >
            <Popup>
              <strong>{booking.location || "Booking"}</strong>
              <br />
              Status: {booking.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
