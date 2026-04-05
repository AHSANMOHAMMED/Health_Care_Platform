import type { IAgoraRTCClient, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useRef, useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle, 
  Share, 
  Settings, 
  Users,
  Monitor,
  AlertCircle,
  Wifi,
  WifiOff,
  Clock,
  Heart
} from 'lucide-react';

export type AgoraRoomProps = { 
  appId: string; 
  channel: string; 
  token: string; 
  uid: number;
  doctorName?: string;
  patientName?: string;
  consultationType?: 'video' | 'audio';
};

/**
 * Modern telemedicine video consultation room with professional healthcare UI.
 * For production: fetch short-lived token from telemedicine-service; enable TLS; handle reconnect.
 */
export function AgoraVideoRoom({ 
  appId, 
  channel, 
  token, 
  uid, 
  doctorName = 'Dr. Sarah Johnson',
  patientName = 'John Smith',
  consultationType = 'video'
}: AgoraRoomProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [consultationTime, setConsultationTime] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');

  useEffect(() => {
    let client: IAgoraRTCClient | null = null;
    let local: ILocalVideoTrack | null = null;
    let interval: NodeJS.Timeout | null = null;
    setErr(null);

    (async () => {
      try {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        await client.join(appId, channel, token || null, uid);
        local = await AgoraRTC.createCameraVideoTrack();
        
        if (divRef.current) {
          local.play(divRef.current);
        }
        await client.publish([local]);
        setIsConnected(true);
        
        // Start consultation timer
        interval = setInterval(() => {
          setConsultationTime(prev => prev + 1);
        }, 1000);

        client.on('user-published', async (user, mediaType) => {
          await client!.subscribe(user, mediaType);
          if (mediaType === 'video') {
            const remoteContainer = document.createElement('div');
            remoteContainer.className = 'remote-video-container';
            remoteContainer.style.cssText = 'position: absolute; top: 16px; right: 16px; width: 200px; height: 150px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);';
            divRef.current?.appendChild(remoteContainer);
            user.videoTrack?.play(remoteContainer);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        client.on('user-unpublished', (user) => {
          // Handle user leaving
        });

        // Simulate connection quality changes
        const qualityInterval = setInterval(() => {
          const qualities: Array<'excellent' | 'good' | 'poor'> = ['excellent', 'good', 'poor'];
          setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
        }, 10000);

        return () => {
          clearInterval(qualityInterval);
        };

      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Agora error');
        setIsConnected(false);
      }
    })();

    return () => {
      if (interval) clearInterval(interval);
      local?.close();
      client?.leave().catch(() => {});
      setIsConnected(false);
      setConsultationTime(0);
    };
  }, [appId, channel, token, uid]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual mute functionality
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Implement actual video toggle functionality
  };

  const endCall = () => {
    // Implement call ending functionality
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <div className="glass-effect border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full healthcare-gradient flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">MedCare Telemedicine</h1>
                <p className="text-sm text-gray-600">Secure Video Consultation</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{formatTime(consultationTime)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {connectionQuality === 'excellent' ? (
                <Wifi className={`h-4 w-4 ${getConnectionQualityColor()}`} />
              ) : (
                <WifiOff className={`h-4 w-4 ${getConnectionQualityColor()}`} />
              )}
              <span className={`text-sm font-medium capitalize ${getConnectionQualityColor()}`}>
                {connectionQuality}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {err ? (
            <div className="flex items-center justify-center h-full">
              <div className="healthcare-card p-8 max-w-md text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h3>
                <p className="text-gray-600 mb-4">{err}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="healthcare-button"
                >
                  Reconnect
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative h-full bg-black">
                {/* Main Video */}
                <div 
                  ref={divRef} 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: isVideoOff ? '#1f2937' : 'black' }}
                >
                  {isVideoOff && (
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-white text-lg font-medium">Camera is off</p>
                    </div>
                  )}
                </div>

                {/* Remote Video Picture-in-Picture */}
                {/* This will be added dynamically when remote user joins */}

                {/* Overlay Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">{consultationType === 'video' ? patientName : doctorName}</h3>
                      <p className="text-sm opacity-90">
                        {consultationType === 'video' ? 'Patient' : 'Doctor'} • {consultationType === 'video' ? 'Video Call' : 'Audio Call'}
                      </p>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setShowMic(!showMic)}
                      className={`p-4 rounded-full transition-all duration-200 ${
                        isMuted 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                      }`}
                    >
                      {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </button>

                    <button
                      onClick={toggleVideo}
                      className={`p-4 rounded-full transition-all duration-200 ${
                        isVideoOff 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                      }`}
                    >
                      {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                    </button>

                    <button
                      onClick={endCall}
                      className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                    >
                      <Phone className="h-6 w-6 transform rotate-135" />
                    </button>

                    <button
                      onClick={() => setShowChat(!showChat)}
                      className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-200"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </button>

                    <button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`p-4 rounded-full transition-all duration-200 ${
                        isScreenSharing 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                      }`}
                    >
                      <Monitor className="h-6 w-6" />
                    </button>

                    <button
                      onClick={() => setShowParticipants(!showParticipants)}
                      className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-200"
                    >
                      <Users className="h-6 w-6" />
                    </button>

                    <button className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-200">
                      <Settings className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Side Panel */}
        {(showChat || showParticipants) && (
          <div className="w-80 healthcare-card border-l border-white/20">
            {showChat && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Consultation Chat</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">D</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Hello! How can I help you today?</p>
                        <p className="text-xs text-gray-500 mt-1">Dr. Sarah • 10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">P</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">I've been experiencing headaches for the past few days.</p>
                        <p className="text-xs text-gray-500 mt-1">You • 10:31 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 healthcare-input text-sm"
                    />
                    <button className="healthcare-button px-4 py-2">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showParticipants && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Participants (2)</h3>
                </div>
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-semibold">D</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Dr. Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Doctor • Host</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4 text-green-500" />
                        <Mic className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-white font-semibold">P</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">John Smith</p>
                        <p className="text-sm text-gray-600">Patient</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isVideoOff ? (
                          <VideoOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Video className="h-4 w-4 text-green-500" />
                        )}
                        {isMuted ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Add User icon import
import { User } from 'lucide-react';
