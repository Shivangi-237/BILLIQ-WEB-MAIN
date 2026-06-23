import Sidebar from "./Sidebar";

export default function AppLayout({ children, user, logoutFunction }) {
  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-gray-50">
      <Sidebar email={user?.email} onLogout={logoutFunction} />
      <main className="p-4">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
