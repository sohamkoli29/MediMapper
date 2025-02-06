<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "healthcare";

// Connect to database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure doctor is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'doctor') {
    die("Access denied.");
}

$doctor_id = $_SESSION['user_id'];  // Logged-in doctor ID

// Fetch list of patients the doctor has interacted with
$sql = "SELECT DISTINCT users.id, users.name 
        FROM users 
        INNER JOIN messages 
        ON (users.id = messages.sender_id OR users.id = messages.receiver_id)
        WHERE (messages.sender_id = '$doctor_id' OR messages.receiver_id = '$doctor_id') 
        AND users.role = 'patient'";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient List</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { width: 50%; margin: auto; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; }
        th { background-color:rgb(65, 64, 64); }
        .chat-btn { padding: 5px 10px; background: green; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>

<div class="container">
    <h2>Your Patients</h2>
    
    <table>
        <tr>
            <th>Patient Name</th>
            <th>Action</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>
                        <td>{$row['name']}</td>
                        <td><a class='chat-btn' href='chat.php?patient_id={$row['id']}'>Chat</a></td>
                      </tr>";
            }
        } else {
            echo "<tr><td colspan='2'>No patients found.</td></tr>";
        }
        ?>
    </table>

</div>

</body>
</html>
