import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, Maximize2, Users, AlertCircle, Loader2, Wifi, WifiOff, Shield, Send } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

// Interfaces...
interface SessionInfo { sessionId: string; appointmentId: string; doctorName: string; patientName: string; startTime: Date; status: string; }
interface ChatMessage { id: string; senderName: string; message: string; timestamp: Date; }

export default function Telemedicine() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const sessionId = params.get('session');
  
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showSidebar, setShowSidebar] = useState<'chat' | 'participants' | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [sessionTime, setSessionTime] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Mock Initialization
    setTimeout(() => {
       setSessionInfo({ sessionId: '123', appointmentId: '456', doctorName: 'Dr. Sarah Jenkins', patientName: user?.firstName || 'Patient', startTime: new Date(), status: 'active' });
       setConnectionStatus('connected');
       
       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
         .then(stream => { if(localVideoRef.current) localVideoRef.current.srcObject = stream; })
         .catch(err => console.warn('No webcam available.'));
    }, 1500);

    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), senderName: user?.firstName || 'You', message: newMessage, timestamp: new Date() }]);
    setNewMessage('');
    // Mock reply
    setTimeout(() => {
       setChatMessages(prev => [...prev, { id: Date.now().toString(), senderName: sessionInfo?.doctorName || 'Doctor', message: 'I see your message.', timestamp: new Date() }]);
    }, 2000);
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60); const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (connectionStatus === 'connecting') {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="relative mb-8">
           <div className="w-24 h-24 border-4 border-slate-800 rounded-full animate-spin border-t-indigo-500"></div>
           <div className="absolute inset-0 flex items-center justify-center"><Shield className="text-indigo-500" size={32}/></div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Securing Connection</h2>
        <p className="text-slate-600 font-medium">Establishing E2E Encrypted WebRTC Bridge...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] max-w-[1600px] w-full mx-auto p-4 flex gap-4 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Main Video Area */}
      <div className="flex-1 bg-slate-950 rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
        
        {/* Header Bar */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-start z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
          <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700">
             {connectionStatus === 'connected' ? <Wifi className="text-emerald-500" size={16} /> : <WifiOff className="text-red-500" size={16} />}
             <h3 className="text-slate-900 font-bold text-sm hidden sm:block">{sessionInfo?.doctorName}</h3>
             <div className="w-px h-4 bg-slate-700 mx-1"></div>
             <span className="text-slate-700 text-xs font-bold font-mono">{formatSessionTime(sessionTime)}</span>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setShowSidebar(showSidebar === 'participants' ? null : 'participants')} className={`w-10 h-10 rounded-full backdrop-blur-md border border-slate-700 flex items-center justify-center transition-colors ${showSidebar === 'participants' ? 'bg-indigo-600 text-slate-900' : 'bg-slate-900/50 text-slate-700 hover:bg-slate-800 hover:text-slate-900'}`}>
               <Users size={18} />
            </button>
            <button onClick={() => setShowSidebar(showSidebar === 'chat' ? null : 'chat')} className={`w-10 h-10 rounded-full backdrop-blur-md border border-slate-700 flex items-center justify-center transition-colors ${showSidebar === 'chat' ? 'bg-indigo-600 text-slate-900' : 'bg-slate-900/50 text-slate-700 hover:bg-slate-800 hover:text-slate-900'}`}>
               <MessageSquare size={18} />
               {chatMessages.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>}
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors">
               <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Video Canvas */}
        <div className="flex-1 w-full h-full relative z-0 bg-slate-900">
           {/* Mock remote video placeholder if WebRTC not connected */}
           <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Doctor`} className="w-48 h-48 opacity-20" alt="doc" />
           </div>
           <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover absolute inset-0 mix-blend-screen" />
           
           {/* Local PIP Video */}
           <div className="absolute bottom-32 right-6 w-32 md:w-48 aspect-[3/4] md:aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-[0_0_0_4px_rgba(30,41,59,0.5)] border border-slate-700 z-10 transition-all hover:scale-105 cursor-move">
              <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`} />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <VideoOff className="text-slate-600" size={32} />
                </div>
              )}
           </div>
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
           <div className="bg-slate-900/80 backdrop-blur-xl px-4 md:px-8 py-3 md:py-4 rounded-[2rem] border border-slate-700/50 shadow-2xl flex items-center gap-3 md:gap-6">
              <button onClick={() => setIsMicOn(!isMuted)} className={`group relative h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-slate-800 text-slate-900 hover:bg-slate-700'}`}>
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
              
              <button onClick={() => setIsVideoOff(!isVideoOff)} className={`group relative h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-slate-800 text-slate-900 hover:bg-slate-700'}`}>
                  {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>

              <div className="w-px h-8 bg-slate-700"></div>

              <button onClick={() => navigate('/patient')} className="h-12 md:h-14 px-6 md:px-8 rounded-2xl bg-red-600 hover:bg-red-500 text-slate-900 flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-600/20 gap-2 font-bold group">
                  <PhoneOff size={20} className="group-hover:-rotate-12 transition-transform" /> 
                  <span className="hidden sm:block">End Call</span>
              </button>
           </div>
        </div>
      </div>

      {/* Sidebars */}
      {showSidebar && (
        <div className="w-80 lg:w-96 bg-slate-950 rounded-[2.5rem] border border-slate-800 flex flex-col shadow-2xl overflow-hidden shrink-0 animate-in slide-in-from-right-8 fade-in">
           {showSidebar === 'chat' && (
             <>
               <div className="px-6 py-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2"><MessageSquare size={18} className="text-indigo-400"/> Session Chat</h3>
               </div>
               
               <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <MessageSquare size={48} className="mb-4 opacity-20"/>
                        <p className="text-sm">No messages yet.</p>
                     </div>
                  )}
                  {chatMessages.map(msg => (
                     <div key={msg.id} className={`flex flex-col ${msg.senderName === 'You' || msg.senderName === user?.firstName ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.senderName === 'You' || msg.senderName === user?.firstName ? 'bg-indigo-600 text-slate-900 rounded-br-sm' : 'bg-slate-800 text-slate-800 rounded-bl-sm'}`}>
                           <p className="text-sm">{msg.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                  ))}
               </div>
               
               <div className="p-4 bg-slate-900 border-t border-slate-800">
                  <div className="relative flex items-center">
                     <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Type message..." className="w-full bg-slate-800 text-slate-900 rounded-xl pl-4 pr-12 py-3 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"/>
                     <button onClick={sendMessage} className="absolute right-2 p-1.5 bg-indigo-600 text-slate-900 rounded-lg hover:bg-indigo-500 transition-colors"><Send size={16}/></button>
                  </div>
               </div>
             </>
           )}
           
           {showSidebar === 'participants' && (
             <>
               <div className="px-6 py-5 bg-slate-900 border-b border-slate-800">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2"><Users size={18} className="text-indigo-400"/> Participants (2)</h3>
               </div>
               <div className="p-4 space-y-2">
                 <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-slate-900 flex items-center justify-center font-bold">{user?.firstName?.[0] || 'Y'}</div>
                    <div className="flex-1"><p className="text-slate-900 text-sm font-bold">You <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-700 ml-1">Patient</span></p></div>
                    <div className="flex gap-2 text-slate-600">{isMuted ? <MicOff size={14} className="text-red-400"/> : <Mic size={14}/>}</div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-slate-900 flex items-center justify-center font-bold">{sessionInfo?.doctorName?.[4] || 'D'}</div>
                    <div className="flex-1"><p className="text-slate-900 text-sm font-bold">{sessionInfo?.doctorName}</p><span className="text-xs text-emerald-400 font-medium">Host</span></div>
                    <div className="flex gap-2 text-slate-600"><Mic size={14}/></div>
                 </div>
               </div>
             </>
           )}
        </div>
      )}
    </div>
  );
}
