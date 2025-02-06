<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "chat_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$receiver_id = $_POST['receiver_id'];
$signal = $_POST['signal'];  // WebRTC signal data (SDP and ICE)

$sql = "INSERT INTO signals (receiver_id, signal_data) VALUES ('$receiver_id', '$signal')";
if ($conn->query($sql) === TRUE) {
    echo "Signal sent!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
