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

$receiver_id = $_SESSION['user_id'];  // Current user (doctor or patient)

$sql = "SELECT signal_data FROM signals WHERE receiver_id = '$receiver_id' ORDER BY timestamp ASC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row['signal_data'];  // Return signal data to the other peer
} else {
    echo "No signal found.";
}

$conn->close();
?>
