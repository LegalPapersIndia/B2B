import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

if (data.success) {
  localStorage.setItem('adminToken', data.token);
  window.location.href = '/companies'; // 👈 IMPORTANT
} else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Backend server chal raha hai? Connection check karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">Super Admin Panel</h1>
        <p className="text-center text-gray-500 mb-8">Only for Super Admin</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-semibold text-lg transition"
          >
            {loading ? "Logging in..." : "Login as Super Admin"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Default: superadmin / Admin@123456
        </p>
      </div>
    </div>
  );
}

export default Login;