<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    echo "Not logged in";
    exit();
}

$receiver_id = $_GET['receiver_id']; // Get doctor ID from URL
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Call</title>
    <script src="video.js"></script>
</head>
<body>
    <h2>Video Call with <?php echo ($receiver_id == 1 ? "Doctor" : "Patient"); ?></h2>
    <video id="localVideo" autoplay></video>
    <video id="remoteVideo" autoplay></video>
    <button onclick="startCall()">Start Call</button>
</body>
</html>
