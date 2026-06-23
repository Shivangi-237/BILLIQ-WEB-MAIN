import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaChartLine, FaUpload, FaHistory,FaUserCircle,FaSignOutAlt } from "react-icons/fa";

function Item({ to, icon, label }) {
  return (
<NavLink
  to={to}
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition group ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
    }`
  }
>
  <span className="inline-flex w-5 justify-center">{icon}</span>
  {open && <span>{label}</span>}
  {!open && (
    <span className="absolute left-16 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
      {label}
    </span>
  )}
</NavLink>

  );
}

export default function Sidebar({ email, onLogout }) {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`border-r bg-white h-screen sticky top-0 transition-all ${open ? "w-60" : "w-16"}`}>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b">
        <button
          onClick={() => setOpen(o => !o)}
          title={open ? "Collapse" : "Expand"}
          className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100"
        >
          <FaBars />
        </button>
        {open && <div className="text-sm font-semibold">BillIQ</div>}
        <div className="w-8" />
      </div>

      {/* Items */}
      <nav className="p-3 space-y-1">
        <Item to="/dashboard" icon={<FaChartLine />} label={open ? "Dashboard" : ""} />
        <Item to="/upload" icon={<FaUpload />}     label={open ? "Upload" : ""} />
        <Item to="/history" icon={<FaHistory />}   label={open ? "History" : ""} />
      </nav>
      <div className={`absolute bottom-0 w-full border-t p-3 bg-white ${open ? "" : "flex flex-col items-center"}`}>
  <div className="flex items-center gap-3">
    <FaUserCircle className="text-3xl text-indigo-600" />
    {open && (
      <div className="flex flex-col">
        <span className="font-semibold text-md text-gray-800">{email || "Anonymous"}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-red-600 mt-1 hover:underline group"
        >
          <FaSignOutAlt className="text-md" />
          Log out
        </button>
      </div>
    )}
    {!open && (
      <button onClick={onLogout} title="Log out" className="text-red-600">
        <FaSignOutAlt className="text-lg" />
      </button>
    )}
  </div>
</div>

    </aside>
  );
}
