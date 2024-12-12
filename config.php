<?php
session_start();

// Disable error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'password_man');

// Database connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("Connection failed");
}

// Redirect to auth.php if not logged in (except for auth.php itself)
if (!isset($_SESSION['user_id']) && basename($_SERVER['PHP_SELF']) !== 'auth.php') {
    header("Location: auth.php");
    exit();
} 