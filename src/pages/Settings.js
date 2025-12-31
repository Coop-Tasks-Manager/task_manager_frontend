import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Save, Camera, Lock } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || {};
    setFormData(prev => ({ ...prev, name: savedUser.name || '', email: savedUser.email || '' }));
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match!' });
    }
    
    setStatus({ type: 'loading', message: 'Updating Password...' });
    try {
      const res = await fetch('http://localhost:5000/api/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          currentPassword: formData.currentPassword, 
          newPassword: formData.newPassword 
        })
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Password changed successfully!' });
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.message || 'Update failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection error.' });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activePage="settings" />
      
      <main className="flex-1 md:ml-64 p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black text-[#1e293b] tracking-tight">Settings</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your account and security.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Settings Navigation */}
            <div className="space-y-2">
              <button 
                onClick={() => { setActiveTab('profile'); setStatus({type:'', message:''}); }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-white border border-gray-100 text-[#00b274] shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <User size={18} /> Profile
              </button>
              <button 
                onClick={() => { setActiveTab('security'); setStatus({type:'', message:''}); }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'security' ? 'bg-white border border-gray-100 text-[#00b274] shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Shield size={18} /> Security
              </button>
            </div>

            {/* Right: Forms Container */}
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                
                {status.message && (
                  <div className={`p-4 mb-6 rounded-2xl text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-green-50 text-[#00b274]' : 'bg-red-50 text-red-500'}`}>
                    {status.message}
                  </div>
                )}

                {activeTab === 'profile' ? (
                  /* Profile Form (Previously provided) */
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <h3 className="text-xl font-black text-[#1e293b] mb-6">Profile Details</h3>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                           <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#00b274] outline-none font-bold text-[#1e293b]" />
                        </div>
                        <button className="w-full py-4 bg-[#00b274] text-white rounded-2xl font-black shadow-lg shadow-green-100 uppercase tracking-widest text-xs">Save Profile</button>
                     </div>
                  </div>
                ) : (
                  /* NEW: Security Form */
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-xl font-black text-[#1e293b] mb-2 flex items-center gap-2">
                      <Lock size={20} className="text-[#00b274]" /> Change Password
                    </h3>
                    <p className="text-sm text-gray-400 mb-8 font-medium">Keep your account secure with a strong password.</p>
                    
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
                        <input 
                          type="password"
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#00b274] outline-none font-bold text-[#1e293b]"
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                          <input 
                            type="password"
                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#00b274] outline-none font-bold text-[#1e293b]"
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
                          <input 
                            type="password"
                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#00b274] outline-none font-bold text-[#1e293b]"
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full py-4 bg-[#1e293b] text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all uppercase tracking-widest text-xs">
                        Update Password
                      </button>
                    </form>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;