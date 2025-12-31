import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; // npm install lucide-react

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-[#1e293b]">
      {/* Logo and Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#00b274] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">TTM</h1>
        </div>
        <h2 className="text-4xl font-semibold mb-2">Welcome Back</h2>
        <p className="mt-8 text-center text-sm font-bold text-gray-400">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-[#00b274] hover:underline transition-all"
          >
            Create Account
          </Link>
      </p>
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00b274] focus:border-transparent outline-none transition"
              placeholder="name@company.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00b274] focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#00b274] focus:ring-[#00b274]"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-[#00b274] font-medium hover:underline">
              Forgot Password
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#00b274] text-white py-3 rounded-lg font-semibold hover:bg-[#009a63] transition-colors shadow-md shadow-green-100"
          >
            Sign In
          </button>
        </form>

        {/* Social Login Separator */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">Sign in with your social network.</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded-lg text-gray-700 text-sm font-medium transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> 
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded-lg text-gray-700 text-sm font-medium transition">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" alt="Facebook" /> 
              Facebook
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
}

export default Login;