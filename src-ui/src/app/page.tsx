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
  Video
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
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8081/api/status")
        .then((res) => res.json())
        .then((data) => setStatus(data))
        .catch(() => setStatus({ status: "offline" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] flex font-[family-name:var(--font-geist-sans)] selection:bg-black selection:text-white">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
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
          <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }} className="px-4 py-3 bg-black text-white rounded-2xl flex items-center space-x-3 shadow-lg shadow-black/10 cursor-pointer">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </motion.div>
          <motion.div whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.03)" }} whileTap={{ scale: 0.96 }} className="px-4 py-3 text-gray-500 rounded-2xl flex items-center space-x-3 transition-colors cursor-pointer">
            <Calendar className="w-5 h-5" />
            <span className="font-medium text-sm">Automations</span>
          </motion.div>
          <motion.div whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.03)" }} whileTap={{ scale: 0.96 }} className="px-4 py-3 text-gray-500 rounded-2xl flex items-center space-x-3 transition-colors cursor-pointer">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium text-sm">My Gestures</span>
          </motion.div>
          <motion.div whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.03)" }} whileTap={{ scale: 0.96 }} className="px-4 py-3 text-gray-500 rounded-2xl flex items-center space-x-3 transition-colors cursor-pointer">
            <BarChart2 className="w-5 h-5" />
            <span className="font-medium text-sm">Statistics</span>
          </motion.div>
        </nav>

        <div className="mt-auto">
          <motion.div whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.03)" }} whileTap={{ scale: 0.96 }} className="px-4 py-3 text-gray-500 rounded-2xl flex items-center space-x-3 transition-colors cursor-pointer">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Topbar */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Hi, User!</h1>
          <div className="flex items-center space-x-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-shadow">
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

        {/* Bento Grid Layout */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Dark Status Card (Overall Information) */}
          <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} className="lg:col-span-1 bg-[#1a1a1a] text-white rounded-[2rem] p-7 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-50 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-lg font-medium text-gray-200">Engine Status</h2>
              <motion.div whileHover={{ rotate: 90 }} className="cursor-pointer p-1">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>

            <div className="flex items-end space-x-4 mb-10 relative z-10">
              <span className="text-7xl font-extrabold tracking-tighter">11</span>
              <span className="text-gray-400 text-sm pb-2 leading-tight w-24 font-medium">actions supported</span>
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
                <span className="font-bold text-lg mb-1">{status?.is_recording ? 'Rec' : 'Idle'}</span>
                <span className="text-xs font-medium text-gray-400">State</span>
              </div>
            </div>
          </motion.div>

          {/* Camera Feed / Active Gestures Overview */}
          <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} className="lg:col-span-2 bg-white rounded-[2rem] p-7 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50 -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
             <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-lg font-semibold text-gray-800">Live Activity</h2>
              <span className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium flex items-center space-x-2 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${status?.is_recording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span>{status?.is_recording ? "Recording in progress..." : "Listening..."}</span>
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
                      <h3 className="font-medium text-gray-600">Camera running in background daemon</h3>
                      <p className="text-gray-400 text-xs mt-1">Ready to recognize gestures</p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show">
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
                  <motion.div whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }} className="p-1 rounded-md cursor-pointer transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                  </motion.div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">{action.label}</h3>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRecord(action.id)}
                    disabled={status?.is_recording}
                    className="w-full bg-[#f9fafb] border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-black hover:text-white hover:border-black transition-colors shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent flex items-center justify-center space-x-2"
                  >
                    <span>Record</span>
                    <Video className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
