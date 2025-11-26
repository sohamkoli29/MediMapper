// client/src/components/VideoCall/VideoCall.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Maximize2, 
  Minimize2,
  Camera,
  CameraOff,
  User
} from 'lucide-react';

const VideoCall = ({ 
  localStream, 
  remoteStream, 
  onEndCall, 
  isCalling,
  callStatus,
  remoteUser,
  onToggleMic,
  onToggleVideo,
  isMicOn,
  isVideoOn
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const hideControlsTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log('Setting local stream:', localStream);
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('Setting remote stream:', remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    const resetHideTimer = () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      setShowControls(true);
      hideControlsTimeoutRef.current = setTimeout(() => {
        if (!isCalling && callStatus === 'connected') {
          setShowControls(false);
        }
      }, 3000);
    };

    resetHideTimer();
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isCalling, callStatus]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getStatusMessage = () => {
    switch (callStatus) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return 'Ringing...';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      default:
        return '';
    }
  };

  const getConnectionStatus = () => {
    if (remoteStream) {
      return 'Video connected';
    } else if (callStatus === 'connected') {
      return 'Audio connected - waiting for video';
    }
    return getStatusMessage();
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900 z-50 flex flex-col"
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onCanPlay={() => console.log('Remote video can play')}
            onError={(e) => console.error('Remote video error:', e)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 p-4">
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              {remoteUser?.profilePicture ? (
                <img 
                  src={remoteUser.profilePicture} 
                  alt={remoteUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              )}
            </div>
            <p className="text-white text-lg sm:text-xl mb-2 text-center">
              {remoteUser?.name || 'Connecting...'}
            </p>
            <p className="text-gray-400 text-sm sm:text-base text-center">
              {getConnectionStatus()}
            </p>
            {callStatus === 'connected' && !remoteStream && (
              <div className="mt-4 flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
        )}

        {/* Local Video (Picture-in-Picture) - Responsive sizing */}
        <div className={`
          absolute bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700
          transition-all duration-300
          ${isMobile 
            ? 'top-2 right-2 w-20 h-28' // Smaller on mobile
            : 'top-4 right-4 w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-48' // Progressive sizing
          }
          ${!localStream || !isVideoOn ? 'border-dashed border-gray-600' : ''}
        `}>
          {localStream && isVideoOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
              onCanPlay={() => console.log('Local video can play')}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 p-2">
              <CameraOff className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-500 mb-1" />
              <span className="text-gray-400 text-xs text-center">
                {localStream ? 'Camera off' : 'No camera'}
              </span>
            </div>
          )}
        </div>

        {/* Connection Status Overlay */}
        {callStatus === 'connected' && showControls && (
          <div className={`
            absolute bg-black bg-opacity-70 px-3 py-2 rounded-lg
            ${isMobile ? 'top-2 left-2' : 'top-4 left-4'}
            flex items-center space-x-2
          `}>
            <div className={`w-2 h-2 rounded-full ${
              remoteStream ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <div>
              <p className="text-white font-medium text-sm sm:text-base">
                {remoteUser?.name || 'User'}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm">
                {remoteStream ? 'Video connected' : 'Connecting video...'}
              </p>
            </div>
          </div>
        )}

        {/* Call Status Banner */}
        {callStatus !== 'connected' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 px-4 py-3 rounded-lg">
            <p className="text-white text-lg text-center">{getStatusMessage()}</p>
          </div>
        )}
      </div>

      {/* Controls - Responsive for mobile */}
      <div 
        className={`
          absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent 
          transition-opacity duration-300
          ${showControls ? 'opacity-100' : 'opacity-0'}
          ${isMobile ? 'p-3' : 'p-4 sm:p-6'}
        `}
      >
        <div className={`
          flex items-center justify-center
          ${isMobile ? 'space-x-3' : 'space-x-4'}
        `}>
          {/* Microphone Toggle */}
          <button
            onClick={onToggleMic}
            className={`
              rounded-full flex items-center justify-center transition-all
              ${isMicOn 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-red-600 hover:bg-red-700'
              }
              ${isMobile ? 'w-12 h-12' : 'w-14 h-14'}
            `}
            title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isMicOn ? (
              <Mic className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            ) : (
              <MicOff className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className={`
              bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center 
              transition-all transform hover:scale-110
              ${isMobile ? 'w-14 h-14' : 'w-16 h-16'}
            `}
            title="End call"
          >
            <Phone className={`text-white transform rotate-135 ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
          </button>

          {/* Video Toggle */}
          <button
            onClick={onToggleVideo}
            className={`
              rounded-full flex items-center justify-center transition-all
              ${isVideoOn 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-red-600 hover:bg-red-700'
              }
              ${isMobile ? 'w-12 h-12' : 'w-14 h-14'}
            `}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? (
              <Video className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            ) : (
              <VideoOff className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            )}
          </button>

          {/* Fullscreen Toggle - Hide on mobile if not supported well */}
          {!isMobile && (
            <button
              onClick={toggleFullscreen}
              className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-6 h-6 text-white" />
              ) : (
                <Maximize2 className="w-6 h-6 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Status Bar */}
        <div className="text-center mt-3">
          <p className="text-white text-sm opacity-80">
            {getConnectionStatus()}
          </p>
        </div>
      </div>

      {/* Mobile-specific touch area to show controls */}
      {isMobile && (
        <div 
          className="absolute inset-0 z-10"
          onTouchStart={() => setShowControls(true)}
          style={{ pointerEvents: showControls ? 'none' : 'auto' }}
        />
      )}

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
        
        /* Improve video quality */
        video {
          -webkit-transform: scaleX(-1);
          transform: scaleX(-1);
        }
        
        /* Ensure proper video sizing */
        @media (max-width: 768px) {
          video {
            object-fit: cover;
          }
        }

        /* Animation for connection status */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoCall;