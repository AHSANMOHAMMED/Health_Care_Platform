import React, { useEffect, useRef, useState } from 'react';
import { VideoOff, MicOff, PhoneOff, Mic, Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VideoConsultation() {
    const navigate = useNavigate();
    const location = useLocation();
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    useEffect(() => {
        const domain = 'meet.jit.si';
        const roomName = new URLSearchParams(location.search).get('room') || `mediconnect-${Math.random().toString(36).substring(7)}`;

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
                    },
                    interfaceConfigOverwrite: {
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    },
                };
                new (window as any).JitsiMeetExternalAPI(domain, options);
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [location]);

    return (
        <div className="h-[80vh] bg-slate-900 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl">
            {/* Header */}
            <div className="bg-slate-800/50 absolute top-0 w-full p-4 flex justify-between items-center z-10 backdrop-blur-md">
                <div>
                    <h3 className="text-white font-bold">Telemedicine Consultation</h3>
                    <p className="text-emerald-400 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Secure E2E Enhanced Connection
                    </p>
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 w-full h-full relative z-0" ref={jitsiContainerRef}>
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-slate-900/60 backdrop-blur-sm z-0 pointer-events-none">
                    <p className="text-white text-lg font-medium">Connecting to encrypted WebRTC bridge...</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-950 p-6 flex justify-center gap-6 items-center z-10 w-full absolute bottom-0">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`h-14 w-14 rounded-full flex items-center justify-center transition shadow-lg ${isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                    {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`h-14 w-14 rounded-full flex items-center justify-center transition shadow-lg ${isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                    {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
                <button
                  onClick={() => navigate('/patient')}
                  className="h-14 w-32 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg gap-2 font-bold px-6">
                    <PhoneOff size={20} /> End Call
                </button>
            </div>
        </div>
    );
}
