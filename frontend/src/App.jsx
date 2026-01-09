import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Plus, Filter, Info, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const API_BASE = "https://job-scheduler-backend-evda.onrender.com";

function App() {
  const [jobs, setJobs] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/jobs?status=${statusFilter}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs");
    }
  };

  useEffect(() => { fetchJobs(); }, [statusFilter]);

  const createJob = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await axios.post(`${API_BASE}/jobs`, { taskName, priority, payload: { info: "Manual Trigger" } });
    setTaskName("");
    setIsLoading(false);
    fetchJobs();
  };

  const runJob = async (id) => {
    await axios.post(`${API_BASE}/jobs/${id}/run`);
    fetchJobs();
    const interval = setInterval(async () => {
      const res = await axios.get(`${API_BASE}/jobs`);
      setJobs(res.data);
      if (res.data.find(j => j.id === id && j.status === 'completed')) clearInterval(interval);
    }, 1000);
  };

  // Helper to get status styles
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"><CheckCircle2 size={14} /> Completed</span>;
      case 'running':
        return <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"><Loader2 size={14} className="animate-spin" /> Running</span>;
      default:
        return <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"><Clock size={14} /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Scheduler</h1>
            <p className="text-slate-500 mt-1">Manage and automate your background tasks.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                <Filter size={18} className="text-slate-400" />
                <select 
                  onChange={e => setStatusFilter(e.target.value)} 
                  className="bg-transparent text-sm focus:outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                </select>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" /> Create New Job
              </h2>
              <form onSubmit={createJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Task Name</label>
                  <input 
                    placeholder="e.g. Send Welcome Email"
                    value={taskName} 
                    onChange={e => setTaskName(e.target.value)} 
                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)} 
                    className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <button 
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Schedule Job"}
                </button>
              </form>
            </div>
          </div>

          {/* Jobs Table Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Details</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-slate-400">No jobs found. Create one to get started!</td>
                    </tr>
                  ) : (
                    jobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{job.taskName}</div>
                          <div className="text-xs text-slate-400 font-mono">ID: #{job.id}</div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(job.status)}
                        </td>
                        <td className="p-4 text-sm">
                          <span className={`font-medium ${job.priority === 'High' ? 'text-orange-600' : 'text-slate-600'}`}>
                            {job.priority}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {job.status === 'pending' ? (
                            <button 
                              onClick={() => runJob(job.id)} 
                              className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
                            >
                              <Play size={14} fill="white" /> Run Job
                            </button>
                          ) : (
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                              <Info size={20} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;