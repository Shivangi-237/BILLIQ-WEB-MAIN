import {
  FaSearch,
  FaCalendarAlt,
  FaFileInvoice,
  FaFilter,
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import StatusBadge from "../Components/StatusBadge";
import { useState, useEffect } from "react";
import {
  fetchInvoices,
  searchVendors,
  apiDeleteInvoice,
} from "../lib/api";
import InvoiceDetailModal from "../Components/History/InvoiceDetailModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function History() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [vendorSuggestions, setVendorSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewMime, setPreviewMime] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setError("");
    setLoading(true);
    fetchInvoices()
      .then((data) => setRows(data.rows || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rows.filter((r) => {
    const matchesSearch =
      (r.vendor_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.invoice_no || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || r.status === filterStatus;
    const matchesDate =
      (!startDate || new Date(r.uploaded_at) >= new Date(startDate)) &&
      (!endDate || new Date(r.uploaded_at) <= new Date(endDate));
    return matchesSearch && matchesFilter && matchesDate;
  });

  const stats = {
    total: rows.length,
    legit: rows.filter((r) => r.status === "LEGIT").length,
    suspicious: rows.filter((r) => r.status === "SUSPICIOUS").length,
    duplicate: rows.filter((r) => r.status === "DUPLICATE").length,
    pending: rows.filter((r) => r.status === "PENDING").length,
  };

 async function handleDownload(invoiceId) {
  try {
    // Use fetch directly so you can get headers!
    const token = localStorage.getItem("jwt_token");
    const url = `${import.meta.env.VITE_API_BASE}/api/invoices/${invoiceId}/file`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await response.text());

    const mime = response.headers.get("content-type") || "application/octet-stream";
    let filename = "download";
    const disposition = response.headers.get("content-disposition");
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].split(";")[0].replace(/"/g, "");
    } else if (mime.startsWith("image/")) {
      filename += mime.endsWith("png") ? ".png" : ".jpg";
    } else if (mime === "application/pdf") {
      filename += ".pdf";
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(objectUrl);
  } catch (err) {
    alert("Failed to download invoice: " + err.message);
  }
}


async function handlePreview(id) {
  try {
    const token = localStorage.getItem("jwt_token");
    const url = `${import.meta.env.VITE_API_BASE}/api/invoices/${id}/preview`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(await response.text());

    const mime = response.headers.get("content-type") || "application/octet-stream";
    const data = await response.blob();
    const blob = new Blob([data], { type: mime });
    const urlObj = window.URL.createObjectURL(blob);

    // Revoke old previewUrl to avoid memory leaks
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(urlObj);
    setPreviewMime(mime);
    setShowPreview(true);
  } catch (err) {
    alert("Failed to preview invoice: " + err.message);
  }
}



  return (
    <div className="h-[92vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6 overflow-hidden">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-4 rounded-xl relative max-w-[90vw] max-h-[90vh] overflow-auto">
            {/* Header with Close Button */}
            <button
              className="absolute top-2 right-2 text-2xl"
              onClick={() => {
                setShowPreview(false);
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }}
            >
              ×
            </button>

            {/* PDF, Image ya generic embed */}
            {previewMime && previewMime.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "80vw", maxHeight: "70vh" }}
              />
            ) : previewMime === "application/pdf" ? (
              <iframe
                src={previewUrl}
                width="700"
                height="500"
                title="PDF Preview"
              />
            ) : (
              <a href={previewUrl} download>
                Download File
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-1">
              Invoice History
            </h1>
            <p className="text-sm text-slate-500">
              View and manage all uploaded invoices
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FaFileInvoice className="text-indigo-500 text-sm" />
              <p className="text-xs font-medium text-slate-600">Total</p>
            </div>
            <p className="text-2xl font-semibold text-slate-800">
              {stats.total}
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-medium text-emerald-700 mb-1">Legit</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {stats.legit}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-medium text-amber-700 mb-1">
              Suspicious
            </p>
            <p className="text-2xl font-semibold text-amber-700">
              {stats.suspicious}
            </p>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-medium text-rose-700 mb-1">Duplicate</p>
            <p className="text-2xl font-semibold text-rose-700">
              {stats.duplicate}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-700 mb-1">Pending</p>
            <p className="text-2xl font-semibold text-slate-700">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search by vendor or invoice number..."
                value={search}
                onChange={async (e) => {
                  const val = e.target.value;
                  setSearch(val);
                  if (val.length > 1) {
                    try {
                      const results = await searchVendors(val);
                      // Map strings to objects if backend returns array of strings
                      setVendorSuggestions(
                        Array.isArray(results)
                          ? results.map((v) => ({ vendor_name: v }))
                          : []
                      );
                      setShowSuggestions(results && results.length > 0);
                    } catch {
                      setVendorSuggestions([]);
                      setShowSuggestions(false);
                    }
                  } else {
                    setVendorSuggestions([]);
                    setShowSuggestions(false);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay for click
                onFocus={() => {
                  if (vendorSuggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                autoComplete="off"
              />
              {showSuggestions && vendorSuggestions.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {vendorSuggestions.map((v) => (
                    <button
                      key={v.id || v.vendor_name}
                      onMouseDown={() => {
                        setSearch(v.vendor_name);
                        setShowSuggestions(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                    >
                      {v.vendor_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative max-w-xs">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer appearance-none transition-all w-full"
            >
              <option value="ALL">All Status</option>
              <option value="LEGIT">Legit</option>
              <option value="SUSPICIOUS">Suspicious</option>
              <option value="DUPLICATE">Duplicate</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          {/* Date filters */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
            placeholder="Start Date"
            max={endDate}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
            placeholder="End Date"
            min={startDate}
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div
            className={`overflow-x-auto ${
              showAll ? "overflow-y-auto max-h-[400px]" : ""
            }`}
          >
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      <FaCalendarAlt className="text-slate-400 text-xs" />
                      Date
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Vendor
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Invoice No
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Amount
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        {Array(5)
                          .fill(0)
                          .map((_, j) => (
                            <td key={j} className="py-4 px-4">
                              <Skeleton height={20} />
                            </td>
                          ))}
                      </tr>
                    ))
                ) : (showAll ? filtered : filtered.slice(0, 6)).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FaFileInvoice className="text-4xl text-slate-300" />
                        <p className="text-sm text-slate-500">
                          No invoices found
                        </p>
                        <p className="text-xs text-slate-400">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (showAll ? filtered : filtered.slice(0, 6)).map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedInvoiceId(r.id)}
                    >
                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-medium">
                          {r.uploaded_at
                            ? new Date(r.uploaded_at).toLocaleString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-indigo-600">
                              {(r.vendor_name || "").charAt(0)}
                            </span>
                          </div>
                          <span className="text-slate-800 font-medium">
                            {r.vendor_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-600 text-xs bg-slate-100 px-2 py-1 rounded">
                          {r.invoice_no}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-semibold">
                          ₹ {Number(r.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            style={{ minWidth: 92, display: "inline-block" }}
                          >
                            <StatusBadge status={r.status} />
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(r.id);
                            }}
                            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none"
                            title="Download Invoice"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaDownload className="text-xl" />
                          </button>
                          <button
  onClick={() => handlePreview(r.id)}
  className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none"
  title="Preview Invoice"
>
  <FaFileInvoice className="text-xl" />
</button>


                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (
                                !window.confirm(
                                  "Are you sure to delete this invoice?"
                                )
                              )
                                return;
                              try {
                                await apiDeleteInvoice(r.id); // You need to implement this in your API helper
                                setRows(rows.filter((row) => row.id !== r.id));
                              } catch (error) {
                                alert("Delete failed: " + error.message);
                              }
                            }}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none"
                            title="Delete Invoice"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaTrash className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {!showAll && filtered.length > 6 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-medium rounded-b-xl"
              >
                Show more history
              </button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <p>
              Showing {filtered.length} of {rows.length} invoices
            </p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Modal for viewing invoice detail and updating status */}
      <InvoiceDetailModal
        id={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        onStatusUpdate={(updated) => {
          setRows((rows) =>
            rows.map((r) =>
              r.id === updated.id ? { ...r, status: updated.status } : r
            )
          );
        }}
      />
    </div>
  );
}
