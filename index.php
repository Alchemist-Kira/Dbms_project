<?php
session_start();

// Redirect to dashboard if logged in, otherwise to login page
if (isset($_SESSION['user_id'])) {
    header("Location: templates/dashboard.html");
} else {
    header("Location: templates/login.html");
}
exit();
?> 