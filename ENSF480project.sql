CREATE DATABASE ENSF480project;

USE ENSF480project;

-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_guest BOOLEAN DEFAULT FALSE
);

-- Theatres Table
CREATE TABLE Theatres (
    theatre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    place VARCHAR(100) NOT NULL
);

-- Movies Table
CREATE TABLE Movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    theatre_id INT,
    FOREIGN KEY (theatre_id) REFERENCES Theatres(theatre_id) ON DELETE CASCADE
);

-- Showtimes Table
CREATE TABLE Showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    theatre_id INT,
    showtime DATETIME NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (theatre_id) REFERENCES Theatres(theatre_id) ON DELETE CASCADE
);

-- Seats Table
CREATE TABLE Seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    row_num VARCHAR(1) NOT NULL,
    column_number INT NOT NULL,
    is_reserved TINYINT(1) DEFAULT 0,
    showtime_id INT,
    user_id INT,
    FOREIGN KEY (showtime_id) REFERENCES Showtimes(showtime_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Payments Table
-- Drop the Payments table if it exists
DROP TABLE IF EXISTS Payments;

-- Create the Payments table
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    payment_intent_id VARCHAR(255) UNIQUE NOT NULL, -- Stripe payment intent ID
    card_last_four_digits VARCHAR(4), -- Last 4 digits of the card
    expiration_date DATE, -- Optional, to display only in the UI
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the payment was created
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    card_last_four_digits VARCHAR(4),
    transaction_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


-- Tickets Table
CREATE TABLE Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    showtime_id INT,
    seat_id INT,
    user_id INT,
    is_redeemed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (showtime_id) REFERENCES Showtimes(showtime_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES Seats(seat_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

ALTER TABLE Payments 
DROP COLUMN payment_intent_id,
DROP COLUMN currency,
DROP COLUMN is_active,
DROP COLUMN card_number,
DROP COLUMN cvv,
DROP COLUMN stripe_payment_id;
ALTER TABLE Payments MODIFY COLUMN payment_intent_id VARCHAR(255) NULL;
ALTER TABLE Payments DROP COLUMN last_four_digits;
