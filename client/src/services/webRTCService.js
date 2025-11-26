// client/src/services/webRTCService.js
class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.socket = null;
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        // You can add TURN servers here for better connectivity
        // {
        //   urls: 'turn:your-turn-server.com:3478',
        //   username: 'username',
        //   credential: 'password'
        // }
      ]
    };
  }

  setSocket(socket) {
    this.socket = socket;
  }

  async initializeLocalStream() {
    try {
      console.log('Requesting media devices...');
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 480, max: 1080 },
          frameRate: { ideal: 30, min: 20, max: 30 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
          sampleSize: 16
        }
      });
      
      console.log('Local stream obtained:', this.localStream);
      console.log('Video tracks:', this.localStream.getVideoTracks());
      console.log('Audio tracks:', this.localStream.getAudioTracks());
      
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      // Try with lower constraints if failed
      try {
        console.log('Trying with lower constraints...');
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 },
            frameRate: { ideal: 24, min: 15 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        return this.localStream;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('Cannot access camera and microphone. Please check permissions.');
      }
    }
  }

  async createPeerConnection(isInitiator, remoteUserId) {
    try {
      console.log('Creating peer connection for:', remoteUserId, 'Initiator:', isInitiator);
      
      this.peerConnection = new RTCPeerConnection(this.configuration);

      // Add local stream tracks to peer connection
      if (this.localStream) {
        console.log('Adding local tracks to peer connection');
        this.localStream.getTracks().forEach(track => {
          console.log('Adding track:', track.kind, track.id);
          this.peerConnection.addTrack(track, this.localStream);
        });
      }

      // Create new MediaStream for remote stream
      this.remoteStream = new MediaStream();
      
      // Handle incoming remote tracks
this.peerConnection.ontrack = (event) => {
  console.log('Received remote track:', event.track.kind, event.track.id);
  
  if (event.streams && event.streams[0]) {
    // Clear existing tracks to avoid duplicates
    this.remoteStream.getTracks().forEach(track => this.remoteStream.removeTrack(track));
    
    // Add new tracks from the remote stream
    event.streams[0].getTracks().forEach(track => {
      console.log('Adding remote track to remote stream:', track.kind, track.id);
      this.remoteStream.addTrack(track);
    });
    
    // Notify about remote stream update
    if (this.onRemoteStreamUpdate) {
      console.log('Calling remote stream update callback');
      this.onRemoteStreamUpdate(this.remoteStream);
    }
  }
};

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.socket) {
          console.log('Sending ICE candidate');
          this.socket.emit('ice_candidate', {
            candidate: event.candidate,
            to: remoteUserId
          });
        }
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        const state = this.peerConnection.connectionState;
        console.log('Connection state:', state);
        
        if (state === 'connected') {
          console.log('Peer connection established successfully');
        } else if (state === 'failed' || state === 'disconnected') {
          console.error('Peer connection failed or disconnected');
        }
      };

      // Handle ICE connection state changes
      this.peerConnection.oniceconnectionstatechange = () => {
        const state = this.peerConnection.iceConnectionState;
        console.log('ICE connection state:', state);
      };

      // Handle ICE gathering state changes
      this.peerConnection.onicegatheringstatechange = () => {
        console.log('ICE gathering state:', this.peerConnection.iceGatheringState);
      };

      // Handle signaling state changes
      this.peerConnection.onsignalingstatechange = () => {
        console.log('Signaling state:', this.peerConnection.signalingState);
      };

      if (isInitiator) {
        await this.createAndSendOffer(remoteUserId);
      }

      return this.peerConnection;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      throw error;
    }
  }

  async createAndSendOffer(remoteUserId) {
    try {
      console.log('Creating offer...');
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Setting local description...');
      await this.peerConnection.setLocalDescription(offer);
      
      if (this.socket) {
        console.log('Sending offer to:', remoteUserId);
        this.socket.emit('video_call_offer', {
          offer,
          to: remoteUserId
        });
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async handleOffer(offer, remoteUserId) {
    try {
      console.log('Received offer, setting remote description...');
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      console.log('Creating answer...');
      const answer = await this.peerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Setting local description for answer...');
      await this.peerConnection.setLocalDescription(answer);
      
      if (this.socket) {
        console.log('Sending answer to:', remoteUserId);
        this.socket.emit('video_call_answer', {
          answer,
          to: remoteUserId
        });
      }
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  }

  async handleAnswer(answer) {
    try {
      console.log('Received answer, setting remote description...');
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Remote description set successfully');
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  async handleIceCandidate(candidate) {
    try {
      if (this.peerConnection) {
        console.log('Adding ICE candidate');
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  setRemoteStreamUpdateCallback(callback) {
    this.onRemoteStreamUpdate = callback;
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      console.log('Audio', enabled ? 'enabled' : 'disabled');
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      console.log('Video', enabled ? 'enabled' : 'disabled');
    }
  }

  closeConnection() {
    console.log('Closing WebRTC connection');
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.onRemoteStreamUpdate = null;
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }

  // Check if peer connection is established
  isConnected() {
    return this.peerConnection && this.peerConnection.connectionState === 'connected';
  }
}

export default new WebRTCService();