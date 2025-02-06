<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "healthcare";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['doctor_id'])) {
    $_SESSION['receiver_id'] = $_GET['doctor_id'];
    $_SESSION['receiver_role'] = 'doctor';
} elseif (isset($_GET['patient_id'])) {
    $_SESSION['receiver_id'] = $_GET['patient_id'];
    $_SESSION['receiver_role'] = 'patient';
}

$_SESSION['sender_id'] = $_SESSION['user_id'];
$_SESSION['sender_role'] = $_SESSION['role'];
$receiver_id = $_SESSION['receiver_id'];
$receiver_role = $_SESSION['receiver_role'];
$sender_id = $_SESSION['sender_id'];

if ($sender_id == $receiver_id) {
    die("You can't chat with yourself.");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat & Video Call</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-peer@9.11.0/simple-peer.min.js"></script>
    <style>
        .chat-box { width: 100%; height: 300px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; }
        .message { margin: 10px 0; padding: 5px; border-radius: 5px; }
        .doctor { background-color: #d1f7d1; text-align: left; }
        .patient { background-color: #f0f0f0; text-align: right; }
        #videoContainer { width: 100%; height: 400px; display: none; }
        video { width: 45%; margin: 5px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h2>Chat with <?php echo ucfirst($receiver_role); ?> (ID: <?php echo $receiver_id; ?>)</h2>
    
    <div class="chat-box" id="chatBox"></div>
    
    <textarea id="messageInput" rows="2" cols="50" placeholder="Type your message..."></textarea>
    <button onclick="sendMessage()">Send</button>
    
    <br><br>
    <button id="startVideoCall" onclick="startVideoCall()">Start Video Call</button>
    
    <div id="videoContainer">
        <video id="localVideo" autoplay muted></video>
        <video id="remoteVideo" autoplay></video>
        <button onclick="endCall()">End Call</button>
    </div>

    <script>
        function loadMessages() {
            $.ajax({
                url: '../scripts/fetch_messages.php',
                type: 'GET',
                data: { sender_id: <?php echo $sender_id; ?>, receiver_id: <?php echo $receiver_id; ?> },
                success: function(response) {
                    $('#chatBox').html(response);
                }
            });
        }

        function sendMessage() {
            let message = $('#messageInput').val();
            if (message.trim() !== '') {
                $.ajax({
                    url: '../scripts/send_message.php',
                    type: 'POST',
                    data: { message: message, sender_id: <?php echo $sender_id; ?>, receiver_id: <?php echo $receiver_id; ?> },
                    success: function(response) {
                        $('#messageInput').val('');
                        loadMessages();
                    }
                });
            }
        }

        let localStream, remoteStream, peer;

        function startVideoCall() {
            document.getElementById('videoContainer').style.display = 'block';
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    localStream = stream;
                    document.getElementById('localVideo').srcObject = localStream;
                    peer = new SimplePeer({ initiator: true, trickle: false, stream: localStream });
                    peer.on('signal', signal => {
                        $.ajax({
                            url: 'send_signal.php',
                            type: 'POST',
                            data: { signal: JSON.stringify(signal), receiver_id: <?php echo $receiver_id; ?> },
                            success: function(response) {
                                console.log("Signal sent to peer.");
                            }
                        });
                    });
                    peer.on('stream', stream => {
                        remoteStream = stream;
                        document.getElementById('remoteVideo').srcObject = remoteStream;
                    });
                })
                .catch(err => console.log("Error accessing media devices.", err));
        }

        function endCall() {
            peer.destroy();
            localStream.getTracks().forEach(track => track.stop());
            remoteStream.getTracks().forEach(track => track.stop());
            document.getElementById('videoContainer').style.display = 'none';
        }

        setInterval(loadMessages, 2000);
        loadMessages();
    </script>
</body>
</html>
