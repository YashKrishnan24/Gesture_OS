"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Calendar, CheckSquare, BarChart2, Settings, 
  Search, Bell, MoreHorizontal, PlaySquare, SkipForward, SkipBack, 
  Volume2, Volume1, MousePointer2, ArrowUp, ArrowDown, Monitor, 
  AppWindow, Save, RefreshCw, Video, Trash2, Power, Copy, Clipboard, 
  Undo, ZoomIn, ZoomOut, Camera, VolumeX, Lock, X, Plus, User, Key, ChevronRight
} from "lucide-react";

const ACTIONS = [
  { id: "playpause", label: "Play / Pause", icon: <PlaySquare className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "nexttrack", label: "Next Track", icon: <SkipForward className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "prevtrack", label: "Prev Track", icon: <SkipBack className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "volumeup", label: "Volume Up", icon: <Volume2 className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "volumedown", label: "Volume Down", icon: <Volume1 className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "scrollup", label: "Scroll Up", icon: <ArrowUp className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "scrolldown", label: "Scroll Down", icon: <ArrowDown className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "show_desktop", label: "Show Desktop", icon: <Monitor className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "switch_window", label: "Switch Window", icon: <AppWindow className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "save_file", label: "Save File", icon: <Save className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "refresh_page", label: "Refresh Page", icon: <RefreshCw className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "copy", label: "Copy", icon: <Copy className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "paste", label: "Paste", icon: <Clipboard className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "undo", label: "Undo", icon: <Undo className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "zoom_in", label: "Zoom In", icon: <ZoomIn className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "zoom_out", label: "Zoom Out", icon: <ZoomOut className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "screenshot", label: "Screenshot", icon: <Camera className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "mute", label: "Mute", icon: <VolumeX className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
  { id: "lock_screen", label: "Lock Screen", icon: <Lock className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" /> },
];

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } }, exit: { opacity: 0 } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

export default function Home() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });

  // App State
  const [status, setStatus] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Modal State
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [recordingAction, setRecordingAction] = useState<string | null>(null);
  const [gestureNameInput, setGestureNameInput] = useState("");
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);
  const [isMacroModalOpen, setIsMacroModalOpen] = useState(false);

  // Fetch Status Loop
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8081/api/status")
        .then((res) => res.json())
        .then((data) => setStatus(data))
        .catch(() => setStatus({ status: "offline" }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handle Recording auto-close
  useEffect(() => {
    if (isRecordingInProgress && status && !status.is_recording) {
      setIsRecordingInProgress(false);
      setIsRecordingModalOpen(false);
      setRecordingAction(null);
      setGestureNameInput("");
      fetchConfig();
    }
  }, [status, isRecordingInProgress]);

  const fetchConfig = () => {
    fetch("http://127.0.0.1:8081/api/config")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (isAuthenticated) fetchConfig();
  }, [activeTab, isAuthenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.username && authForm.password) {
      setIsAuthenticated(true);
    }
  };

  const openRecordModal = (actionId: string) => {
    setRecordingAction(actionId);
    setGestureNameInput("");
    setIsRecordingInProgress(false);
    setIsRecordingModalOpen(true);
  };

  const startRecording = async () => {
    if (!gestureNameInput.trim() || !recordingAction) return;
    try {
      await fetch("http://127.0.0.1:8081/api/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gesture_id: gestureNameInput.trim(), os_action: recordingAction }),
      });
      setIsRecordingInProgress(true);
    } catch (e) {
      alert("Failed to connect to engine.");
    }
  };

  const handleDeleteGesture = async (gestureId: string) => {
    if (!confirm(`Are you sure you want to delete gesture '${gestureId}'?`)) return;
    try {
      await fetch("http://127.0.0.1:8081/api/config/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gesture_id: gestureId })
      });
      fetchConfig();
    } catch (e) {
      alert("Failed to delete gesture.");
    }
  };

  const handleToggleEngine = async () => {
    const newState = !status?.is_active;
    try {
      await fetch("http://127.0.0.1:8081/api/toggle-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newState })
      });
      fetchConfig();
    } catch (e) {
      alert("Failed to toggle engine.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-[family-name:var(--font-geist-sans)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] w-full max-w-md border border-white/10 shadow-2xl relative z-10">
          <div className="flex items-center justify-center mb-8 space-x-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">GestureOS</h1>
          </div>
          
          <div className="flex bg-white/5 rounded-full p-1 mb-8">
            <button onClick={() => setIsLoginMode(true)} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${isLoginMode ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>Login</button>
            <button onClick={() => setIsLoginMode(false)} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${!isLoginMode ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>Register</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Username" required value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all" />
            </div>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="Password" required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all" />
            </div>
            <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-2xl mt-4 hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center space-x-2">
              <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] flex font-[family-name:var(--font-geist-sans)] selection:bg-black selection:text-white relative">
      {/* Sidebar */}
      <motion.aside initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-64 bg-white/70 backdrop-blur-xl border-r border-gray-200/50 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="flex items-center space-x-3 mb-10 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/20">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">GestureOS</span>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<CheckSquare />} label="My Gestures" active={activeTab === 'gestures'} onClick={() => setActiveTab('gestures')} />
          <SidebarItem icon={<Calendar />} label="Automations" active={activeTab === 'automations'} onClick={() => setActiveTab('automations')} />
          <SidebarItem icon={<BarChart2 />} label="Statistics" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
        </nav>
        <div className="mt-auto">
          <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative z-0">
        <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 capitalize">
            {activeTab}
          </h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMacroModalOpen(true)} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-shadow">
              + Add Macro
            </button>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 relative cursor-pointer hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
              {/* Perfectly Aligned Top Section */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                
                {/* Live Camera View (Dominant) */}
                <motion.div variants={itemVariants} className="xl:col-span-3 bg-black rounded-[2rem] p-1 shadow-2xl relative overflow-hidden h-[500px] flex flex-col group">
                  <div className="absolute top-4 left-4 z-20 flex space-x-2">
                    <span className="bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${status?.is_recording ? 'bg-red-500 animate-pulse' : (status?.is_active ? 'bg-green-500' : 'bg-orange-500')}`}></div>
                      <span>{status?.is_recording ? "Recording..." : (status?.is_active ? "Live Tracking" : "Paused")}</span>
                    </span>
                  </div>
                  
                  <div className="flex-1 w-full h-full relative rounded-[1.8rem] overflow-hidden bg-gray-900 border border-white/10">
                    {status?.is_active ? (
                      <img src="http://127.0.0.1:8081/api/video_feed" alt="Camera Feed" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <Video className="w-12 h-12 mb-4 opacity-50" />
                        <p>Camera is paused</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Stats Sidebar */}
                <motion.div variants={itemVariants} className="xl:col-span-1 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 h-[500px]">
                  <div className="bg-[#1a1a1a] text-white rounded-3xl p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
                    <div>
                      <h3 className="text-gray-400 font-medium text-sm mb-1">Total Gestures</h3>
                      <div className="text-5xl font-bold">{config ? Object.keys(config.mappings || {}).length : 0}</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Engine</span>
                        <span className={status?.status === 'online' ? 'text-green-400' : 'text-red-400'}>{status?.status || 'Loading'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tracking</span>
                        <span className={status?.is_active ? 'text-blue-400' : 'text-orange-400'}>{status?.is_active ? 'Active' : 'Paused'}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleToggleEngine} className={`w-full py-4 rounded-3xl font-bold flex items-center justify-center space-x-2 transition-colors ${status?.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    <Power className="w-5 h-5" />
                    <span>{status?.is_active ? "Pause Engine" : "Start Engine"}</span>
                  </button>
                </motion.div>
              </div>

              {/* Action Grid */}
              <div>
                <motion.h2 variants={itemVariants} className="text-xl font-bold mb-6 text-gray-900 flex justify-between items-center">
                  Available Actions
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                  {ACTIONS.map((action) => (
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }} key={action.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group hover:border-gray-300 transition-all flex flex-col justify-between h-40">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                          {action.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-3 truncate">{action.label}</h3>
                        <button onClick={() => openRecordModal(action.id)} className="w-full bg-gray-50 hover:bg-black hover:text-white text-gray-700 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1">
                          <Plus className="w-3 h-3" />
                          <span>Map Gesture</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gestures' && (
            <motion.div key="gestures" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                {!config || !config.mappings || Object.keys(config.mappings).length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No gestures mapped yet.</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.entries(config.mappings).map(([gesture, actionId], i) => (
                      <motion.div variants={itemVariants} key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-800 text-lg">
                            {gesture.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{gesture}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Triggers <span className="text-black font-semibold bg-gray-200 px-1.5 py-0.5 rounded ml-1">{String(actionId)}</span></p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteGesture(gesture)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'automations' && (
            <motion.div key="automations" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="bg-white rounded-[2rem] p-10 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Automations Builder</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">Chain multiple OS actions together to create complex workflows triggered by a single hand gesture.</p>
              <button className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow">Create Automation</button>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="bg-white rounded-[2rem] p-10 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <BarChart2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Usage Statistics</h2>
              <p className="text-gray-500 max-w-md mx-auto">Track which gestures you use the most and optimize your hand movements for maximum productivity.</p>
            </motion.div>
          )}
          
          {activeTab === 'settings' && (
            <motion.div key="settings" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 max-w-2xl">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold">Engine Status</h3>
                  <p className="text-gray-500 text-sm">Pause or resume the background ML python daemon.</p>
                </div>
                <button onClick={handleToggleEngine} className={`px-6 py-3 rounded-full font-bold flex items-center space-x-2 transition-colors ${status?.is_active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                  <Power className="w-5 h-5" />
                  <span>{status?.is_active ? "Pause Engine" : "Resume Engine"}</span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Cooldown Threshold</h3>
                  <p className="text-gray-500 text-sm">Time required between gesture recognitions.</p>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono font-medium text-gray-700">
                  {config?.settings?.cooldown || 1.0}s
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Record Gesture Modal */}
      <AnimatePresence>
        {isRecordingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isRecordingInProgress && setIsRecordingModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-2xl">
              <button onClick={() => !isRecordingInProgress && setIsRecordingModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
              
              {!isRecordingInProgress ? (
                <>
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <Video className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Record New Gesture</h2>
                  <p className="text-gray-500 mb-6 text-sm">Give your gesture a name and get ready to perform it in front of the camera.</p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gesture Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., SwipeRight, PeaceSign" 
                      value={gestureNameInput}
                      onChange={(e) => setGestureNameInput(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                      autoFocus
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl mb-8 flex items-center justify-between border border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Action to trigger</span>
                    <span className="font-bold text-black bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200">{recordingAction}</span>
                  </div>

                  <button 
                    onClick={startRecording}
                    disabled={!gestureNameInput.trim()}
                    className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Start Recording</span>
                  </button>
                </>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                    <Video className="w-10 h-10" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Perform Gesture Now</h2>
                  <p className="text-gray-500">Look at the camera and perform <strong>'{gestureNameInput}'</strong>.</p>
                  <p className="text-sm text-red-500 font-bold mt-6 animate-pulse">Recording 30 frames...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Placeholder Macro Modal */}
      <AnimatePresence>
        {isMacroModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMacroModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-[2rem] p-8 relative z-10 shadow-2xl text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Macro Builder</h2>
              <p className="text-gray-500 mb-6">The macro builder interface is currently in development. Check back in a future update!</p>
              <button onClick={() => setIsMacroModalOpen(false)} className="bg-gray-100 text-gray-900 font-bold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, disabled = false }: any) {
  if (active) {
    return (
      <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }} className="px-4 py-3 bg-black text-white rounded-2xl flex items-center space-x-3 shadow-lg shadow-black/10 cursor-pointer">
        <div className="w-5 h-5">{icon}</div>
        <span className="font-medium text-sm">{label}</span>
      </motion.div>
    );
  }
  return (
    <motion.div onClick={disabled ? undefined : onClick} whileHover={{ x: disabled ? 0 : 4, backgroundColor: disabled ? "" : "rgba(0,0,0,0.03)" }} whileTap={{ scale: disabled ? 1 : 0.96 }} className={`px-4 py-3 rounded-2xl flex items-center space-x-3 transition-colors ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer'}`}>
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium text-sm">{label}</span>
      {disabled && <span className="ml-auto text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold">SOON</span>}
    </motion.div>
  );
}
