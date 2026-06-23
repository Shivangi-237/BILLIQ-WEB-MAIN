import { useState } from "react";
import { login } from "../lib/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !pass) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, pass);
      if (data.token) {
        localStorage.setItem("jwt_token", data.token); // store JWT token
        onLogin({ email }); // notify parent
      } else {
        throw new Error("Login failed: no token received");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Sign in to BillIQ
        </h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg py-2 px-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg py-2 px-3 mb-6"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white rounded-lg py-2 font-semibold hover:bg-indigo-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
