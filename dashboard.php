<?php
require_once 'config.php';
require_once 'includes/database_queries.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare(DatabaseQueries::getUserPasswords($_SESSION['user_id']));
        $stmt->execute(['userId' => $_SESSION['user_id']]);
        $passwords = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $passwords
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to load passwords'
        ]);
    }
} 