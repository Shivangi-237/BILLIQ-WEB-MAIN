// lib/api.js

const API_BASE = import.meta.env.VITE_API_BASE;

// --- Core Wrapper ---
async function apiFetch(
  path,
  {
    method = "GET",
    body,
    headers = {},
    contentType = "application/json",
    ...rest
  } = {}
) {
  const token = localStorage.getItem("jwt_token");
  const allHeaders = {
    ...(contentType ? { "Content-Type": contentType } : {}),
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = path.startsWith("/")
    ? `${API_BASE}${path}`
    : `${API_BASE}/${path}`;

  const options = {
    method,
    headers: allHeaders,
    ...(body && contentType !== "application/json" ? { body } : {}),
    ...(body && contentType === "application/json"
      ? { body: JSON.stringify(body) }
      : {}),
    ...rest,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 401)
      throw new Error("Unauthorized - Please login again");
    throw new Error(await response.text());
  }
  try {
    return await response.json();
  } catch {
    return {};
  }
}

// --- Auth ---
export function login(email, password) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
    contentType: "application/json",
    headers: {},
  });
}

// --- Invoice Upload (with metadata) ---
export function uploadInvoice({ file, ...meta }) {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(meta || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  return apiFetch("/api/invoices/upload", {
    method: "POST",
    body: formData,
    contentType: null, // Let browser set multipart/form-data boundary
  });
}

// --- Get Invoice List (with filters, pagination, etc.) ---
export function fetchInvoices(params = {}) {
  const query = Object.entries(params)
    .filter(([, val]) => val !== undefined && val !== null)
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join("&");
  const path = query ? `/api/invoices?${query}` : "/api/invoices";
  return apiFetch(path, { method: "GET" });
}

// --- Analytics/Dashboard ---
export function fetchAnalyticsSummary() {
  return apiFetch("/api/invoices/analytics/summary", { method: "GET" });
}

// Fetch a single invoice by id
export function fetchInvoiceDetail(id) {
  return apiFetch(`/api/invoices/${id}`, { method: "GET" });
}

// Update status of a single invoice
export function updateInvoiceStatus(id, status) {
  return apiFetch(`/api/invoices/${id}/status`, {
    method: "PATCH",
    body: { status },
    contentType: "application/json",
  });
}

export function fetchTrend(params = {}) {
  const query = Object.entries(params)
    .filter(([, val]) => val !== undefined && val !== null)
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join("&");
  const path = query
    ? `/api/invoices/analytics/trend?${query}`
    : "/api/invoices/analytics/trend";
  return apiFetch(path, { method: "GET" });
}

export function fetchRecent(params = {}) {
  const query = Object.entries(params)
    .filter(([, val]) => val !== undefined && val !== null)
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join("&");
  const path = query ? `/api/invoices/recent?${query}` : "/api/invoices/recent";
  return apiFetch(path, { method: "GET" });
}

//donwload invoice file by id
export async function downloadInvoiceFile(id) {
  const token = localStorage.getItem("jwt_token");
  const url = `${API_BASE}/api/invoices/${id}/file`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());

  const disposition = response.headers.get("content-disposition");
  let filename = "invoice.pdf";
  if (disposition && disposition.includes("filename=")) {
    filename = disposition
      .split("filename=")[1]
      .split(";")[0]
      .replace(/"/g, "");
  }
  const blob = await response.blob();
  return { blob, filename };
}


//search vendors
export function searchVendors(q) {
  const query = encodeURIComponent(q);
  return apiFetch(`/api/vendors/search?q=${query}`, { method: "GET" });
}

// Admin utility: Delete invoices/vendors before a given date
export function cleanupOldVendors(beforeDate) {
  const q = encodeURIComponent(beforeDate);
  return apiFetch(`/api/vendors/cleanup?before=${q}`, { method: "DELETE" });
}

//delete invoice by id
export async function apiDeleteInvoice(id) {
  const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function previewInvoiceFile(id) {
  const token = localStorage.getItem("jwt_token");
  const url = `${API_BASE}/api/invoices/${id}/preview`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());

  const mime = response.headers.get("content-type") || "application/octet-stream";
  const data = await response.blob();
  const blob = new Blob([data], { type: mime });

  return { blob, mime };
}





// --- Health/Debug (no JWT needed) ---
export function health() {
  return apiFetch("/health", { method: "GET" });
}
export function healthDb() {
  return apiFetch("/healthdb", { method: "GET" });
}
export function debugTest() {
  return apiFetch("/debugtest", { method: "GET" });
}
export function debugPool() {
  return apiFetch("/debugpool", { method: "GET" });
}
