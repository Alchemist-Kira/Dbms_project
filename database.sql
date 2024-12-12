CREATE DATABASE IF NOT EXISTS password_man;
USE password_man;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passwords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    website VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create admin user (password: 123)
INSERT INTO users (username, password, is_admin) 
VALUES ('System', '$2y$10$mDAH.R8GZYp7lp3K0F7HwuCkQj2GxgHHHICB.GG1rpbYL6c3ZyS/i', 1); 