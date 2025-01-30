<?php
include('config.php');
session_start();

// Ensure the user is logged in as a doctor
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'doctor') {
    header("Location: chat.php");
    exit();
}

// Fetch doctor appointments
$doctor_id = $_SESSION['user_id'];
$appointments_query = "SELECT a.id, u.name AS patient_name, a.date, a.time, a.status 
                       FROM appointments a
                       JOIN users u ON a.patient_id = u.id
                       WHERE a.doctor_id = ?";
$stmt = $conn->prepare($appointments_query);
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$appointments_result = $stmt->get_result();

// Handle appointment status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['complete_appointment'])) {
    $appointment_id = $_POST['appointment_id'];
    $update_status_query = "UPDATE appointments SET status = 'completed' WHERE id = ?";
    $stmt = $conn->prepare($update_status_query);
    $stmt->bind_param("i", $appointment_id);
    $stmt->execute();

    echo "<script>alert('Appointment marked as completed!'); window.location.href='doctor_dashboard.php';</script>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Dashboard</title>
    <link rel="stylesheet" href="style/docdash.css">
</head>
<body>
    <div class="dashboard">
        <h1>Welcome to Doctor Dashboard</h1>
        <button onclick="openChat()">Chat</button>
        <h2>Upcoming Appointments</h2>
        <div class="appointments-list">
            <?php while ($appointment = $appointments_result->fetch_assoc()) { ?>
                <div class="appointment-card">
                    <p>Patient: <?php echo $appointment['patient_name']; ?></p>
                    <p>Date: <?php echo $appointment['date']; ?></p>
                    <p>Time: <?php echo $appointment['time']; ?></p>
                    <p>Status: <?php echo ucfirst($appointment['status']); ?></p>
                    
                    <!-- Display "Mark as Completed" button only for pending appointments -->
                    <?php if ($appointment['status'] === 'pending') { ?>
                        <form action="doctor_dashboard.php" method="POST">
                            <input type="hidden" name="appointment_id" value="<?php echo $appointment['id']; ?>">
                            <button type="submit" name="complete_appointment" class="btn">Mark as Completed</button>
                        </form>
                    <?php } ?>
                </div>
            <?php } ?>
        </div>
    </div>
    <script> 
    function openChat() {
        window.location.href = 'patient_list.php';
    }
     </script>
</body>
</html>
