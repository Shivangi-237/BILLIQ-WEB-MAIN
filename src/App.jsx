import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import AppLayout from "./Components/AppLayout";
import Dashboard from "./Pages/Dashboard";
import Upload from "./Pages/Upload";
import History from "./Pages/History";
import { Toaster } from "react-hot-toast";

// Wrapper
function LoginWithRedirect({ onLogin }) {
  const navigate = useNavigate();
  return <Login onLogin={user => { onLogin(user); navigate("/dashboard"); }} />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: Replace with your real logic to fetch user profile/email
    const token = localStorage.getItem('jwt_token');
    const email = localStorage.getItem('user_email'); // store on login, or fetch from API
    if (token) setUser({ token, email });
    setLoading(false);
  }, []);

  function logoutFunction() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_email");
    setUser(null);
    window.location.href = "/login";
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginWithRedirect onLogin={setUser} />} />
        {user ? (
          <>
            <Route 
              path="/dashboard" 
              element={
                <AppLayout user={user} logoutFunction={logoutFunction}>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route 
              path="/upload" 
              element={
                <AppLayout user={user} logoutFunction={logoutFunction}>
                  <Upload />
                </AppLayout>
              }
            />
            <Route 
              path="/history" 
              element={
                <AppLayout user={user} logoutFunction={logoutFunction}>
                  <History />
                </AppLayout>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
