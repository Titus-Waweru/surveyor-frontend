import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";

const bookingSchema = z.object({
  location: z.string().min(3, "Location is required"),
  surveyType: z.string().min(3, "Survey type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  preferredDate: z.string().min(1, "Preferred date is required"),
});

export default function BookingForm({ userEmail, onNewBooking }) {
  const [status, setStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        ...data,
        email: userEmail,
      });
      setStatus({ type: "success", msg: "Booking submitted successfully." });
      reset();
      onNewBooking?.(); // refresh bookings
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to submit booking.",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Request a New Survey</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Location</label>
          <input
            {...register("location")}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter survey location"
          />
          {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Survey Type</label>
          <input
            {...register("surveyType")}
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g., Topographical, Boundary"
          />
          {errors.surveyType && <p className="text-red-600 text-sm">{errors.surveyType.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full mt-1 p-2 border rounded"
            rows="4"
            placeholder="Describe the purpose of the survey"
          ></textarea>
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Preferred Date</label>
          <input
            {...register("preferredDate")}
            type="date"
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.preferredDate && <p className="text-red-600 text-sm">{errors.preferredDate.message}</p>}
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
