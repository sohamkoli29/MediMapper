let localStream, remoteStream, peerConnection;

function startVideoCall() {
    document.getElementById('videoContainer').style.display = 'block';

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        document.getElementById('localVideo').srcObject = stream;
        peerConnection = new RTCPeerConnection();

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            document.getElementById('remoteVideo').srcObject = remoteStream;
        };

        peerConnection.createOffer().then(offer => {
            return peerConnection.setLocalDescription(offer);
        }).then(() => {
            sendSignalToPeer({ type: 'offer', sdp: peerConnection.localDescription });
        });
    })
    .catch(error => console.error('Error accessing media devices.', error));
}

function endCall() {
    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());
    document.getElementById('videoContainer').style.display = 'none';
}
