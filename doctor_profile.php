<?php
include('config.php');
session_start();

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Fetch doctor details
if (isset($_GET['doctor_id'])) {
    $doctor_id = $_GET['doctor_id'];
    $doctor_query = "SELECT u.name, u.profile_picture, d.specialization, d.qualification, d.experience, d.availability 
                     FROM users u 
                     JOIN doctors d ON u.id = d.user_id
                     WHERE u.id = ?";
    $stmt = $conn->prepare($doctor_query);
    $stmt->bind_param("i", $doctor_id);
    $stmt->execute();
    $doctor_result = $stmt->get_result();
    $doctor = $doctor_result->fetch_assoc();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Profile</title>
    <link rel="stylesheet" href="style/docpro.css">
</head>
<body>
    <div class="profile-container">
        <h1>Doctor Profile</h1>
        <img src="<?php echo $doctor['profile_picture']; ?>" alt="Doctor Picture">
        <h2><?php echo $doctor['name']; ?></h2>
        <p>Specialization: <?php echo $doctor['specialization']; ?></p>
        <p>Qualification: <?php echo $doctor['qualification']; ?></p>
        <p>Experience: <?php echo $doctor['experience']; ?> years</p>
        <p>Availability: <?php echo $doctor['availability']; ?></p>
        <a href="book_appointment.php?doctor_id=<?php echo $doctor_id; ?>" class="btn">Book Appointment</a>
    </div>
    
    <!-- Hidden input to pass doctor_id to JavaScript -->
    <input type="hidden" id="doctor_id" value="<?php echo $doctor_id; ?>">

    <button onclick="openChat()">Chat</button>

    <a href="chat.php?doctor_id=<?php echo $doctor_id; ?>">Chat with Doctor</a>

    <button onclick="startVideoCall()">Video Call</button>

    <script>
    function openChat() {
        let doctorId = document.getElementById("doctor_id").value;
        window.location.href = "chat.html?receiver_id=" + doctorId;
    }

    function startVideoCall() {
        let doctorId = document.getElementById("doctor_id").value;
        window.location.href = "video_call.php?receiver_id=" + doctorId;
    }
    </script>

</body>
</html>
