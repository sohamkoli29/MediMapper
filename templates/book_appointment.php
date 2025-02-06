<?php
include('../scripts/config.php');
session_start();

// Ensure the user is logged in as a patient
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'patient') {
    header("Location: login.php");
    exit();
}

// Handle appointment booking
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book'])) {
    $doctor_id = $_POST['doctor_id'];
    $patient_id = $_SESSION['user_id'];
    $date = $_POST['date'];
    $time = $_POST['time'];

    $stmt = $conn->prepare("INSERT INTO appointments (patient_id, doctor_id, date, time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiss", $patient_id, $doctor_id, $date, $time);
    $stmt->execute();

    echo "<script>alert('Appointment booked successfully!'); window.location.href='dashboard.php';</script>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Appointment</title>
    <link rel="stylesheet" href="../style/apbook.css">
</head>
<body>
    <div class="form-container">
        <h2>Book Appointment</h2>
        <form action="book_appointment.php" method="POST">
            <input type="hidden" name="doctor_id" value="<?php echo $_GET['doctor_id']; ?>">
            <label for="date">Select Date:</label>
            <input type="date" id="date" name="date" required>

            <label for="time">Select Time:</label>
            <input type="time" id="time" name="time" required>

            <button type="submit" name="book">Book Appointment</button>
        </form>
    </div>
</body>
</html>
