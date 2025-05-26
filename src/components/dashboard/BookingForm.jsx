import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix default marker icons using ESModule imports
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
      await axios.post("http://localhost:5000/api/bookings", {
        ...data,
        email: userEmail,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setStatus({ type: "success", msg: "Booking submitted successfully." });
      reset();
      setCoords({ latitude: null, longitude: null });
      onNewBooking?.(); // Refresh booking list
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to submit booking.",
      });
    }
  };

  useEffect(() => {
    const map = L.map("booking-map", {
      center: [-1.2921, 36.8219],
      zoom: 7,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    let marker;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ latitude: lat, longitude: lng });

      if (marker) marker.remove();

      marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("Selected Location")
        .openPopup();
    });

    // Resize observer (fix for hidden map on page load)
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => map.remove(); // Cleanup
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4 font-poppins text-yellow-600">Request a New Survey</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-manrope">
        {/* Location Text */}
        <div>
          <label className="block font-medium">Location Description</label>
          <input
            {...register("location")}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter description of location"
          />
          {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
        </div>

        {/* Survey Type */}
        <div>
          <label className="block font-medium">Survey Type</label>
          <input
            {...register("surveyType")}
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g., Topographical, Boundary"
          />
          {errors.surveyType && (
            <p className="text-red-600 text-sm">{errors.surveyType.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full mt-1 p-2 border rounded"
            rows="4"
            placeholder="Describe the purpose of the survey"
          ></textarea>
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium">Preferred Date</label>
          <input
            {...register("preferredDate")}
            type="date"
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.preferredDate && (
            <p className="text-red-600 text-sm">{errors.preferredDate.message}</p>
          )}
        </div>

        {/* Map Area */}
        <div>
          <h3 className="font-semibold mt-6 mb-2">Pin Your Location</h3>
          <div
            id="booking-map"
            className="h-64 w-full rounded shadow border"
          ></div>
          <p className="text-sm text-gray-600 mt-1">
            Click on the map to pin the exact location of your property.
          </p>
          {coords.latitude && (
            <p className="text-green-600 text-sm mt-1">
              Selected Coordinates: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>

        {/* Status Message */}
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
