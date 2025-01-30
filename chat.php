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

// Determine user role and chat partner
if (isset($_GET['doctor_id'])) {
    $_SESSION['receiver_id'] = $_GET['doctor_id'];
    $_SESSION['receiver_role'] = 'doctor';
} elseif (isset($_GET['patient_id'])) {
    $_SESSION['receiver_id'] = $_GET['patient_id'];
    $_SESSION['receiver_role'] = 'patient';
}

$_SESSION['sender_id'] = $_SESSION['user_id'];  // Logged-in user ID
$_SESSION['sender_role'] = $_SESSION['role'];  // 'doctor' or 'patient'
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        .chat-box { width: 100%; height: 300px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; }
        .message { margin: 10px 0; padding: 5px; border-radius: 5px; }
        .doctor { background-color:rgb(12, 244, 12); text-align: left; }
        .patient { background-color: #f0f0f0; text-align: right; }
    </style>
</head>
<body>

    <h2>Chat with <?php echo ucfirst($_SESSION['role']); ?> (ID: <?php echo $_SESSION['receiver_id']; ?>)</h2>
    
    <div class="chat-box" id="chatBox"></div>

    <textarea id="messageInput" rows="2" cols="50" placeholder="Type your message..."></textarea>
    <button onclick="sendMessage()">Send</button>

    <button onclick="startVideoCall()">Start Video Call</button>

    <script>
        function loadMessages() {
            $.ajax({
                url: 'fetch_messages.php',
                type: 'GET',
                data: { receiver_id: <?php echo $_SESSION['receiver_id']; ?> },
                success: function(response) {
                    $('#chatBox').html(response);
                }
            });
        }

        function sendMessage() {
            let message = $('#messageInput').val();
            if (message.trim() !== '') {
                $.ajax({
                    url: 'send_message.php',
                    type: 'POST',
                    data: { message: message },
                    success: function(response) {
                        $('#messageInput').val('');
                        loadMessages();
                    }
                });
            }
        }

        setInterval(loadMessages, 2000);
        loadMessages();
    </script>

</body>
</html>
