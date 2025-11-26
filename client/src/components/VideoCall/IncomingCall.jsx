// client/src/components/VideoCall/IncomingCall.jsx
import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';

const IncomingCall = ({ caller, onAccept, onReject }) => {
  const [ringing, setRinging] = useState(true);

  useEffect(() => {
    // Play ringtone sound (you can add an actual audio file)
    const audio = new Audio('/ringtone.mp3'); // Add a ringtone file to public folder
    audio.loop = true;
    audio.play().catch(e => console.log('Audio play failed:', e));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center animate-fadeIn p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-auto shadow-2xl animate-slideUp">
        {/* Caller Avatar */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 sm:mb-4 ${ringing ? 'animate-pulse' : ''}`}>
            {caller?.profilePicture ? (
              <img 
                src={caller.profilePicture} 
                alt={caller.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl sm:text-3xl text-white font-bold">
                {caller?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            )}
          </div>
          
          {/* Caller Info */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 text-center">
            {caller?.name || 'Unknown Caller'}
          </h2>
          <p className="text-gray-600 capitalize mb-1 text-sm sm:text-base text-center">
            {caller?.role || 'User'}
            {caller?.specialization && ` • ${caller.specialization}`}
          </p>
          
          {/* Call Type */}
          <div className="flex items-center space-x-2 mt-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Video Call</span>
          </div>
        </div>

        {/* Ringing Animation */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Incoming video call...</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
          >
            <PhoneOff className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg animate-pulse"
          >
            <Phone className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default IncomingCall;