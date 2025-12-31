import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, ChevronLeft, ArrowRight, Loader2, Plus, X } from 'lucide-react';
import Sidebar from '../components/Sidebar'; // Ensure this path matches your file structure

export default function Boards() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const fetchBoards = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/boards/${teamId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setBoards(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Fetch boards failed", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchBoards(); }, [teamId]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/boards/${teamId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ name: newBoardName, team_id: teamId })
      });
      if (response.ok) {
        setNewBoardName("");
        setShowModal(false);
        fetchBoards();
      }
    } catch (err) { console.log(err); }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* 1. Global Navigation Sidebar */}
      <Sidebar activePage="teams" />

      {/* 2. Main Workspace Area - Shifted to the right by ml-64 to clear the sidebar */}
      <main className="flex-1 md:ml-64 p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate('/teams')} 
              className="flex items-center gap-2 text-gray-400 hover:text-[#00b274] font-bold text-sm transition-colors"
            >
              <ChevronLeft size={16} /> Back to Teams
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#00b274] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-100 hover:scale-105 transition-transform"
            >
              <Plus size={20} /> New Board
            </button>
          </div>

          <header className="mb-12">
            <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Workspace Boards</h2>
            <p className="text-gray-500 mt-2 font-medium">Select a board to manage tasks and view team progress.</p>
          </header>

          {/* Boards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center gap-4 text-gray-400">
                <Loader2 className="animate-spin" size={32} />
                <p className="font-black uppercase tracking-widest text-[10px]">Syncing Workspace...</p>
              </div>
            ) : boards.length > 0 ? (
              boards.map((board) => (
                <div 
                  key={board.id}
                  onClick={() => navigate(`/dashboard/${board.id}`)}
                  className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#00b274] transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#00b274] group-hover:bg-[#00b274] group-hover:text-white transition-all mb-6">
                    <Layers size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#1e293b] mb-2">{board.name}</h3>
                  <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">
                    Collaborate on tasks, set priorities, and track progress here.
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[10px] font-black text-[#00b274] uppercase tracking-wider">Open Kanban</span>
                    <ArrowRight size={18} className="text-[#00b274] transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <Layers className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 font-bold">No boards found for this team yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE BOARD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1e293b]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-600">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black mb-2 text-[#1e293b]">New Board</h3>
            <p className="text-gray-400 text-sm mb-8 font-medium">Define a new workspace for your team tasks.</p>
            <form onSubmit={handleCreateBoard}>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Board Name</label>
              <input 
                type="text" 
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 ring-[#00b274]/20 outline-none mb-8 font-bold text-[#1e293b]"
                placeholder="e.g. Sprint 1, Marketing..." 
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
              <button className="w-full py-4 bg-[#00b274] text-white rounded-2xl font-black shadow-lg shadow-green-100 uppercase tracking-widest text-[11px]">
                Create Board
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}