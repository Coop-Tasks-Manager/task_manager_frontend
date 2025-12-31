import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Shield, User, ChevronRight, ArrowRight, LayoutGrid , X} from 'lucide-react';
import Sidebar from '../components/Sidebar'; 

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const fetchTeams = async () => {
    const res = await fetch( `${process.env.REACT_APP_API_URL}/teams`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setTeams(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const res = await fetch( `${process.env.REACT_APP_API_URL}/teams`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ name: teamName })
    });
    if (res.ok) {
      setShowCreateModal(false);
      fetchTeams();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans">
      <Sidebar activePage="teams" />
      <main className="flex-1 md:ml-64 p-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#1e293b]">My Teams</h1>
            <p className="text-gray-400 font-medium text-sm">Select a team to view boards and tasks</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#00b274] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-green-100 flex items-center gap-2 hover:bg-[#009a63] transition-all"
          >
            <Plus size={18} /> Create New Team
          </button>
        </div>

        {/* Teams Display */}
        {teams.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
              <Users size={40} />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b] mb-2">No Teams Found</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
              You aren't a member of any team yet. Create one to start a project or wait for an invitation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00b274] mx-auto"></div>
          </div>
        ) : teams.map(team => (
          <div 
            key={team.id} 
            onClick={() => {
              console.log("Team object clicked:", team); // Check the console to see if 'id' exists
              if (team.id) {
                navigate(`/teams/${team.id}/boards`);
              } else {
                alert("Error: This team has no ID in the database.");
              }
            }}
>
            {/* Top Row: Icon & ROLE BADGE */}
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-green-50 rounded-2xl text-[#00b274] group-hover:bg-[#00b274] group-hover:text-white transition-colors duration-300">
                <Users size={28} />
              </div>

              {/* DYNAMIC ROLE BADGE */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                team.role === 'leader' 
                ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
                {team.role === 'leader' ? <Shield size={12} fill="currentColor" fillOpacity={0.2} /> : <User size={12} />}
                {team.role}
              </div>
            </div>

            {/* Team Info */}

            <h3 className="text-xl font-black text-[#1e293b] mb-2">{team.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Role: {team.my_role}</p>
                <button 
                  onClick={() => navigate(`/team/${team.id}/boards`)}
                  className="w-full py-4 bg-gray-50 text-[#1e293b] rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-[#1e293b] hover:text-white transition-all"
                >
                  View Boards <ArrowRight size={14} />
                </button>
            
            




          </div>
        ))}
      </div>
        )}
      </main>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 text-gray-400"><X size={20}/></button>
            <h3 className="text-2xl font-black mb-2">New Team</h3>
            <p className="text-gray-400 text-sm mb-8">Start a new collaboration space.</p>
            <form onSubmit={handleCreateTeam} className="space-y-6">
              <input 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold border border-transparent focus:border-[#00b274] transition-all"
                placeholder="Team Name (e.g., Marketing Squad)"
                required
                onChange={e => setTeamName(e.target.value)}
              />
              <button type="submit" className="w-full py-4 bg-[#00b274] text-white rounded-2xl font-black shadow-lg">Confirm & Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;