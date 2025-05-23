const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function BookingsTable({ bookings = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-6">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Survey Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center px-6 py-4 text-sm text-gray-500">
                No bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.surveyType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {new Date(booking.preferredDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[booking.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
