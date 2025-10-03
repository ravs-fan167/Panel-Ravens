CREATE DATABASE IF NOT EXISTS ravens_panel;
USE ravens_panel;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE servers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  node_id INT,
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE nodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  ip VARCHAR(50) NOT NULL,
  location VARCHAR(100)
);

CREATE TABLE domains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain VARCHAR(100) NOT NULL,
  assigned_to INT,
  FOREIGN KEY (assigned_to) REFERENCES servers(id)
);
