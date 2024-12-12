<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $passwordId = $data['passwordId'] ?? 0;
    
    try {
        // Check if password belongs to user
        $stmt = $pdo->prepare("SELECT id FROM passwords WHERE id = ? AND user_id = ?");
        $stmt->execute([$passwordId, $_SESSION['user_id']]);
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Password not found']);
            exit;
        }
        
        // Delete password
        $stmt = $pdo->prepare("DELETE FROM passwords WHERE id = ? AND user_id = ?");
        $stmt->execute([$passwordId, $_SESSION['user_id']]);
        
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        error_log($e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete password'
        ]);
    }
} 