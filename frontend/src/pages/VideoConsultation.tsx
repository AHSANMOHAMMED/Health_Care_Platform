import React, { useEffect, useRef, useState } from 'react';
import { VideoOff, MicOff, PhoneOff, Mic, Video, Users, Settings, Maximize2, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VideoConsultation() {
    const navigate = useNavigate();
    const location = useLocation();
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const domain = 'meet.jit.si';
        const roomName = new URLSearchParams(location.search).get('room') || `mediconnect-secure-${Math.random().toString(36).substring(7)}`;

        const script = document.createElement('script');
        script.src = `https://${domain}/external_api.js`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (jitsiContainerRef.current && (window as any).JitsiMeetExternalAPI) {
                const options = {
                    roomName: roomName,
                    parentNode: jitsiContainerRef.current,
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        prejoinPageEnabled: false,
                    },
                    interfaceConfigOverwrite: {
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        TOOLBAR_BUTTONS: [], // We are using custom toolbar
                    },
                };
                new (window as any).JitsiMeetExternalAPI(domain, options);
                setTimeout(() => setLoading(false), 2000);
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [location]);

    return (
        <div className="h-[calc(100vh-80px)] w-full max-w-7xl mx-auto p-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="h-full bg-slate-950 rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800">
                {/* Status Bar */}
                <div className="absolute top-0 w-full p-6 flex justify-between items-start z-10 bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none">
                    <div>
                        <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 pointer-events-auto">
                           <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                           </span>
                           <h3 className="text-white font-bold text-sm">Secure Consultation</h3>
                           <div className="w-px h-4 bg-slate-700 mx-1"></div>
                           <span className="text-slate-400 text-xs font-bold font-mono">00:00</span>
                        </div>
                    </div>
                    <div className="flex gap-2 pointer-events-auto">
                        <button className="w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                           <Users size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                           <Maximize2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Video Area */}
                <div className="flex-1 w-full h-full relative z-0 bg-slate-900" ref={jitsiContainerRef}>
                    {loading && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20">
                          <div className="relative mb-6">
                             <div className="w-20 h-20 border-4 border-slate-800 rounded-full animate-spin border-t-indigo-500"></div>
                             <div className="absolute inset-0 flex items-center justify-center"><Shield className="text-indigo-500" size={24}/></div>
                          </div>
                          <p className="text-slate-300 text-lg font-medium">Establishing E2E Encrypted Connection...</p>
                       </div>
                    )}
                </div>

                {/* Bottom Floating Control Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                   <div className="bg-slate-900/80 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-slate-700/50 shadow-2xl flex items-center gap-6">
                      <button
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`group relative h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
                          {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                          <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Audio</span>
                      </button>
                      
                      <button
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={`group relative h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
                          {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                          <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Video</span>
                      </button>

                      <div className="w-px h-8 bg-slate-700"></div>

                      <button className="group relative h-14 w-14 rounded-2xl flex items-center justify-center bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300">
                         <Settings size={22} />
                         <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Settings</span>
                      </button>

                      <button
                        onClick={() => navigate('/patient')}
                        className="h-14 px-8 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-600/20 gap-3 font-bold group">
                          <PhoneOff size={22} className="group-hover:-rotate-12 transition-transform" /> 
                          <span>End Call</span>
                      </button>
                   </div>
                </div>
            </div>
        </div>
    );
}
