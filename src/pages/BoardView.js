import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Search, Bell, Users, ChevronRight, 
  CheckCircle2, ArrowLeft, Plus, UserPlus, MoreVertical, LayoutGrid, Calendar, AlertCircle
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const FullDashboard = () => {
  const { boardId } = useParams(); // Gets '4' from the URL /dashboard/4
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Tasks for the specific Board
  useEffect(() => {
    const fetchBoardData = async () => {
      if (!user || !boardId) return;

      const token = localStorage.getItem("token");
      try {
        setLoading(true);
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch tasks for the board (Example: http://localhost:5000/api/tasks/4)
        const res = await fetch(`http://localhost:5000/api/tasks/${boardId}`, { headers });
        
        if (!res.ok) throw new Error("Could not retrieve tasks for this board.");
        
        const data = await res.json();
        
        // Handling the flat array response you provided
        setProjects(Array.isArray(data) ? data : []);
        
        // NOTE: Since the task list usually doesn't return the user's role, 
        // you may need a separate "role check" endpoint or include it in the board response.
        // For now, we simulate this logic:
        setRole(user.role || 'leader'); 

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, user]);

  // 2. Update Status Logic (Member & Leader)
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Optimistic UI update
        setProjects(prev => prev.map(p => p.id === taskId ? { ...p, status: newStatus } : p));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const isLeader = role === 'leader';

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00b274] rounded-md flex items-center justify-center text-white font-bold">D</div>
          <span className="text-xl font-bold tracking-tight">Dasher</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem icon={<LayoutGrid size={18}/>} label="My Teams" onClick={() => navigate('/')} />
          <NavItem icon={<Briefcase size={18}/>} label="Board Tasks" active />
        </nav>

        <div className="p-6 border-t border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#00b274] font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{role}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 flex flex-col">
        
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-lg">Board Workflow</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* 👑 LEADER ONLY ACTIONS */}
            {isLeader && (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-gray-500 hover:text-[#00b274] px-3 py-2 rounded-lg text-xs font-bold transition">
                  <UserPlus size={16} /> Invite
                </button>
                <button className="bg-[#00b274] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-green-100 hover:bg-[#009a63] transition">
                  <Plus size={16} /> New Task
                </button>
              </div>
            )}
            <div className="h-8 w-[1px] bg-gray-100 mx-2" />
            <Bell size={20} className="text-gray-500 cursor-pointer hover:text-[#00b274]" />
          </div>
        </header>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* TASKS TABLE */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">Board Tasks</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      {isLeader ? "Full Team Control" : "Assigned to Me"}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-400 font-bold">
                    ID: #{boardId}
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-[0.15em] font-bold">
                      <tr>
                        <th className="px-6 py-4">Task Details</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr><td colSpan="4" className="p-20 text-center animate-pulse text-gray-400 font-bold tracking-widest uppercase">Syncing...</td></tr>
                      ) : projects.length > 0 ? (
                        projects.map(p => (
                          <ProjectRow 
                            key={p.id} 
                            project={p} 
                            onStatusChange={handleStatusUpdate}
                          />
                        ))
                      ) : (
                        <tr><td colSpan="4" className="p-20 text-center text-gray-400">No tasks found on this board.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SIDEBAR STATS */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-[#00b274] mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-5xl font-black text-[#1e293b] mb-1">{projects.length}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Board Tasks</p>
                
                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <p className="text-xs text-gray-400 font-bold uppercase">To Do</p>
                    <p className="text-xl font-black">{projects.filter(p => p.status === 'To Do').length}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 font-bold uppercase">In Progress</p>
                    <p className="text-xl font-black">{projects.filter(p => p.status === 'In Progress').length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Role: {role}</h3>
                  <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                    {isLeader 
                      ? "You have full access to create, assign, and delete tasks within this board." 
                      : "You can update the status of your tasks and track deadlines."}
                  </p>
                  <button className="w-full py-3 bg-[#00b274] rounded-xl font-bold text-sm hover:bg-[#009a63] transition shadow-lg shadow-green-900/20">
                    View Reports
                  </button>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#00b274]/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ProjectRow = ({ project, onStatusChange }) => (
  <tr className="hover:bg-gray-50/50 transition-all duration-200 group">
    <td className="px-6 py-5">
      <p className="text-sm font-bold text-[#1e293b] group-hover:text-[#00b274] transition-colors">{project.title}</p>
      <div className="flex items-center gap-2 mt-1">
         <span className="text-[10px] text-gray-400 font-medium">Assigned to: </span>
         <span className="text-[10px] font-bold text-gray-600">
           {project.assigned_to ? `User #${project.assigned_to}` : "Unassigned"}
         </span>
      </div>
    </td>
    <td className="px-6 py-5">
      <select 
        value={project.status} 
        onChange={(e) => onStatusChange(project.id, e.target.value)}
        className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg bg-gray-50 border-none outline-none cursor-pointer hover:bg-white hover:ring-2 hover:ring-green-100 transition-all shadow-sm"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </td>
    <td className="px-6 py-5">
      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
        project.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
      }`}>
        {project.priority}
      </span>
    </td>
    <td className="px-6 py-5">
      <div className="flex items-center gap-2 text-gray-400 font-medium">
        <Calendar size={14} />
        <span className="text-[10px]">
          {new Date(project.due_date).toLocaleDateString()}
        </span>
      </div>
    </td>
  </tr>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
      active 
      ? 'bg-green-50 text-[#00b274] shadow-sm shadow-green-100/50' 
      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
    }`}
  >
    {icon}
    <span className="text-sm font-bold">{label}</span>
  </div>
);

export default FullDashboard;