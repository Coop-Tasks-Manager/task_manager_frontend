import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; 
import api from "../services/api";



const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  //const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {   
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
      {/* TTM Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-10 h-10 bg-[#00b274] rounded-lg flex items-center justify-center text-white font-black text-xl mb-4 shadow-sm">
          T
        </div>
        <h1 className="text-4xl font-black text-[#1e293b] mb-2 tracking-tight">Join TTM</h1>
        <p className="text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00b274] font-bold hover:underline">Sign In</Link>
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white w-full max-w-[450px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-gray-50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name <span className="text-red-500">*</span></label>
            
             <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b274]/20 focus:border-[#00b274] outline-none transition-all placeholder:text-gray-300 text-sm"

            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email <span className="text-red-500">*</span></label>

            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b274]/20 focus:border-[#00b274] outline-none transition-all placeholder:text-gray-300 text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b274]/20 focus:border-[#00b274] outline-none transition-all text-sm"
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

          {/* Sign Up Button */}
          <button type="submit" className="w-full py-4 bg-[#00b274] text-white rounded-xl font-bold text-md shadow-lg shadow-green-100 hover:bg-[#009a63] transition-all transform active:scale-[0.98] mt-4">
            Create Account
          </button>

        </form>

        {/* Social Login Separator */}
        <div className="mt-10 mb-8 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-gray-400">
            <span className="bg-white px-4">Sign up with social network</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#f8fafc] border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-sm font-bold text-gray-600">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#f8fafc] border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-sm font-bold text-gray-600">
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" alt="Facebook" /> Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;