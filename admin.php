<?php
require_once 'config.php';
require_once 'includes/database_queries.php';

header('Content-Type: application/json');

// Check admin status
if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized access'
    ]);
    exit;
}

try {
    // Handle DELETE request
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['userId'] ?? 0;
        
        if ($userId) {
            $stmt = $pdo->prepare(DatabaseQueries::deleteUser($userId));
            $success = $stmt->execute(['userId' => $userId]);
            
            if ($success && $stmt->rowCount() > 0) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Could not delete user'
                ]);
            }
            exit;
        }
    }

    // Get admin dashboard data
    $query = DatabaseQueries::getAdminDashboardData();
    $stmt = $pdo->query($query);
    $users = $stmt->fetchAll();
    
    $totalPasswords = 0;
    foreach ($users as $user) {
        $totalPasswords += (int)$user['password_count'];
    }
    
    echo json_encode([
        'success' => true,
        'data' => [
            'users' => $users,
            'total_users' => count($users),
            'total_passwords' => $totalPasswords
        ]
    ]);
} catch (Exception $e) {
    error_log("Admin Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Operation failed'
    ]);
} 