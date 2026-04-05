import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Share, 
  Monitor, 
  Maximize2,
  Volume2,
  VolumeX,
  Users,
  Settings,
  Camera,
  CameraOff,
  ScreenShare,
  StopScreenShare,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Download,
  Upload,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  Record,
  Stop,
  Pause,
  Play,
  SkipForward,
  SkipBack,
  Volume1,
  Headphones,
  Wifi as WifiIcon,
  Battery,
  Signal,
  X,
  Plus,
  Minus,
  RotateCw,
  Grid,
  List
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface ConsultationSession {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  startTime: Date;
  status: 'waiting' | 'active' | 'ended' | 'paused';
  type: 'video' | 'audio' | 'chat';
  recordingEnabled: boolean;
  screenShareEnabled: boolean;
  chatEnabled: boolean;
  fileShareEnabled: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'patient';
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  read: boolean;
}

interface Participant {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  videoStream?: MediaStream;
  audioStream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  batteryLevel?: number;
  networkStrength?: number;
}

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

interface ConsultationNotes {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  type: 'observation' | 'prescription' | 'recommendation' | 'general';
}

export default function RealTimeConsultation() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // Session state
  const [session, setSession] = useState<ConsultationSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker' | 'gallery'>('speaker');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Technical state
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('connecting');
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  
  // Settings
  const [videoQuality, setVideoQuality] = useState<'auto' | '720p' | '1080p'>('auto');
  const [audioQuality, setAudioQuality] = useState<'standard' | 'high'>('standard');
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [noiseCancellation, setNoiseCancellation] = useState(true);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid consultation session');
      setLoading(false);
      return;
    }

    initializeConsultation();
    
    return () => {
      cleanupSession();
    };
  }, [sessionId]);

  useEffect(() => {
    if (session?.status === 'active') {
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
  }, [session?.status]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeConsultation = async () => {
    try {
      setLoading(true);
      
      // Fetch session details
      const sessionResponse = await api.get(`/consultation/session/${sessionId}`);
      setSession(sessionResponse.data);

      // Initialize media devices
      await initializeMediaDevices();

      // Setup WebRTC connection
      await setupWebRTC();

      // Connect to signaling server
      await connectToSignalingServer();

      setConnectionStatus('connected');
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to initialize consultation:', err);
      setError(err.message || 'Failed to initialize consultation');
      setConnectionStatus('disconnected');
      setLoading(false);
    }
  };

  const initializeMediaDevices = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: noiseCancellation,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Monitor network quality
      monitorConnectionQuality(stream);
    } catch (err) {
      console.error('Failed to access media devices:', err);
      throw new Error('Camera and microphone access required for video consultation');
    }
  };

  const setupWebRTC = async () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { 
          urls: 'turn:your-turn-server.com:3478',
          username: 'your-username',
          credential: 'your-credential'
        }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    // Add local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to signaling server
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      if (state === 'connected') {
        setConnectionStatus('connected');
      } else if (state === 'disconnected' || state === 'failed') {
        setConnectionStatus('disconnected');
      }
    };
  };

  const connectToSignalingServer = async () => {
    // WebSocket connection for signaling
    const ws = new WebSocket(`wss://your-signaling-server.com/consultation/${sessionId}`);
    
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      await handleSignalingMessage(message);
    };

    ws.onopen = () => {
      // Send join message
      sendSignalingMessage({ type: 'join-session', sessionId });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };
  };

  const handleSignalingMessage = async (message: any) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    switch (message.type) {
      case 'offer':
        await peerConnection.setRemoteDescription(message.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendSignalingMessage({ type: 'answer', answer });
        break;
      
      case 'answer':
        await peerConnection.setRemoteDescription(message.answer);
        break;
      
      case 'ice-candidate':
        await peerConnection.addIceCandidate(message.candidate);
        break;
      
      case 'chat-message':
        setChatMessages(prev => [...prev, message.chatMessage]);
        if (!showChat) {
          setUnreadCount(prev => prev + 1);
        }
        break;
      
      case 'participant-joined':
        setParticipants(prev => [...prev, message.participant]);
        break;
      
      case 'participant-left':
        setParticipants(prev => prev.filter(p => p.id !== message.participantId));
        break;
    }
  };

  const sendSignalingMessage = (message: any) => {
    // Send message through WebSocket
    // Implementation depends on your WebSocket setup
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
        
        setScreenStream(screenStream);
        setIsScreenSharing(true);
        
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream;
        }

        // Add screen share to peer connection
        if (peerConnectionRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(
            s => s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        }

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } else {
        stopScreenShare();
      }
    } catch (err) {
      console.error('Failed to toggle screen share:', err);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      
      // Restore camera video
      if (localStream && peerConnectionRef.current) {
        const videoTrack = localStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find(
          s => s.track && s.track.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }
    }
  };

  const startRecording = () => {
    if (!localStream || !remoteStream) return;

    const tracks = [...localStream.getTracks(), ...remoteStream.getTracks()];
    const combinedStream = new MediaStream(tracks);
    
    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current = mediaRecorder;
    recordingChunksRef.current = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordingChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordingChunksRef.current, { type: 'video/webm' });
      uploadRecording(blob);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecording = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('recording', blob, `consultation-${sessionId}-${Date.now()}.webm`);
      
      await api.post(`/consultation/${sessionId}/recording`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Failed to upload recording:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'patient',
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
      read: false
    };

    setChatMessages(prev => [...prev, message]);
    
    try {
      await api.post(`/consultation/${sessionId}/chat`, message);
      sendSignalingMessage({ type: 'chat-message', chatMessage: message });
    } catch (err) {
      console.error('Failed to send message:', err);
    }

    setNewMessage('');
  };

  const sendFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/consultation/${sessionId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const sharedFile: SharedFile = response.data;
      setSharedFiles(prev => [...prev, sharedFile]);

      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current-user',
        senderName: 'You',
        senderRole: 'patient',
        message: `Shared file: ${file.name}`,
        timestamp: new Date(),
        type: 'file',
        fileUrl: sharedFile.url,
        fileName: sharedFile.name,
        fileSize: sharedFile.size,
        read: false
      };

      setChatMessages(prev => [...prev, message]);
      sendSignalingMessage({ type: 'chat-message', chatMessage: message });
    } catch (error) {
      console.error('Failed to send file:', error);
    }
  };

  const endConsultation = async () => {
    try {
      if (isRecording) {
        stopRecording();
      }
      
      await api.post(`/consultation/${sessionId}/end`);
      cleanupSession();
      navigate('/patient');
    } catch (error) {
      console.error('Failed to end consultation:', error);
      navigate('/patient');
    }
  };

  const cleanupSession = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
  };

  const monitorConnectionQuality = (stream: MediaStream) => {
    // Monitor network quality and update UI
    setInterval(() => {
      // Implementation for monitoring connection quality
      const quality = Math.random() > 0.8 ? 'poor' : Math.random() > 0.5 ? 'good' : 'excellent';
      setNetworkQuality(quality);
    }, 5000);
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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type.includes('pdf')) return <FileText size={16} />;
    return <Paperclip size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Initializing consultation..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-white text-xl font-bold mb-2">Consultation Error</h2>
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
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Wifi className="text-green-500" size={20} />
            ) : (
              <WifiOff className="text-red-500" size={20} />
            )}
            <span className="text-white font-medium">
              {session?.doctorName || 'Consultation'}
            </span>
          </div>
          <div className="text-slate-400 text-sm">
            {formatSessionTime(sessionTime)}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              networkQuality === 'excellent' ? 'bg-green-500' :
              networkQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-slate-400 text-xs capitalize">{networkQuality}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 rounded-lg transition ${
              showParticipants ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Users size={20} />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition relative ${
              showChat ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <MessageSquare size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition ${
              showSettings ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Main Video (Remote or Screen Share) */}
          <div className="w-full h-full relative">
            {isScreenSharing && screenStream ? (
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Connection Status Overlay */}
            {connectionStatus !== 'connected' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center">
                  {connectionStatus === 'connecting' && (
                    <>
                      <RefreshCw className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
                      <p className="text-white text-lg">Connecting...</p>
                    </>
                  )}
                  {connectionStatus === 'disconnected' && (
                    <>
                      <WifiOff className="text-red-500 mx-auto mb-4" size={48} />
                      <p className="text-white text-lg">Connection Lost</p>
                      <button
                        onClick={initializeConsultation}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Reconnect
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <Record size={16} className="animate-pulse" />
                <span className="text-sm">Recording</span>
              </div>
            )}

            {/* View Mode Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-slate-700 text-white' : 'bg-slate-800 bg-opacity-50 text-white'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('speaker')}
                className={`p-2 rounded ${
                  viewMode === 'speaker' ? 'bg-slate-700 text-white' : 'bg-slate-800 bg-opacity-50 text-white'
                }`}
              >
                <Users size={16} />
              </button>
            </div>
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-600">
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
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              {isMuted && <MicOff className="text-red-500" size={12} />}
              {isVideoOff && <VideoOff className="text-red-500" size={12} />}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex flex-col gap-1 ${
                  message.senderRole === 'patient' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`max-w-[70%] ${
                    message.senderRole === 'patient' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                  } rounded-lg p-3`}>
                    {message.type === 'text' && (
                      <p className="text-sm">{message.message}</p>
                    )}
                    {message.type === 'file' && message.fileUrl && (
                      <div className="flex items-center gap-2">
                        {getFileIcon(message.fileName || '')}
                        <div>
                          <p className="text-sm font-medium">{message.fileName}</p>
                          {message.fileSize && (
                            <p className="text-xs opacity-75">{formatFileSize(message.fileSize)}</p>
                          )}
                        </div>
                        <Download size={14} className="cursor-pointer hover:opacity-75" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{message.senderName}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Shared Files */}
            {sharedFiles.length > 0 && (
              <div className="border-t border-slate-700 p-3">
                <h4 className="text-xs text-slate-400 font-medium mb-2">Shared Files</h4>
                <div className="space-y-2">
                  {sharedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                      </div>
                      <Download size={12} className="text-slate-400 cursor-pointer hover:text-white" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Message Input */}
            <div className="border-t border-slate-700 p-3">
              <div className="flex gap-2">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) sendFile(file);
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="p-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <Paperclip size={16} />
                </label>
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
                  className="p-2 text-blue-500 hover:text-blue-400"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants Panel */}
        {showParticipants && (
          <div className="w-64 bg-slate-800 border-l border-slate-700 p-4">
            <h3 className="text-white font-semibold mb-4">Participants</h3>
            <div className="space-y-3">
              {/* Current User */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">Y</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">You</p>
                  <p className="text-slate-400 text-sm">Patient</p>
                </div>
                <div className="flex gap-1">
                  {isMuted && <MicOff className="text-red-500" size={12} />}
                  {isVideoOff && <VideoOff className="text-red-500" size={12} />}
                </div>
              </div>
              
              {/* Other Participants */}
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {participant.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{participant.name}</p>
                    <p className="text-slate-400 text-sm capitalize">{participant.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {participant.isMuted && <MicOff className="text-red-500" size={12} />}
                    {participant.isVideoOff && <VideoOff className="text-red-500" size={12} />}
                    {participant.isScreenSharing && <Monitor className="text-blue-500" size={12} />}
                  </div>
                </div>
              ))}
            </div>
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
            {isScreenSharing ? <StopScreenShare size={24} /> : <ScreenShare size={24} />}
          </button>

          {/* Recording */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full transition ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {isRecording ? <Stop size={24} /> : <Record size={24} />}
          </button>

          {/* End Call */}
          <button
            onClick={endConsultation}
            className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition flex items-center gap-2"
          >
            <PhoneOff size={24} />
            <span className="font-medium">End</span>
          </button>
        </div>
      </div>
    </div>
  );
}
