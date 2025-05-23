const stats = [
  { title: "Total Bookings", value: 128, color: "bg-indigo-500" },
  { title: "Active Surveyors", value: 34, color: "bg-green-500" },
  { title: "Registered Clients", value: 76, color: "bg-blue-500" },
  { title: "Pending Requests", value: 9, color: "bg-yellow-500" },
];

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className={`rounded-lg shadow p-6 text-white ${item.color}`}
        >
          <h3 className="text-sm font-medium mb-2">{item.title}</h3>
          <p className="text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
