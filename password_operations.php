<?php
require_once 'config.php';
require_once 'includes/database_queries.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            // Add password
            $website = $_POST['website'] ?? '';
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';
            
            if (empty($website) || empty($username) || empty($password)) {
                throw new Exception('All fields are required');
            }
            
            $stmt = $pdo->prepare(DatabaseQueries::addPassword());
            $stmt->execute([
                'user_id' => $_SESSION['user_id'],
                'website' => $website,
                'username' => $username,
                'password' => $password
            ]);
            break;

        case 'DELETE':
            // Delete password
            $data = json_decode(file_get_contents('php://input'), true);
            $passwordId = $data['passwordId'] ?? 0;
            
            // Check ownership first
            $stmt = $pdo->prepare(DatabaseQueries::checkPasswordOwnership());
            $stmt->execute(['id' => $passwordId, 'userId' => $_SESSION['user_id']]);
            if (!$stmt->fetch()) {
                throw new Exception('Password not found');
            }
            
            // Delete password
            $stmt = $pdo->prepare(DatabaseQueries::deletePassword());
            $stmt->execute(['id' => $passwordId, 'userId' => $_SESSION['user_id']]);
            break;

        default:
            throw new Exception('Invalid request method');
    }
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}