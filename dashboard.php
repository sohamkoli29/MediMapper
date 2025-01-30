<?php
include('config.php');
session_start();

// Ensure the user is logged in as a patient
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'patient') {
    header("Location: login.php");
    exit();
}

// Fetch all doctors
$doctors_query = "SELECT u.id, u.name, u.profile_picture, d.specialization, d.qualification 
                  FROM users u 
                  JOIN doctors d ON u.id = d.user_id";
$doctors_result = $conn->query($doctors_query);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Dashboard</title>
    <link rel="stylesheet" href="style/dash.css">
</head>
<body>
    <div class="dashboard">
        <h1>Welcome to Patient Dashboard</h1>
        <h2>Available Doctors</h2>
        <div class="doctor-list">
            <?php while ($doctor = $doctors_result->fetch_assoc()) { ?>
                <div class="doctor-card">
                    <img src="<?php echo $doctor['profile_picture']; ?>" alt="Doctor Picture">
                    <h3><?php echo $doctor['name']; ?></h3>
                    <p>Specialization: <?php echo $doctor['specialization']; ?></p>
                    <p>Qualification: <?php echo $doctor['qualification']; ?></p>
                    <a href="doctor_profile.php?doctor_id=<?php echo $doctor['id']; ?>" class="btn">View Profile</a>
                </div>
            <?php } ?>
        </div>
    </div>
</body>
</html>
