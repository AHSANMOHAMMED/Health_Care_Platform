import React, { useEffect } from 'react';
import { VideoOff, MicOff, PhoneOff } from 'lucide-react';

export default function VideoConsultation() {
    
    // Simulate Jitsi Iframe loading
    useEffect(() => {
        // Normally inject Jitsi script here
    }, []);

    return (
        <div className="h-[80vh] bg-slate-900 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl">
            {/* Header */}
            <div className="bg-slate-800/50 absolute top-0 w-full p-4 flex justify-between items-center z-10 backdrop-blur-md">
                <div>
                    <h3 className="text-white font-bold">Consultation with Dr. Sarah Jenkins</h3>
                    <p className="text-emerald-400 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Secure Connection
                    </p>
                </div>
                <div className="bg-slate-900/80 px-3 py-1 rounded-full text-white text-sm font-mono tracking-wider">
                    14:52
                </div>
            </div>

            {/* Video Area (Simulated) */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Doctor Video placeholder */}
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80" alt="Doctor" className="w-full h-full object-cover opacity-80" />
                
                {/* PIP Patient Video placeholder */}
                <div className="absolute bottom-24 right-8 w-48 h-64 bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/50">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Patient" className="w-full h-full object-cover" />
                </div>
                
                {/* Overlay text if iframe not loaded yet */}
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-slate-900/60 backdrop-blur-sm z-0">
                    <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg font-medium">Connecting to Jitsi Meet infrastructure...</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-950 p-6 flex justify-center gap-6 items-center z-10 w-full absolute bottom-0">
                <button className="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition shadow-lg">
                    <MicOff size={24} />
                </button>
                <button className="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition shadow-lg">
                    <VideoOff size={24} />
                </button>
                <button className="h-14 w-32 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg gap-2 font-bold px-6">
                    <PhoneOff size={20} /> End Walk
                </button>
            </div>
        </div>
    );
}
