Backend: Maven AND JAVA

db folder is used to connect to the database

All images go on the static/Images 

application.properties is where you add all your private data  

Like this 

spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO}
spring.jpa.show-sql=${SPRING_JPA_SHOW_SQL}


Put the values in a .env file and just call them in application.properties.

For every new ferature for example seats paymentt or tickets create a new folder under the package ENSF480.uofc.Backend and do you implementation there.

ALso, any dpnedencies needed put in pom.xml.

Finally, to get all teh data needed from the dataabse im going to put all the swl command i did and just copy it. 

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


DELIMITER $$

CREATE PROCEDURE PopulateShowtimes()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_movie_id INT;
    DECLARE theatre_id INT;
    DECLARE showtime_count INT;
    DECLARE showtime_time DATETIME;

    -- Cursor to iterate over movie_ids
    DECLARE movie_cursor CURSOR FOR SELECT movie_id FROM Movies;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN movie_cursor;

    read_loop: LOOP
        FETCH movie_cursor INTO curr_movie_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Loop for each theatre
        SET theatre_id = 1;
        WHILE theatre_id <= 2 DO
            -- Generate random number of showtimes (2 to 5)
            SET showtime_count = FLOOR(2 + (RAND() * 4));

            WHILE showtime_count > 0 DO
                -- Generate a random date and time for showtime
                SET showtime_time = CONCAT('2024-12-', LPAD(FLOOR(1 + (RAND() * 15)), 2, '0'), ' ', LPAD(FLOOR(10 + (RAND() * 12)), 2, '0'), ':', LPAD(FLOOR(RAND() * 60), 2, '0'), ':00');

                -- Insert the showtime
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


CALL PopulateShowtimes();

