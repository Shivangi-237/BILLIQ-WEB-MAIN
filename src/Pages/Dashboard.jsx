import Card from "../components/Card";
import { Link } from "react-router-dom";
import { fetchAnalyticsSummary, fetchTrend, fetchRecent } from "../lib/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaFileInvoiceDollar,
  FaCopy,
  FaExclamationTriangle,
  FaDollarSign,
  FaCalendarAlt,
  FaBuilding,
  FaFileAlt,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";

export default function Dashboard() {
  const [kpis, setKpis] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [kpisLoading, setKpisLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    setTrendLoading(true);
    setRecentLoading(true);
    setError("");
    fetchTrend({ period: selectedPeriod })
      .then((data) => setTrend(data.rows || data))
      .catch((e) => setError(e.message))
      .finally(() => setTrendLoading(false));
    fetchRecent({ limit: 5 })
      .then((data) => setRecent(data.rows || data))
      .catch((e) => setError(e.message))
      .finally(() => setRecentLoading(false));
  }, [selectedPeriod]);

  useEffect(() => {
    setKpisLoading(true);
    setError("");
    fetchAnalyticsSummary()
      .then((data) => {
        const summary = data.summary || {};
        setKpis([
          {
            title: "Total",
            value: summary.total || 0,
            icon: FaFileInvoiceDollar,
            color: "indigo",
          },
          {
            title: "Legit",
            value: summary.legit_count || 0,
            icon: FaCheckCircle,
            color: "green",
          },
          {
            title: "Duplicate",
            value: summary.duplicate_groups || 0,
            icon: FaCopy,
            color: "red",
          },
          {
            title: "Suspicious",
            value: summary.suspicious || 0,
            icon: FaExclamationTriangle,
            color: "yellow",
          },
          {
            title: "Average Amount",
            value: summary.avg_amount || 0,
            icon: FaDollarSign,
            color: "indigo",
          },
          {
            title: "Pending",
            value: summary.status_counts?.PENDING || 0,
            icon: FaFileAlt,
            color: "yellow",
          },
        ]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setKpisLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-600 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Monitor your invoice analytics in real-time
            </p>
          </div>
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm flex items-center gap-2 group"
          >
            <span>Home</span>
            <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {kpisLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white min-w-[140px] h-[140px] flex flex-col items-center"
                  >
                    <Skeleton circle height={40} width={40} className="mb-2" />
                    <Skeleton height={30} width={40} />
                    <Skeleton height={18} width={60} />
                  </div>
                ))
            : kpis.map((k) => <Card key={k.title} {...k} />)}
        </div>

        {/* Trend Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaFileInvoiceDollar className="text-indigo-600" />
                Invoice Trends
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Last 6 months performance overview
              </p>
            </div>
            <div className="flex gap-2">
              {["3m", "6m", "1y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedPeriod === period
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            {trendLoading ? (
              <Skeleton height="100%" width="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: "13px", fontWeight: "500" }}
                    tickMargin={10}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#9ca3af"
                    style={{ fontSize: "13px", fontWeight: "500" }}
                    tickMargin={10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#111827" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 6 }}
                    activeDot={{
                      r: 8,
                      fill: "#4f46e5",
                      strokeWidth: 3,
                      stroke: "#fff",
                    }}
                    fill="url(#colorCount)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaFileAlt className="text-indigo-600" />
                Recent Uploads
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Your latest invoice submissions
              </p>
            </div>
            <Link
              to="/history"
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold group"
            >
              View all
              <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500" />
                      Date
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-gray-500" />
                      Vendor
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-gray-500" />
                      Invoice No
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-gray-500" />
                      Amount
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLoading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i}>
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <td key={j} className="py-4 px-6">
                                <Skeleton
                                  height={18}
                                  width={j === 1 ? 100 : 60}
                                />
                              </td>
                            ))}
                        </tr>
                      ))
                  : recent.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all duration-200 group"
                      >
                        <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                          {r.uploaded_at
                            ? new Date(r.uploaded_at).toLocaleString("en-IN")
                            : "-"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl ...">
                              <span className="text-indigo-700 font-bold text-base">
                                {r.vendor_name?.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {r.vendor_name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 font-mono font-semibold">
                          {r.invoice_no}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-900">
                           ₹ {" "}
                          {r.amount == null
                            ? "—"
                            : r.amount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                              r.status === "LEGIT"
                                ? "bg-green-50 text-green-700 border-2 border-green-200"
                                : r.status === "SUSPICIOUS"
                                ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200"
                                : "bg-red-50 text-red-700 border-2 border-red-200"
                            }`}
                          >
                            {r.status === "LEGIT" && <FaCheckCircle />}
                            {r.status === "SUSPICIOUS" && (
                              <FaExclamationTriangle />
                            )}
                            {r.status === "DUPLICATE" && <FaCopy />}
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
