import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchInvoiceDetail, updateInvoiceStatus } from "../../lib/api";

export default function InvoiceDetailModal({ id, onClose ,onStatusUpdate}) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchInvoiceDetail(id)
      .then((res) => {
        setData(res.invoice); // Only the invoice object, not the whole response
        setStatus(res.invoice.status);
      })
      .catch(() => setData(null));
  }, [id]);

  if (!id) return null;

 const handleStatusChange = async (newStatus) => {
  if (newStatus === status) return;
  setUpdatingStatus(true);
  try {
    const res = await updateInvoiceStatus(id, newStatus);
    setStatus(res.updated.status);
    setData(res.updated);
    if (typeof onStatusUpdate === 'function') onStatusUpdate(res.updated);
    toast.success(
      newStatus === "LEGIT"
        ? "Invoice marked as LEGIT"
        : newStatus === "SUSPICIOUS"
        ? "⚠️ Invoice marked as SUSPICIOUS"
        : newStatus === "REVIEW"
        ? "🔍 Invoice marked for REVIEW"
        : newStatus === "DUPLICATE"
        ? "🔁 Invoice marked as DUPLICATE"
        : newStatus === "PENDING"
        ? "⏳ Invoice marked as PENDING"
        : "ℹ️ Status updated"
    );
  } catch {
    toast.error("Update failed");
  } finally {
    setUpdatingStatus(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4">Invoice Details</h3>
        {!data ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            <p>
              <b>Invoice No:</b> {data.invoice_no}
            </p>
            <p>
              <b>Vendor:</b> {data.vendor_name}
            </p>
            <p>
              <b>Amount:</b> ₹ {data.amount}
            </p>
            <p>
              <b>GST No:</b> {data.gst_no}
            </p>
            <p>
              <b>Status:</b>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="ml-2 border rounded px-2 py-1"
              >
                <option value="PENDING">PENDING</option>
                <option value="LEGIT">LEGIT</option>
                <option value="SUSPICIOUS">SUSPICIOUS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="DUPLICATE">DUPLICATE</option>
                
              </select>
            </p>
            <p>
              <b>Uploaded At:</b>{" "}
              {data && data.uploaded_at
                ? new Date(data.uploaded_at).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "-"}
            </p>

            <p>
              <b>File Type:</b> {data.file_type}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
