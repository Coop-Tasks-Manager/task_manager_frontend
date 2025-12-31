import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success: Redirect to login
      navigate('/login', { state: { message: "Account created! Please log in." } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-10 relative overflow-hidden">
        
        {/* Logo Decor */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-[#00b274] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-green-100">
            T
          </div>
        </div>

        <h2 className="text-3xl font-black text-[#1e293b] text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-center text-sm font-medium mb-8">Join TTM and start managing your team.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" name="name" placeholder="Full Name" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold border border-transparent focus:border-[#00b274] transition-all"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="email" name="email" placeholder="Email Address" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold border border-transparent focus:border-[#00b274] transition-all"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="password" name="password" placeholder="Password" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold border border-transparent focus:border-[#00b274] transition-all"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="password" name="confirmPassword" placeholder="Confirm Password" required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold border border-transparent focus:border-[#00b274] transition-all"
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-[#00b274] text-white rounded-2xl font-black shadow-lg shadow-green-100 flex items-center justify-center gap-2 hover:bg-[#009a63] transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Registering..." : "Get Started"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-gray-400">
          Already have an account? <Link to="/login" className="text-[#00b274] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;