"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  Search, 
  Bell, 
  MoreHorizontal,
  PlaySquare,
  SkipForward,
  SkipBack,
  Volume2,
  Volume1,
  MousePointer2,
  ArrowUp,
  ArrowDown,
  Monitor,
  AppWindow,
  Save,
  RefreshCw,
  Video,
  Trash2,
  Power
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
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const [status, setStatus] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch Status Loop
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8081/api/status")
        .then((res) => res.json())
        .then((data) => setStatus(data))
        .catch(() => setStatus({ status: "offline" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Config
  const fetchConfig = () => {
    fetch("http://127.0.0.1:8081/api/config")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "gestures" || activeTab === "settings" || activeTab === "dashboard") {
      fetchConfig();
    }
  }, [activeTab]);

  const handleRecord = async (actionId: string) => {
    const gestureName = prompt("Enter a name for this custom gesture (e.g., 'MySwipe'):");
    if (!gestureName) return;

    try {
      const res = await fetch("http://127.0.0.1:8081/api/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gesture_id: gestureName, os_action: actionId }),
      });
      const data = await res.json();
      alert(data.message);
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
      fetchConfig(); // Refresh
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

  // Views
  const renderDashboard = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-10">
      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} className="lg:col-span-1 bg-[#1a1a1a] text-white rounded-[2rem] p-7 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-50 transition-transform duration-700 group-hover:scale-110"></div>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-lg font-medium text-gray-200">Engine Status</h2>
            <motion.div whileHover={{ rotate: 90 }} className="cursor-pointer p-1">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>

          <div className="flex items-end space-x-4 mb-10 relative z-10">
            <span className="text-7xl font-extrabold tracking-tighter">
              {config ? Object.keys(config.mappings || {}).length : 0}
            </span>
            <span className="text-gray-400 text-sm pb-2 leading-tight w-24 font-medium">gestures recorded</span>
          </div>

          <div className="grid grid-cols-3 gap-3 relative z-10">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 transition-colors hover:bg-white/10">
              <div className={`w-3 h-3 rounded-full mb-2 ${status?.status === 'offline' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`}></div>
              <span className="text-xs font-medium text-gray-300">{status?.status === 'offline' ? 'Offline' : 'Online'}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 transition-colors hover:bg-white/10">
              <MousePointer2 className="w-5 h-5 mb-2 text-gray-300" />
              <span className="text-xs font-medium text-gray-300">Tracking</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 transition-colors hover:bg-white/10">
              <span className="font-bold text-lg mb-1">{status?.is_recording ? 'Rec' : (status?.is_active ? 'Active' : 'Paused')}</span>
              <span className="text-xs font-medium text-gray-400">State</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} className="lg:col-span-2 bg-white rounded-[2rem] p-7 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50 -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-lg font-semibold text-gray-800">Live Activity</h2>
            <span className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium flex items-center space-x-2 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${status?.is_recording ? 'bg-red-500 animate-pulse' : (status?.is_active ? 'bg-green-500' : 'bg-orange-500')}`}></div>
              <span>{status?.is_recording ? "Recording in progress..." : (status?.is_active ? "Listening..." : "Engine Paused")}</span>
            </span>
          </div>
          
          <div className="flex-1 bg-[#f9fafb] rounded-[1.5rem] border border-gray-200 border-dashed flex items-center justify-center relative z-10 transition-colors group-hover:bg-[#f3f4f6]">
              <AnimatePresence mode="wait">
                {status?.is_recording ? (
                  <motion.div 
                    key="recording"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-100"
                    >
                      <Video className="w-8 h-8" />
                    </motion.div>
                    <h3 className="font-bold text-xl text-gray-900">Perform Gesture Now</h3>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Recording '{status?.recording_gesture}'</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="listening"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <h3 className="font-medium text-gray-600">
                      {status?.is_active ? "Camera running in background daemon" : "Engine is currently paused."}
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div>
        <motion.h2 variants={itemVariants} className="text-xl font-bold mb-6 flex justify-between items-center text-gray-900">
          Map Gestures to Actions
          <span className="text-sm font-medium text-gray-400 flex items-center cursor-pointer hover:text-gray-600 transition-colors">
            Sort by <ArrowDown className="w-4 h-4 ml-1" />
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ACTIONS.map((action) => (
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              key={action.id} 
              className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative group flex flex-col justify-between h-48"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gray-50 rounded-[1rem] flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-sm">
                  {action.icon}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">{action.label}</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRecord(action.id)}
                  disabled={status?.is_recording}
                  className="w-full bg-[#f9fafb] border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-black hover:text-white hover:border-black transition-colors shadow-sm disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center space-x-2"
                >
                  <span>Record</span>
                  <Video className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderGestures = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-gray-900">My Gestures</motion.h2>
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        {!config || !config.mappings || Object.keys(config.mappings).length === 0 ? (
          <p className="text-gray-500">No gestures recorded yet. Go to the dashboard to map some!</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(config.mappings).map(([gesture, actionId], i) => (
              <motion.div variants={itemVariants} key={i} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    {gesture.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{gesture}</h3>
                    <p className="text-sm text-gray-500 font-medium">Mapped to OS Action: <span className="text-black">{String(actionId)}</span></p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteGesture(gesture)}
                  className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-gray-900">Settings</motion.h2>
      <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 max-w-2xl">
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold">Engine Status</h3>
            <p className="text-gray-500 text-sm">Pause or resume the background ML python daemon.</p>
          </div>
          <button 
            onClick={handleToggleEngine}
            className={`px-6 py-3 rounded-full font-bold flex items-center space-x-2 transition-colors ${status?.is_active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
          >
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
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] flex font-[family-name:var(--font-geist-sans)] selection:bg-black selection:text-white">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-64 bg-white/70 backdrop-blur-xl border-r border-gray-200/50 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative"
      >
        <div className="flex items-center space-x-3 mb-10 cursor-pointer">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/20">
            <Video className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-bold text-xl tracking-tight">GestureOS</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<CheckSquare />} label="My Gestures" active={activeTab === 'gestures'} onClick={() => setActiveTab('gestures')} />
          <SidebarItem icon={<Calendar />} label="Automations" active={activeTab === 'automations'} onClick={() => {}} disabled />
          <SidebarItem icon={<BarChart2 />} label="Statistics" active={activeTab === 'stats'} onClick={() => {}} disabled />
        </nav>

        <div className="mt-auto">
          <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.header 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {activeTab === 'dashboard' ? 'Overview' : activeTab === 'gestures' ? 'Gestures' : 'Settings'}
          </h1>
          <div className="flex items-center space-x-4">
            <motion.button onClick={() => alert("Coming soon!")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-shadow">
              + Add Macro
            </motion.button>
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }} whileTap={{ scale: 0.95 }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }} whileTap={{ scale: 0.95 }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 relative cursor-pointer transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </motion.div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'gestures' && renderGestures()}
          {activeTab === 'settings' && renderSettings()}
        </AnimatePresence>

      </main>
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
