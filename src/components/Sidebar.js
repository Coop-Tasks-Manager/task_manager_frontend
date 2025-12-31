import { LogOut, LayoutGrid, Users, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full z-20">
      <div className="p-8 flex items-center gap-2 font-black text-[#00b274] text-2xl tracking-tighter">
        <div className="w-8 h-8 bg-[#00b274] rounded-lg flex items-center justify-center text-white text-sm">T</div>
        TTM
      </div>
      <nav className="flex-1 px-6 space-y-2 mt-4">
        <div 
          onClick={() => navigate('/teams')}
          className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${activePage === 'teams' ? 'bg-green-50 text-[#00b274] font-bold' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <Users size={18} /> <span className="text-sm">My Teams</span>
        </div>
        <div 
  onClick={() => navigate('/settings')}
  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
    activePage === 'settings' ? 'bg-green-50 text-[#00b274] font-bold' : 'text-gray-400 hover:bg-gray-50'
  }`}
>
  <SettingsIcon size={18} /> <span className="text-sm">Settings</span>
</div>
      </nav>
      <div className="p-6 border-t border-gray-50">
        <button 
           onClick={() => { localStorage.clear(); window.location.href="/login"; }}
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={18} /> <span className="text-sm font-bold">Logout</span>

        </button>
      </div>
    </aside>
  );
};

export default Sidebar;