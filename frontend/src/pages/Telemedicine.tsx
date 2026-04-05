import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone,
  PhoneOff,
  MessageSquare, 
  Share,
  Settings,
  Monitor,
  Maximize2,
  Volume2,
  VolumeX,
  Users,
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

interface Participant {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  videoStream?: MediaStream;
  audioStream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
}

interface SessionInfo {
  sessionId: string;
  appointmentId: string;
  doctorName: string;
  patientName: string;
  startTime: Date;
  status: 'waiting' | 'active' | 'ended';
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

export default function Telemedicine() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const sessionId = params.get('session');
  const appointmentId = params.get('appointment');
  
  // State management
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId || !appointmentId) {
      setError('Invalid session parameters');
      setLoading(false);
      return;
    }

    initializeSession();
    
    return () => {
      cleanupSession();
    };
  }, [sessionId, appointmentId]);

  useEffect(() => {
    if (connectionStatus === 'active') {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [connectionStatus]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      
      // Fetch session info
      const sessionResponse = await api.get(`/telemedicine/session/${sessionId}`);
      setSessionInfo(sessionResponse.data);

      // Initialize media devices
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC connection
      await initializeWebRTC();

      setConnectionStatus('connected');
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to initialize session:', err);
      setError(err.message || 'Failed to initialize telemedicine session');
      setConnectionStatus('error');
      setLoading(false);
    }
  };

  const initializeWebRTC = async () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    // Add local stream to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to signaling server
        api.post(`/telemedicine/session/${sessionId}/ice-candidate`, {
          candidate: event.candidate
        });
      }
    };

    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    await api.post(`/telemedicine/session/${sessionId}/offer`, {
      offer: offer
    });
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (peerConnectionRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          peerConnectionRef.current.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'video') {
              sender.replaceTrack(videoTrack);
            }
          });
        }
        
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
        
        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        if (localStream && peerConnectionRef.current) {
          const videoTrack = localStream.getVideoTracks()[0];
          peerConnectionRef.current.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'video') {
              sender.replaceTrack(videoTrack);
            }
          });
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Failed to toggle screen share:', err);
    }
  };

  const endSession = async () => {
    try {
      await api.post(`/telemedicine/session/${sessionId}/end`);
      cleanupSession();
      navigate('/patient');
    } catch (err) {
      console.error('Failed to end session:', err);
      navigate('/patient');
    }
  };

  const cleanupSession = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id?.toString() || '',
      senderName: user?.firstName || 'User',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, message]);
    
    try {
      await api.post(`/telemedicine/session/${sessionId}/chat`, message);
    } catch (err) {
      console.error('Failed to send message:', err);
    }

    setNewMessage('');
  };

  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Initializing telemedicine session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-white text-xl font-bold mb-2">Session Error</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/patient')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Wifi className="text-green-500" size={20} />
            ) : (
              <WifiOff className="text-red-500" size={20} />
            )}
            <span className="text-white font-medium">
              {sessionInfo ? `${sessionInfo.doctorName} - ${sessionInfo.patientName}` : 'Telemedicine Session'}
            </span>
          </div>
          <div className="text-slate-400 text-sm">
            {formatSessionTime(sessionTime)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 rounded-lg transition ${showParticipants ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          >
            <Users size={20} />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition ${showChat ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          >
            <MessageSquare size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition">
            <Settings size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition">
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Remote Video (Main) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-slate-800 rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center bg-slate-700">
                <VideoOff className="text-slate-500" size={32} />
              </div>
            )}
          </div>

          {/* Connection Status Overlay */}
          {connectionStatus === 'connecting' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
                <p className="text-white text-lg">Connecting to session...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            {/* Chat Panel */}
            {showChat && (
              <>
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-white font-semibold">Chat</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 text-sm font-medium">{message.senderName}</span>
                        <span className="text-slate-500 text-xs">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Participants Panel */}
            {showParticipants && (
              <>
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-white font-semibold">Participants ({participants.length + 1})</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Local User */}
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">You</p>
                      <p className="text-slate-400 text-sm">
                        {isMuted ? 'Muted' : 'Speaking'} • {isVideoOff ? 'Video Off' : 'Video On'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {isMuted && <MicOff className="text-red-500" size={16} />}
                      {isVideoOff && <VideoOff className="text-red-500" size={16} />}
                    </div>
                  </div>
                  
                  {/* Other Participants */}
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {participant.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{participant.name}</p>
                        <p className="text-slate-400 text-sm capitalize">{participant.role}</p>
                      </div>
                      <div className="flex gap-2">
                        {participant.isMuted && <MicOff className="text-red-500" size={16} />}
                        {participant.isVideoOff && <VideoOff className="text-red-500" size={16} />}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-slate-800 px-6 py-4 border-t border-slate-700">
        <div className="flex items-center justify-center gap-4">
          {/* Microphone */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* Video */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition ${
              isScreenSharing 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            <Monitor size={24} />
          </button>

          {/* End Call */}
          <button
            onClick={endSession}
            className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition flex items-center gap-2"
          >
            <PhoneOff size={24} />
            <span className="font-medium">End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
