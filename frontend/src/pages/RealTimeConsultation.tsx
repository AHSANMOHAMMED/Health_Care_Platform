import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Video, Phone, MessageSquare, Users, Mic, MicOff, VideoOff, PhoneOff, MoreVertical, ScreenShare, Paperclip } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'me' | 'doctor';
  text: string;
  time: string;
  type?: 'text' | 'file';
}

export default function RealTimeConsultation() {
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'participants'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'doctor', text: 'Hello! How can I help you today?', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Hi Doctor, I have been having headaches for the past week.', time: '10:01 AM' },
  ]);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'me',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-300/50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/doctor" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ChevronLeft size={20} />
            <span>End Call</span>
          </Link>
          <div className="text-center">
            <p className="font-medium text-slate-900">Dr. Sarah Johnson</p>
            <p className="text-xs text-slate-600">{formatTime(callDuration)}</p>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-14 h-screen flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 relative bg-black">
            {/* Doctor Video (Large) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[#0EA5E9]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-[#0EA5E9]">Dr</span>
                </div>
                <p className="text-slate-900 font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-slate-600">Cardiologist</p>
              </div>
            </div>

            {/* Self Video (Small - Picture in Picture) */}
            <div className="absolute bottom-4 right-4 w-40 h-32 bg-white rounded-xl overflow-hidden border border-slate-300/50">
              {isVideoOff ? (
                <div className="h-full flex items-center justify-center">
                  <span className="text-slate-500">Camera Off</span>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-[#0EA5E9]/10">
                  <span className="text-[#0EA5E9]">You</span>
                </div>
              )}
            </div>
          </div>

          {/* Call Controls */}
          <div className="bg-white border-t border-slate-300/50 p-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-red-500/20 text-red-400' : 'bg-[#1E3A5F]/50 text-slate-900 hover:bg-[#1E3A5F]'
                }`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isVideoOff ? 'bg-red-500/20 text-red-400' : 'bg-[#1E3A5F]/50 text-slate-900 hover:bg-[#1E3A5F]'
                }`}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>

              <button className="w-12 h-12 rounded-full bg-[#1E3A5F]/50 text-slate-900 hover:bg-[#1E3A5F] flex items-center justify-center transition-all">
                <ScreenShare size={20} />
              </button>

              <Link
                to="/doctor"
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-slate-900 flex items-center justify-center transition-all"
              >
                <PhoneOff size={24} />
              </Link>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center gap-4 mt-4">
              {[
                { id: 'video', icon: Video, label: 'Video' },
                { id: 'chat', icon: MessageSquare, label: 'Chat' },
                { id: 'participants', icon: Users, label: 'Participants' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#0EA5E9] text-slate-900'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {activeTab === 'chat' && (
          <div className="w-80 bg-white border-l border-slate-300/50 flex flex-col">
            <div className="p-4 border-b border-slate-300/50">
              <h3 className="font-semibold text-slate-900">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl ${
                    msg.sender === 'me'
                      ? 'bg-[#0EA5E9] text-slate-900'
                      : 'bg-slate-50 text-slate-700'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-slate-900/70' : 'text-slate-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-300/50">
              <div className="flex gap-2">
                <button className="p-2 text-slate-600 hover:text-slate-900">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-50 border border-slate-300/50 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-[#0EA5E9]/50"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-[#0EA5E9] text-slate-900 rounded-lg hover:bg-[#0284C7]"
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="w-80 bg-white border-l border-slate-300/50">
            <div className="p-4 border-b border-slate-300/50">
              <h3 className="font-semibold text-slate-900">Participants (2)</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/20 flex items-center justify-center">
                  <span className="text-[#0EA5E9] font-medium">Dr</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Dr. Sarah Johnson</p>
                  <p className="text-xs text-emerald-400">● Speaking</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#1E3A5F]/50 flex items-center justify-center">
                  <span className="text-slate-600 font-medium">You</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">You</p>
                  <p className="text-xs text-slate-500">{isMuted ? 'Muted' : 'Unmuted'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
