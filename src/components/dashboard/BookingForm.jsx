import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const bookingSchema = z.object({
  location: z.string().min(3, "Location is required"),
  surveyType: z.string().min(3, "Survey type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  preferredDate: z.string().min(1, "Preferred date is required"),
});

export default function BookingForm({ userEmail, onNewBooking }) {
  const [status, setStatus] = useState(null);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data) => {
    if (!coords.latitude || !coords.longitude) {
      setStatus({ type: "error", msg: "Please select a location on the map." });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, {
        ...data,
        email: userEmail,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setStatus({ type: "success", msg: "Booking submitted successfully." });
      reset();
      setCoords({ latitude: null, longitude: null });
      onNewBooking?.(); // just trigger parent callback
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to submit booking.",
      });
    }
  };

  /* ---------- Leaflet map setup ---------- */
  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [-1.2921, 36.8219],
      zoom: 7,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    L.Control.geocoder({ defaultMarkGeocode: false })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        mapInstance.current.setView(center, 15);
        setCoords({ latitude: center.lat, longitude: center.lng });

        if (markerRef.current) {
          markerRef.current.setLatLng(center);
        } else {
          markerRef.current = L.marker(center)
            .addTo(mapInstance.current)
            .bindPopup("Searched Location")
            .openPopup();
        }
      })
      .addTo(mapInstance.current);

    mapInstance.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ latitude: lat, longitude: lng });

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng])
          .addTo(mapInstance.current)
          .bindPopup("Selected Location")
          .openPopup();
      }
    });

    setTimeout(() => mapInstance.current.invalidateSize(), 300);

    return () => mapInstance.current.remove();
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ latitude, longitude });

        if (mapInstance.current) {
          mapInstance.current.setView([latitude, longitude], 15);

          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude])
              .addTo(mapInstance.current)
              .bindPopup("Your Location")
              .openPopup();
          }
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4 font-poppins text-yellow-600">
        Request a New Survey
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-manrope">
        <div>
          <label className="block font-medium">Location Description</label>
          <input
            {...register("location")}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter description of location"
          />
          {errors.location && (
            <p className="text-red-600 text-sm">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Survey Type</label>
          {/* ------ New dropdown ------ */}
          <select
            {...register("surveyType")}
            className="w-full mt-1 p-2 border rounded bg-white"
          >
            <option value="">Select a survey type</option>
            <option value="Land Survey">Land Survey</option>
            <option value="GIS Mapping">GIS Mapping</option>
            <option value="Boundary Survey">Boundary Survey</option>
            <option value="Topographical Survey">Topographical Survey</option>
            <option value="Subdivision">Subdivision</option>
            <option value="Title Deed Assistance">Title Deed Assistance</option>
          </select>
          {errors.surveyType && (
            <p className="text-red-600 text-sm">{errors.surveyType.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full mt-1 p-2 border rounded"
            rows="4"
            placeholder="Describe the purpose of the survey"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium">Preferred Date</label>
          <input
            {...register("preferredDate")}
            type="date"
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.preferredDate && (
            <p className="text-red-600 text-sm">
              {errors.preferredDate.message}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mt-6 mb-2">Pin Your Location</h3>
          <div
            ref={mapRef}
            className="rounded shadow border"
            style={{ height: "256px", width: "100%" }}
          />
          <p className="text-sm text-gray-600 mt-1">
            <strong>
              Click on the map or use the search to select your property's
              location.
            </strong>
          </p>
          {coords.latitude && (
            <p className="text-green-600 text-sm mt-1">
              <b>Selected Coordinates</b>: {coords.latitude.toFixed(5)},{" "}
              {coords.longitude.toFixed(5)}
            </p>
          )}
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="mt-2 text-sm text-blue-600 underline hover:text-blue-800"
          >
            📍 Use My Current Location
          </button>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>

        {status && (
          <p
            className={`mt-4 font-medium text-sm ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
}
