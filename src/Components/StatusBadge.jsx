export default function StatusBadge({ status = "PENDING" }) {
  const map = {
    LEGIT:      "bg-green-100 text-green-700",
    SUSPICIOUS: "bg-yellow-100 text-yellow-700",
    DUPLICATE:  "bg-red-100 text-red-700",
    PENDING:    "bg-gray-100 text-gray-700",
  };
  const cls = map[status] || map.PENDING;
  return <span className={`text-xs px-2 py-1 rounded ${cls}`}>{status}</span>;
}
