<?php include('../scripts/config.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
  <link rel="stylesheet" href="../style/register.css">
</head>
<body>
  <div class="form-container">
    <h2>Create Profile</h2>
    <form action="../templates/register.php" method="POST" enctype="multipart/form-data">
      <label for="name">Full Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="role">Register As:</label>
      <select id="role" name="role" required>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      <div id="doctor-fields" style="display: none;">
        <label for="specialization">Specialization:</label>
        <input type="text" id="specialization" name="specialization">
        
        <label for="qualification">Qualification:</label>
        <input type="text" id="qualification" name="qualification">

        <label for="experience">Experience:</label>
        <input type="number" id="experience" name="experience">
      </div>

      <label for="profile_picture">Profile Picture:</label>
      <input type="file" id="profile_picture" name="profile_picture" accept="image/*">

      <button type="submit" name="register">Register</button>
      <div>already have an account <a href="login.php">click here</a> </div>
    </form>
  </div>

  <script>
    // Show doctor-specific fields
    document.getElementById('role').addEventListener('change', function () {
      document.getElementById('doctor-fields').style.display = 
        this.value === 'doctor' ? 'block' : 'none';
    });
  </script>
</body>
</html>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
    $name = $_POST['name'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $email = $_POST['email'];
    $role = $_POST['role'];
    $profile_picture = '';

    // Handle profile picture upload
    if (!empty($_FILES['profile_picture']['name'])) {
        $target_dir = "../uploads/";
        $profile_picture = $target_dir . basename($_FILES['profile_picture']['name']);
        move_uploaded_file($_FILES['profile_picture']['tmp_name'], $profile_picture);
    }

    // Insert into users table
    $stmt = $conn->prepare("INSERT INTO users (username, password, role, name, email, profile_picture) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $username, $password, $role, $name, $email, $profile_picture);
    $stmt->execute();

    $user_id = $conn->insert_id;

    // Insert into doctors table if role is doctor
    if ($role === 'doctor') {
        $specialization = $_POST['specialization'];
        $qualification = $_POST['qualification'];
        $experience = $_POST['experience'];
        
        $stmt = $conn->prepare("INSERT INTO doctors (user_id, specialization, qualification, experience) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $specialization, $qualification, $experience);
        $stmt->execute();
    }

    echo "<script>alert('Registration successful!'); window.location.href='login.php';</script>";
}
?>
