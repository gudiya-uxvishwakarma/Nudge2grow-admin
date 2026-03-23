import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import logo from '../../assets/logo.jpeg';

function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  if (localStorage.getItem('token')) {
    return <Navigate to="/admin/grade" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('adminToken', data.token);

      navigate('/admin/grade', { replace: true });
    } catch {
      setError('Server not reachable. Make sure backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Top Section */}
          <div className="bg-[#00bf62] px-10 py-10 text-center">
            <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto mb-5 border-4 border-white/40 shadow-xl bg-white flex items-center justify-center">
              <img src={logo} alt="Nudge2Grow logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white">Nudge2Grow</h1>
            <p className="text-white/80 text-base mt-1">Admin Panel</p>
          </div>

          {/* Form Section */}
          <div className="px-10 py-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
            <p className="text-gray-500 text-base mb-7">Sign in to your admin account</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#00bf62] focus:ring-4 focus:ring-[#00bf62]/10 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-11 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#00bf62] focus:ring-4 focus:ring-[#00bf62]/10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-base">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="w-4 h-4 accent-[#00bf62]" />
                  Remember me
                </label>
                <a href="#" className="text-[#00bf62] font-medium hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00bf62] hover:bg-[#00a855] text-white py-3.5 rounded-xl font-semibold text-base transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>

            </form>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 Nudge2Grow. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;