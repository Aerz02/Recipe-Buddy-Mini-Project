-- Make sure the databse is created before you run this script if it doesn't exists
CREATE DATABASE IF NOT EXISTS RecipeBuddy;
-- Select the database
USE RecipeBuddy;
-- Create the user which the web app will use to access the database
DROP USER IF EXISTS 'appuser'@'localhost';
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON RecipeBuddy.* TO 'appuser'@'localhost';

-- Remove the tables if they already exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS foods;

-- Create the users table to store user details
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first varchar(50) NOT NULL, 
    last varchar(50) NOT NULL,
    username varchar(50) UNIQUE NOT NULL,
    email varchar(500) NOT NULL,
    password varchar(500) NOT NULL,
    registration_date timestamp NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create the foods table to store foods
CREATE TABLE IF NOT EXISTS foods (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(100) NOT NULL,
    typical_value INT NOT NULL,
    typical_value_unit varchar(50) NOT NULL,
    carbs decimal(6,2) NOT NULL,
    fats decimal(6,2) NOT NULL, 
    protein decimal(6,2) NOT NULL,
    salt decimal(6,2) NOT NULL,
    sugar decimal(6,2) NOT NULL,
    username varchar(50) NOT NULL,
	FOREIGN KEY (username) REFERENCES users(username)
);