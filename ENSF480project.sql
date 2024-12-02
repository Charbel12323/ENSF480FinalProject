-- Create the movies table
CREATE TABLE movies (
    movie_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    image_path VARCHAR(255) DEFAULT NULL,
    is_announced TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (movie_id)
);

-- Create the payments table
CREATE TABLE payments (
    payment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_last_four_digits VARCHAR(4) DEFAULT NULL,
    expiration_date DATE DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_method_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (payment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create the users table
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_guest TINYINT(1) DEFAULT 0,
    PRIMARY KEY (user_id)
);

-- Create the theatres table
CREATE TABLE theatres (
    theatre_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    place VARCHAR(100) NOT NULL,
    PRIMARY KEY (theatre_id)
);

-- Create the showtimes table
CREATE TABLE showtimes (
    showtime_id INT NOT NULL AUTO_INCREMENT,
    movie_id INT DEFAULT NULL,
    theatre_id INT DEFAULT NULL,
    showtime DATETIME NOT NULL,
    PRIMARY KEY (showtime_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

-- Create the transactions table
CREATE TABLE transactions (
    transaction_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    payment_id INT DEFAULT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    transaction_status VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

-- Create the tickets table
CREATE TABLE tickets (
    ticket_id INT NOT NULL AUTO_INCREMENT,
    showtime_id INT DEFAULT NULL,
    seat_id INT DEFAULT NULL,
    user_id INT DEFAULT NULL,
    is_redeemed TINYINT(1) DEFAULT 0,
    purchase_date DATETIME(6) NOT NULL,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create the seats table
CREATE TABLE seats (
    seat_id INT NOT NULL AUTO_INCREMENT,
    row_num VARCHAR(1) NOT NULL,
    column_number INT NOT NULL,
    is_reserved TINYINT(1) NOT NULL DEFAULT 0,
    showtime_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    reserved_at DATETIME DEFAULT NULL,
    PRIMARY KEY (seat_id),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
);
