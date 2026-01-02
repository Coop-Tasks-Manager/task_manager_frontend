import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Layers, Users, Target, Settings, ArrowLeft, Plus, UserPlus, 
  LayoutGrid, Calendar,  X, LogOut, MoreVertical 
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const FullDashboard = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [editingTask, setEditingTask] = useState(null);
  const [boardCount, setBoardCount] = useState(0);
  const [teamMembersCount, setTeamMembersCount] = useState(0);




  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState(null); 
  const [teamId, setTeamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);


    // Calculate analytics data
  const totalTasks = projects.length;
  const completedTasks = projects.filter(t => t.status === "Done").length;
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  // Unique members assigned to tasks
  //const uniqueMembers = [...new Set(projects.map(t => t.assigned_to))].filter(Boolean).length;
  //const completedTasks1 = projects.filter(t => t.status?.toLowerCase() === "done").length;

  // SVG Math: The circle's circumference is (2 * PI * radius)
  // For a radius of 18, circumference is ~113
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (productivity / 100) * circumference;

  const [goal, setGoal] = useState(10); // Default goal is 10 tasks
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Calculate how many tasks are done vs the goal
  const goalProgress = Math.min(Math.round((completedTasks / goal) * 100), 100);

  

  const fetchBoardData = async () => {
    if (!user || !boardId) return;
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };
      const tasksRes = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${boardId}`, { headers });
      const tasksData = await tasksRes.json();
      setProjects(Array.isArray(tasksData) ? tasksData : []);

      const detailRes = await fetch(`${process.env.REACT_APP_API_URL}/boards/details/${boardId}`, { headers });
      const boardDetail = await detailRes.json();
      //setBoardCount(Array.isArray(boardDetail) ? boardDetail.length : 0);

       //  Get all boards of the same team
        const boardsRes = await fetch(
          `${process.env.REACT_APP_API_URL}/boards/${boardDetail.team_id}`,
          { headers }
        );
        const boardsData = await boardsRes.json();
        //console.log("Boards Data:", boardsData);
        setBoardCount(Array.isArray(boardsData) ? boardsData.length : 0);

      setRole(boardDetail.role); 
      setTeamId(boardDetail.team_id);


      // Fetch team members count
      const membersRes = await fetch(
        `${process.env.REACT_APP_API_URL}/teams/${boardDetail.team_id}/members`,
        { headers }
      );
      const membersData = await membersRes.json();
      setTeamMembersCount(Array.isArray(membersData) ? membersData.length : 0);

      } catch (err) {
        setError("Failed to verify user permissions.");
      } finally {
        setLoading(false);
      }

  };



  useEffect(() => { fetchBoardData(); }, [boardId, user]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchBoardData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchBoardData();
    } catch (err) { console.error(err); }
  };

  // Group tasks by status for the Kanban columns
  const columns = {
    "To Do": projects.filter(t => t.status === "To Do"),
    "In Progress": projects.filter(t => t.status === "In Progress"),
    "Done": projects.filter(t => t.status === "Done")
  };

  const isLeader = role === 'leader';

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-2 font-black text-[#00b274] text-xl">TTM</div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem icon={<LayoutGrid size={18}/>} label="My Teams" onClick={() => navigate('/')} />
          <NavItem icon={<Briefcase size={18}/>} label="Board Tasks" active />
          <div onClick={() => { localStorage.clear(); window.location.href="/login"; }} className="flex items-center gap-3 p-3 text-red-400 cursor-pointer mt-4 hover:bg-red-50 rounded-xl">
            <LogOut size={18} /> <span className="text-sm font-bold">Logout</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400"><ArrowLeft size={20}/></button>
            <h1 className="font-bold text-lg text-[#1e293b]">Project Board</h1>
          </div>
          <div className="flex gap-4 items-center">
            {isLeader && (
              <>
                <button onClick={() => setShowInviteModal(true)} className="text-xs font-bold text-gray-500 hover:text-[#00b274]"><UserPlus size={16}/></button>
                <button onClick={() => setShowTaskModal(true)} className="bg-[#00b274] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-[#009a63]">
                  <Plus size={16} /> New Task
                </button>
              </>
            )}
          </div>
        </header>


        {/* Analytics Header Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Total Projects Card */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Boards</p>
              <h3 className="text-xl font-black text-[#1e293b]">{boardCount}</h3> 
            </div>
          </div>

          {/* Total Tasks Card */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Tasks</p>
              <h3 className="text-xl font-black text-[#1e293b]">{totalTasks}</h3>
            </div>
          </div>

        {/* Members Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Team Size</p>
            <h3 className="text-xl font-black text-[#1e293b]">{teamMembersCount}</h3> {/* Using the variable here */}
          </div>
        </div>

          {/* Productivity Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-[#00b274] transition-all">
          <div className="w-16 h-16 bg-green-50 text-[#00b274] rounded-2xl flex items-center justify-center relative">
            {/* Radial Progress Chart */}
            <svg className="w-12 h-12 transform -rotate-90">
              {/* Background Circle (Gray) */}
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-green-100/50"
              />
              {/* Progress Circle (Green) */}
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                style={{ 
                  strokeDashoffset: offset,
                  transition: 'stroke-dashoffset 0.8s ease-in-out' 
                }}
                strokeLinecap="round"
                className="text-[#00b274]"
              />
            </svg>
            {/* Percentage Text in Center */}
            <span className="absolute text-[10px] font-black text-[#1e293b]">
              {productivity}%
            </span>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Productivity</p>
            <h3 className="text-xl font-black text-[#1e293b]">{productivity}% Done</h3>
          </div>
        </div>

        </div>


        {/* Weekly Goal Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Target size={24} />
            </div>
            {/* Only show edit button if user is Leader */}
            <button 
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="text-gray-300 hover:text-[#00b274] transition-colors"
            >
              <Settings size={16} />
            </button>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Weekly Goal</p>
            {isEditingGoal ? (
              <input 
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onBlur={() => setIsEditingGoal(false)}
                className="text-xl font-black text-[#1e293b] w-20 border-b-2 border-[#00b274] outline-none"
                autoFocus
              />
            ) : (
              <h3 className="text-xl font-black text-[#1e293b]">{completedTasks} / {goal} Tasks</h3>
            )}
          </div>

          {/* Goal Progress Bar */}
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000" 
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <p className="text-[9px] font-bold text-gray-400 mt-2">{goalProgress}% of weekly target reached</p>
        </div>

        <div className="p-8">
          {/* KANBAN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(columns).map(([colName, tasks]) => (
              <div key={colName} className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-widest">{colName}</h3>
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-full">{tasks.length}</span>
                </div>
                
                <div className="space-y-4 min-h-[500px] bg-gray-50/50 p-3 rounded-2xl border border-dashed border-gray-200">
                  {tasks.map(task => (


                  <div
                      key={task.id}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group relative hover:ring-2 hover:ring-[#00b274]/30"
                    >
                      <div className="flex justify-between mb-3">
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                          {task.priority}
                        </span>

                        <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(activeMenu === task.id ? null : task.id);
                                }}
                                className="text-gray-300 hover:text-gray-600"
                              >
                                <MoreVertical size={16} />
                        </button>
                        
         {activeMenu === task.id && (
  <div className="absolute right-4 top-12 bg-white shadow-xl rounded-xl border p-2 z-30 min-w-[160px]">

    {/* Move Section */}
    <div className="text-[9px] font-black text-gray-400 px-2 py-1 uppercase tracking-widest">
      Move to
    </div>

    {['To Do', 'In Progress', 'Done'].map(s => (
      <button
        key={s}
        onClick={() => {
          handleStatusUpdate(task.id, s);
          setActiveMenu(null);
        }}
        className={`w-full text-left p-2 text-[10px] font-bold rounded-lg transition-colors ${
          task.status === s
            ? 'bg-green-50 text-[#00b274]'
            : 'hover:bg-gray-50 text-gray-600'
        }`}
      >
        {s}
      </button>
    ))}

    {/* Divider */}
    <div className="my-1 border-t border-gray-100"></div>

    {/*  EDIT TASK BUTTON */}
    <button
      onClick={() => {
        setEditingTask(task);
        setActiveMenu(null);
      }}
      className="w-full text-left p-2 text-[10px] font-bold text-blue-500 hover:bg-blue-50 rounded-lg"
    >
       Edit Task
    </button>

    {/* Leader-only delete */}
    {isLeader && (
      <>
        <div className="my-1 border-t border-gray-100"></div>
        <button
          onClick={() => {
            handleDeleteTask(task.id);
            setActiveMenu(null);
          }}
          className="w-full text-left p-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          <X size={12} /> Delete Task
        </button>
      </>
    )}
  </div>
)}

                      </div>

                      <h4 className="text-sm font-bold text-[#1e293b] mb-1">{task.title}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{task.description}</p>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-50 text-[#00b274] flex items-center justify-center text-[10px] font-black border border-green-100">
                            {task.assigned_to_name?.charAt(0) || "?"}
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 truncate max-w-[80px]">{task.assigned_to_name || "Unassigned"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar size={12} />
                          <span className="text-[9px] font-bold">{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showTaskModal && <NewTaskModal boardId={boardId} teamId={teamId} onClose={() => setShowTaskModal(false)} onRefresh={fetchBoardData} />}
      {showInviteModal && <InviteModal teamId={teamId} onClose={() => setShowInviteModal(false)} />}

        {editingTask && ( <NewTaskModal boardId={boardId} teamId={teamId}
              task={editingTask}
              onClose={() => setEditingTask(null)}
              onRefresh={fetchBoardData}
              isEdit
            />
        )}
    </div>
  );
};

// --- UPDATED NEW TASK MODAL ---
/* const NewTaskModal = ({ boardId, teamId, onClose, onRefresh }) => { */
const NewTaskModal = ({ boardId, teamId, task, onClose, onRefresh, isEdit }) => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'Medium',
        assigned_to: task?.assigned_to || '',
        due_date: task?.due_date?.split('T')[0] || new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/teams/${teamId}/members`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(data => setMembers(Array.isArray(data) ? data : []));
  }, [teamId]);


    const handleSubmit = async (e) => {
          e.preventDefault();

          const url = isEdit
            ? `${process.env.REACT_APP_API_URL}/tasks/${task.id}`
            : `${process.env.REACT_APP_API_URL}/tasks/${boardId}`;

          const method = isEdit ? 'PUT' : 'POST';

          const res = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
          });

          if (res.ok) {
            onRefresh();
            onClose();
          }
    };


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={20}/></button>
        {/* <h3 className="text-2xl font-black mb-6 text-[#1e293b]">Create Task</h3> */}
        <h3 className="text-2xl font-black mb-6 text-[#1e293b]">
              {isEdit ? "Edit Task" : "Create Task"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Title</label>
            <input className="w-full p-4 bg-gray-50 rounded-xl font-bold border-transparent focus:border-[#00b274] outline-none border transition-all" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          {/* ADDED DESCRIPTION FIELD */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Description</label>
            <textarea className="w-full p-4 bg-gray-50 rounded-xl font-bold border-transparent focus:border-[#00b274] outline-none border transition-all h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What needs to be done?" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Assign Member</label>
            <select className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none cursor-pointer" required value={formData.assigned_to} onChange={e => setFormData({...formData, assigned_to: e.target.value})}>
              <option value="">Select someone...</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className="p-4 bg-gray-50 rounded-xl font-bold outline-none" onChange={e => setFormData({...formData, priority: e.target.value})} value={formData.priority}>
              <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
            </select>
            <input type="date" className="p-4 bg-gray-50 rounded-xl font-bold outline-none" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
          </div>
          {/* <button type="submit" className="w-full py-4 bg-[#00b274] text-white rounded-xl font-black shadow-lg hover:bg-[#009a63] transition-all transform active:scale-95">Add to Board</button> */}
          <button type="submit" className="w-full py-4 bg-[#00b274] text-white rounded-xl font-black shadow-lg hover:bg-[#009a63] transition-all">
            {isEdit ? "Update Task" : "Add to Board"}
          </button>

        </form>
      </div>
    </div>
  );
};


const InviteModal = ({ teamId, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: '', message: '' });
  const handleInvite = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/teams/${teamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) setStatus({ type: 'error', message: data.message });
    else { setStatus({ type: 'success', message: "Member Added!" }); setTimeout(onClose, 1500); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-center">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400"><X size={20}/></button>
        <h3 className="text-2xl font-black mb-2 text-[#1e293b]">Invite</h3>
        <p className="text-[11px] font-bold text-gray-400 mb-6">ADD A NEW MEMBER TO THE TEAM</p>
        {status.message && <div className={`p-3 mb-4 rounded-xl text-[10px] font-black uppercase ${status.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#00b274]'}`}>{status.message}</div>}
        <form onSubmit={handleInvite} className="space-y-4">
          <input className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-center border-transparent focus:border-[#00b274] border transition-all" placeholder="user@example.com" type="email" required onChange={e => setEmail(e.target.value)} />
          <button type="submit" className="w-full py-4 bg-[#00b274] text-white rounded-xl font-black">Add Member</button>
        </form>
      </div>
    </div>
  );
};



const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-green-50 text-[#00b274]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
    {icon} <span className="text-sm font-bold">{label}</span>
  </div>
);




export default FullDashboard;