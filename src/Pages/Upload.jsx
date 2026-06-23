import { useState } from "react";
import { uploadInvoice } from "../lib/api";
import { useNavigate } from "react-router-dom";

import {
  FaCloudUploadAlt,
  FaFileInvoice,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowRight,
  FaArrowLeft,
  FaHistory,
  FaFilePdf,
  FaFileImage,
} from "react-icons/fa";
import Stepper from "../components/Stepper";

const ACCEPT = [".pdf", ".png", ".jpg", ".jpeg"];
const MAX_MB = 10;

export default function Upload() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const onSelect = (f) => {
    setError("");
    setResult(null);
    if (!f) return setFile(null);
    const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPT.includes(ext)) return setError("Allowed: PDF/JPG/PNG only");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`Max ${MAX_MB} MB`);
    setFile(f);
  };

  const onStart = async () => {
    if (!file) return setError("Please choose a file");
    setStep(2);
    setLoading(true);
    setError("");
    try {
      const data = await uploadInvoice({ file }); // only file
      setResult(data);
      setStep(3);
    } catch (e) {
      setError(e.message || "Failed to process upload");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  const getFileIcon = () => {
    if (!file) return FaFileInvoice;
    const ext = file.name.split(".").pop()?.toLowerCase();
    return ext === "pdf" ? FaFilePdf : FaFileImage;
  };

  const FileIcon = getFileIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Stepper step={step} />

        {step === 1 && (
          <div className="grid lg:grid-cols-5 gap-6 items-start max-h-[calc(100vh-200px)]">
            {/* Upload Area - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-indigo-400 bg-indigo-50/50 scale-[1.02]"
                    : file
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="space-y-5">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center">
                      <FaCloudUploadAlt className="text-4xl text-indigo-500" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-1">
                      {dragActive ? "Drop it here!" : "Upload Your Invoice"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Drag & drop your file or click to browse
                    </p>
                  </div>

                  <label className="inline-block">
                    <input
                      type="file"
                      accept={ACCEPT.join(",")}
                      onChange={(e) => onSelect(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <span className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm rounded-xl hover:from-indigo-600 hover:to-indigo-700 cursor-pointer inline-flex items-center gap-2 font-medium shadow-sm hover:shadow transition-all duration-300">
                      <FaFileInvoice />
                      Choose File
                    </span>
                  </label>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">
                      PDF
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">
                      PNG
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">
                      JPG
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Max {MAX_MB}MB</span>
                  </div>
                </div>
              </div>

              {file && (
                <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileIcon className="text-xl text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-0.5">
                        Selected File
                      </p>
                      <p className="font-medium text-slate-800 text-sm truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <FaCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 animate-fadeIn">
                  <FaTimesCircle className="text-red-500 text-lg flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={onStart}
                disabled={!file || loading}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  file
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start Processing
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </div>

            {/* Info Panel - Takes 2 columns */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white space-y-5 shadow-lg">
              <div>
                <h3 className="text-lg font-semibold mb-1">How it works</h3>
                <p className="text-sm text-slate-300">
                  AI-powered extraction from your invoices
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: FaCloudUploadAlt,
                    title: "Upload Invoice",
                    desc: "PDF, PNG, or JPG files",
                  },
                  {
                    icon: FaSpinner,
                    title: "AI Processing",
                    desc: "Extract vendor, amount & date",
                  },
                  {
                    icon: FaCheckCircle,
                    title: "Get Results",
                    desc: "Review & detect duplicates",
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex gap-3 items-start bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10"
                    >
                      <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="text-base text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-0.5">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Format:</strong> PDF, PNG, JPG,
                  JPEG • <strong className="text-white">Size:</strong> Up to
                  10MB
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
              <div className="flex justify-center mb-5">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center">
                  <FaSpinner className="text-4xl text-indigo-500 animate-spin" />
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Processing Your Invoice
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                AI is extracting key fields from your document
              </p>

              <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-progress" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {["Invoice Number", "Vendor Name", "Amount", "Date"].map(
                  (field, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-3 text-left"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                        Extracting {field}...
                      </div>
                    </div>
                  )
                )}
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setLoading(false);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-medium transition-all inline-flex items-center gap-2 text-slate-700"
              >
                <FaArrowLeft className="text-xs" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaCheckCircle className="text-4xl" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-1">
                  Processing Complete!
                </h2>
                <p className="text-sm text-emerald-100">
                  Successfully extracted invoice data
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Extracted Information
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-medium text-emerald-700">
                      {Math.round(result.confidence * 100)}% Confidence
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(result?.fields || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200"
                    >
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-base font-semibold text-slate-800">
                        {key === "amount"
                          ? `₹ ${value.toLocaleString()}`
                          : value}
                      </p>
                      {key === "status" && (
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium mt-2 ${
                            value === "LEGIT"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              value === "LEGIT"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-800 font-medium mb-2">
                    Raw JSON Response
                  </p>
                  <pre className="text-xs bg-white p-3 rounded-lg overflow-x-auto text-slate-700 border border-blue-100">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setResult(null);
                      setFile(null);
                      setStep(1);
                    }}
                    className="flex-1 px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-medium text-sm transition-all inline-flex items-center justify-center gap-2 text-slate-700"
                  >
                    <FaArrowLeft className="text-xs" />
                    Upload Another
                  </button>
                  <button
                    onClick={() => navigate("/history")}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 font-medium text-sm transition-all inline-flex items-center justify-center gap-2 shadow-sm hover:shadow"
                  >
                    View History
                    <FaHistory className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 20%;
          }
          50% {
            width: 60%;
          }
          100% {
            width: 20%;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
