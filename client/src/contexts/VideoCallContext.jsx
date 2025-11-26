// client/src/contexts/VideoCallContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import webRTCService from '../services/webRTCService';
import IncomingCall from '../components/VideoCall/IncomingCall';
import VideoCall from '../components/VideoCall/VideoCall';

const VideoCallContext = createContext();

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within VideoCallProvider');
  }
  return context;
};

export const VideoCallProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Video call states
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    if (socket && user) {
      setupVideoCallListeners();
    }

    return () => {
      if (socket) {
        cleanupVideoCallListeners();
      }
    };
  }, [socket, user]);

  const setupVideoCallListeners = () => {
    if (!socket) return;

    // Incoming call
    socket.on('incoming_video_call', async (data) => {
      console.log('🔔 Incoming video call from:', data.caller.name);
      setCaller(data.caller);
      setIncomingCall(true);
      setCallStatus('ringing');
    });

    // Call accepted
    socket.on('video_call_accepted', async (data) => {
      console.log('✅ Call accepted by:', data.from);
      setCallStatus('connecting');
      setInCall(true);
      
      try {
        await webRTCService.createPeerConnection(true, data.from);
        setLocalStream(webRTCService.getLocalStream());
      } catch (error) {
        console.error('Error in call accepted:', error);
        endCall();
      }
    });

    // Call rejected
    socket.on('video_call_rejected', () => {
      console.log('❌ Call rejected');
      alert('Call was rejected');
      endCall();
    });

    // Call ended
    socket.on('video_call_ended', () => {
      console.log('📞 Call ended by other user');
      endCall();
    });

    // WebRTC Offer
    socket.on('video_call_offer', async (data) => {
      console.log('📤 Received offer from:', data.from);
      try {
        await webRTCService.handleOffer(data.offer, data.from);
        setCallStatus('connected');
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    // WebRTC Answer
    socket.on('video_call_answer', async (data) => {
      console.log('📥 Received answer from:', data.from);
      try {
        await webRTCService.handleAnswer(data.answer);
        setCallStatus('connected');
        setRemoteStream(webRTCService.getRemoteStream());
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    // ICE Candidate
    socket.on('ice_candidate', async (data) => {
      try {
        await webRTCService.handleIceCandidate(data.candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    });

    // User offline
    socket.on('user_offline', (data) => {
      alert(`${receiver?.name || 'User'} is currently offline`);
      endCall();
    });
  };

  const cleanupVideoCallListeners = () => {
    if (!socket) return;
    
    socket.off('incoming_video_call');
    socket.off('video_call_accepted');
    socket.off('video_call_rejected');
    socket.off('video_call_ended');
    socket.off('video_call_offer');
    socket.off('video_call_answer');
    socket.off('ice_candidate');
    socket.off('user_offline');
  };

  const initiateCall = async (receiverUser) => {
    if (!socket || !receiverUser) {
      alert('Cannot initiate call. Please try again.');
      return;
    }

    try {
      setReceiver(receiverUser);
      setCallStatus('calling');
      
      webRTCService.setSocket(socket);
      const stream = await webRTCService.initializeLocalStream();
      setLocalStream(stream);
      
      socket.emit('initiate_video_call', {
        to: receiverUser.id || receiverUser._id,
        caller: {
          id: user.id || user._id,
          name: user.name,
          profilePicture: user.profilePicture,
          role: user.role,
          specialization: user.specialization
        }
      });
      
      setInCall(true);
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
      endCall();
    }
  };

  const acceptCall = async () => {
    try {
      setIncomingCall(false);
      setInCall(true);
      setCallStatus('connecting');
      setReceiver(caller);
      
      webRTCService.setSocket(socket);
      const stream = await webRTCService.initializeLocalStream();
      setLocalStream(stream);
      
      await webRTCService.createPeerConnection(false, caller.id);
      
      socket.emit('accept_video_call', {
        to: caller.id,
        from: user.id || user._id
      });
      
      // Navigate to chat page if not already there
      if (!window.location.pathname.includes('/chat')) {
        navigate(`/chat/${caller.id}`);
      }
      
    } catch (error) {
      console.error('Error accepting call:', error);
      alert('Failed to accept call. Please try again.');
      endCall();
    }
  };

  const rejectCall = () => {
    if (socket && caller) {
      socket.emit('reject_video_call', {
        to: caller.id
      });
    }
    setIncomingCall(false);
    setCaller(null);
    setCallStatus('idle');
  };

  const endCall = () => {
    const otherUserId = receiver?.id || receiver?._id || caller?.id;
    
    if (socket && otherUserId) {
      socket.emit('end_video_call', {
        to: otherUserId
      });
    }
    
    webRTCService.closeConnection();
    
    setInCall(false);
    setIncomingCall(false);
    setCaller(null);
    setReceiver(null);
    setCallStatus('idle');
    setLocalStream(null);
    setRemoteStream(null);
    setIsMicOn(true);
    setIsVideoOn(true);
  };

  const toggleMic = () => {
    const newState = !isMicOn;
    setIsMicOn(newState);
    webRTCService.toggleAudio(newState);
  };

  const toggleVideo = () => {
    const newState = !isVideoOn;
    setIsVideoOn(newState);
    webRTCService.toggleVideo(newState);
  };

  const value = {
    inCall,
    incomingCall,
    caller,
    receiver,
    callStatus,
    isMicOn,
    isVideoOn,
    localStream,
    remoteStream,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMic,
    toggleVideo
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
      
      {/* Global Incoming Call Modal */}
      {incomingCall && !inCall && (
        <IncomingCall
          caller={caller}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Global Video Call UI */}
      {inCall && (
        <VideoCall
          localStream={localStream}
          remoteStream={remoteStream}
          onEndCall={endCall}
          isCalling={callStatus !== 'connected'}
          callStatus={callStatus}
          remoteUser={receiver || caller}
          onToggleMic={toggleMic}
          onToggleVideo={toggleVideo}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
        />
      )}
    </VideoCallContext.Provider>
  );
};