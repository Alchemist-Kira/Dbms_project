<?php
class DatabaseQueries {
    // User related queries
    public static function getUserByUsername($username) {
        return "SELECT * FROM users WHERE username = :username";
    }
    
    public static function updateLastLogin($userId) {
        return "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = :userId";
    }
    
    public static function createUser() {
        return "INSERT INTO users (username, password) VALUES (:username, :password)";
    }
    
    // Password related queries
    public static function getUserPasswords($userId) {
        return "SELECT * FROM passwords WHERE user_id = :userId ORDER BY created_at DESC";
    }
    
    public static function addPassword() {
        return "INSERT INTO passwords (user_id, website, username, password) 
                VALUES (:user_id, :website, :username, :password)";
    }
    
    public static function deletePassword() {
        return "DELETE FROM passwords WHERE id = :id AND user_id = :userId";
    }
    
    public static function checkPasswordOwnership() {
        return "SELECT id FROM passwords WHERE id = :id AND user_id = :userId";
    }
    
    // Admin related queries
    public static function getTotalUsers() {
        return "SELECT COUNT(*) as total FROM users";
    }
    
    public static function getTotalPasswords() {
        return "SELECT COUNT(*) as total FROM passwords";
    }
    
    public static function getAllUsers() {
        return "SELECT id, username, is_admin, created_at, 
                (SELECT COUNT(*) FROM passwords WHERE user_id = users.id) as password_count 
                FROM users ORDER BY created_at DESC";
    }
    
    public static function getAdminDashboardData() {
        return "SELECT u.id,u.username,u.is_admin,u.created_at,
                COUNT(p.id) as password_count
            FROM users u
            LEFT JOIN passwords p ON u.id = p.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC";
    }
    
    public static function deleteUser($userId) {
        return "DELETE FROM users WHERE id = :userId AND is_admin = FALSE";
    }
}