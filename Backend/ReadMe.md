Backend: Maven AND JAVA

db folder is used to connect to the database

All images go on the static/Images 

application.properties is where you add all your private data  

Like this 

SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/ENSF480project
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=pass
SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
STRIPE_API_KEY=sk_test_


Put the values in a .env file place the env file in the  resources folder in the Backend/src/main and just call them in application.properties.

For every new ferature for example seats paymentt or tickets create a new folder under the package ENSF480.uofc.Backend and do your implementation there.

ALso, any dpnedencies needed put in pom.xml.

Finally, to get all the data needed from the database im going to put all the sql command i did and just copy it. 

CREATE TABLE movies (
  movie_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image_path VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (movie_id)
)

CREATE TABLE theatres (
  theatre_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  place VARCHAR(100) NOT NULL,
  PRIMARY KEY (theatre_id)
)

CREATE TABLE theatres (
  theatre_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  place VARCHAR(100) NOT NULL,
  PRIMARY KEY (theatre_id)
)

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_guest BOOLEAN DEFAULT FALSE
);


INSERT INTO theatres (name, place) VALUES
('Theatre One', 'Downtown'),
('Theatre Two', 'Uptown');


INSERT INTO Movies (title, description, image_path) VALUES
('The Dark Knight', 'A superhero battles crime in Gotham City.', '/images/dark_knight.jpg'),
('Inception', 'A thief enters dreams to steal secrets.', '/images/inception.jpg'),
('Interstellar', 'Astronauts explore a wormhole in space.', '/images/interstellar.jpg'),
('Avengers: Endgame', 'The Avengers assemble to defeat Thanos.', '/images/avengers_endgame.jpg'),
('Titanic', 'A love story unfolds on the ill-fated ship.', '/images/titanic.jpg'),
('The Godfather', 'A powerful mafia family navigates crime and betrayal.', '/images/godfather.jpg'),
('Forrest Gump', 'A man with a kind heart lives through historical events.', '/images/forrest_gump.jpg'),
('The Matrix', 'A hacker discovers a dystopian reality.', '/images/matrix.jpg'),
('Gladiator', 'A Roman general seeks revenge against an emperor.', '/images/gladiator.jpg'),
('The Shawshank Redemption', 'Two imprisoned men bond over decades.', '/images/shawshank.jpg'),
('Pulp Fiction', 'The lives of criminals intertwine in Los Angeles.', '/images/pulp_fiction.jpg'),
('The Lion King', 'A lion cub reclaims his kingdom.', '/images/lion_king.jpg'),
('Frozen', 'Two sisters discover the power of love.', '/images/frozen.jpg'),
('Star Wars: A New Hope', 'A young hero joins a rebellion against an empire.', '/images/star_wars.jpg'),
('Jurassic Park', 'Dinosaurs run amok in a theme park.', '/images/jurassic_park.jpg'),
('The Lord of the Rings: The Fellowship of the Ring', 'A group sets out to destroy a powerful ring.', '/images/lotr_fellowship.jpg'),
('Harry Potter and the Sorcerer\'s Stone', 'A young wizard attends a magical school.', '/images/harry_potter.jpg'),
('The Avengers', 'Earth’s mightiest heroes unite to save the world.', '/images/avengers.jpg'),
('Black Panther', 'A king defends his nation of Wakanda.', '/images/black_panther.jpg'),
('Toy Story', 'Toys come to life and embark on adventures.', '/images/toy_story.jpg'),
('Finding Nemo', 'A clownfish searches for his lost son.', '/images/finding_nemo.jpg'),
('Shrek', 'An ogre rescues a princess in a fairy tale world.', '/images/shrek.jpg'),
('Coco', 'A boy discovers his family’s history in the Land of the Dead.', '/images/coco.jpg'),
('The Incredibles', 'A superhero family fights crime together.', '/images/incredibles.jpg'),
('Spider-Man: No Way Home', 'Spider-Man faces villains from multiple universes.', '/images/spiderman_nowayhome.jpg'),
('Doctor Strange', 'A surgeon becomes a master of the mystic arts.', '/images/doctor_strange.jpg'),
('Wonder Woman', 'An Amazonian warrior joins the fight in World War I.', '/images/wonder_woman.jpg'),
('The Hunger Games', 'A girl fights for survival in a dystopian competition.', '/images/hunger_games.jpg'),
('The Batman', 'A detective version of the caped crusader confronts corruption.', '/images/batman.jpg'),
('Avatar', 'A man explores a new world on the alien planet Pandora.', '/images/avatar.jpg');

```sql
DELIMITER $$

CREATE PROCEDURE PopulateShowtimes()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_movie_id INT;
    DECLARE theatre_id INT;
    DECLARE showtime_count INT;
    DECLARE showtime_time DATETIME;

    DECLARE movie_cursor CURSOR FOR SELECT movie_id FROM Movies;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN movie_cursor;

    read_loop: LOOP
        FETCH movie_cursor INTO curr_movie_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET theatre_id = 1;
        WHILE theatre_id <= 2 DO
            SET showtime_count = FLOOR(2 + (RAND() * 4));

            WHILE showtime_count > 0 DO
                SET showtime_time = CONCAT('2024-12-', LPAD(FLOOR(1 + (RAND() * 15)), 2, '0'), ' ', LPAD(FLOOR(10 + (RAND() * 12)), 2, '0'), ':', LPAD(FLOOR(RAND() * 60), 2, '0'), ':00');

                INSERT INTO Showtimes (movie_id, theatre_id, showtime)
                VALUES (curr_movie_id, theatre_id, showtime_time);

                SET showtime_count = showtime_count - 1;
            END WHILE;

            SET theatre_id = theatre_id + 1;
        END WHILE;

    END LOOP;

    CLOSE movie_cursor;
END$$

DELIMITER ;

```
CALL PopulateShowtimes();

DELIMITER $$

-- Drop the procedure if it already exists
DROP PROCEDURE IF EXISTS PopulateSeatsWithReservedChunked$$

-- Create the procedure
CREATE PROCEDURE PopulateSeatsWithReservedChunked()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_showtime_id INT;
    DECLARE row_num CHAR(1);
    DECLARE column_number INT;
    DECLARE processed_seats INT DEFAULT 0;
    DECLARE reserved_seat_count INT DEFAULT 0;
    DECLARE total_seats INT DEFAULT 0;

    DECLARE showtime_cursor CURSOR FOR SELECT showtime_id FROM Showtimes;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN showtime_cursor;

    read_loop: LOOP
        FETCH showtime_cursor INTO curr_showtime_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Initialize variables for the current showtime
        SET row_num = 'A';
        SET processed_seats = 0;

        -- Insert seats row by row
        WHILE row_num <= 'E' DO
            SET column_number = 1;

            WHILE column_number <= 6 DO
                INSERT INTO Seats (row_num, column_number, is_reserved, showtime_id)
                VALUES (row_num, column_number, 0, curr_showtime_id);

                SET column_number = column_number + 1;
                SET processed_seats = processed_seats + 1;

                -- Commit every 30 seat inserts to reduce transaction size
                IF MOD(processed_seats, 30) = 0 THEN
                    COMMIT;
                END IF;
            END WHILE;

            SET row_num = CHAR(ASCII(row_num) + 1); -- Move to the next row
        END WHILE;

        -- Final commit for all seats of the current showtime
        COMMIT;

        -- Calculate reserved seats (10%)
        SET total_seats = processed_seats;
        SET reserved_seat_count = CEIL(total_seats * 0.10);

        -- Randomly mark seats as reserved
        WHILE reserved_seat_count > 0 DO
            UPDATE Seats
            SET is_reserved = 1
            WHERE showtime_id = curr_showtime_id AND is_reserved = 0
            ORDER BY RAND()
            LIMIT 1;

            SET reserved_seat_count = reserved_seat_count - 1;

            -- Commit every 2 reserved seat updates
            IF MOD(reserved_seat_count, 2) = 0 THEN
                COMMIT;
            END IF;
        END WHILE;

        -- Final commit after reserving seats
        COMMIT;
    END LOOP;

    CLOSE showtime_cursor;
END$$

DELIMITER ;

-- Call the procedure to populate seats
CALL PopulateSeatsWithReservedChunked();

to make this work for seats do this 

Edit → Preferences → SQL Editor → DBMS connection read time out (in seconds): 600

Changed the value to 6000.

Also unchecked limit rows as putting a limit in every time I want to search the whole data set gets tiresome.


After inputting all of this into your database run the backend and start  the front end and you should have everything. 


To run the backend: mvn spring-boot:run -X

