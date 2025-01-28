<!-- process.php -->
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "healthcare";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $number = $_POST['number'];
    $password = $_POST['password'];

    $checkUser = "SELECT * FROM users WHERE username='$username'";
    $result = $conn->query($checkUser);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row['password'] === $password) {
            header("Location: index.html");
            exit();
        } else {
            header("Location: process.php?message=Incorrect password. Please try again.");
            exit();
        }
    } else {
        $sql = "INSERT INTO users (username, number, password) VALUES ('$username', '$number', '$password')";

        if ($conn->query($sql) === TRUE) {
            header("Location: process.php?message=Account created successfully! Please log in.");
            exit();
        } else {
            header("Location: process.php?message=Error creating account. Please try again.");
            exit();
        }
    }
}

$conn->close();
?>