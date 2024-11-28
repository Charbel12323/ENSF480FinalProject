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

INSERT INTO Theatres (name, place) VALUES
('Grand Cinema', 'Downtown'),
('Movie Palace', 'Uptown');

 INSERT INTO Movies (title, description, image_path) VALUES
                                             -> ('The Dark Knight', 'A superhero battles crime in Gotham City.', '/images/dark_knight.jpg'),
                                             -> ('Inception', 'A thief enters dreams to steal secrets.', '/images/inception.jpg'),
                                             -> ('Interstellar', 'Astronauts explore a wormhole in space.', '/images/interstellar.jpg'),
                                             -> ('Avengers: Endgame', 'The Avengers assemble to defeat Thanos.', '/images/avengers_endgame.jpg'),
                                             -> ('Titanic', 'A love story unfolds on the ill-fated ship.', '/images/titanic.jpg'),
                                             -> ('The Godfather', 'A powerful mafia family navigates crime and betrayal.', '/images/godfather.jpg'),
                                             -> ('Forrest Gump', 'A man with a kind heart lives through historical events.', '/images/forrest_gump.jpg'),
                                             -> ('The Matrix', 'A hacker discovers a dystopian reality.', '/images/matrix.jpg'),
                                             -> ('Gladiator', 'A Roman general seeks revenge against an emperor.', '/images/gladiator.jpg'),
                                             -> ('The Shawshank Redemption', 'Two imprisoned men bond over decades.', '/images/shawshank.jpg'),
                                             -> ('Pulp Fiction', 'The lives of criminals intertwine in Los Angeles.', '/images/pulp_fiction.jpg'),
                                             -> ('The Lion King', 'A lion cub reclaims his kingdom.', '/images/lion_king.jpg'),
                                             -> ('Frozen', 'Two sisters discover the power of love.', '/images/frozen.jpg'),
                                             -> ('Star Wars: A New Hope', 'A young hero joins a rebellion against an empire.', '/images/star_wars.jpg'),
                                             -> ('Jurassic Park', 'Dinosaurs run amok in a theme park.', '/images/jurassic_park.jpg'),
                                             -> ('The Lord of the Rings: The Fellowship of the Ring', 'A group sets out to destroy a powerful ring.', '/images/lotr_fellowship.jpg'),
                                             -> ('Harry Potter and the Sorcerer\'s Stone', 'A young wizard attends a magical school.', '/images/harry_potter.jpg'),
                                             -> ('The Avengers', 'Earth’s mightiest heroes unite to save the world.', '/images/avengers.jpg'),
                                             -> ('Black Panther', 'A king defends his nation of Wakanda.', '/images/black_panther.jpg'),
                                             -> ('Toy Story', 'Toys come to life and embark on adventures.', '/images/toy_story.jpg'),
                                             -> ('Finding Nemo', 'A clownfish searches for his lost son.', '/images/finding_nemo.jpg'),
                                             -> ('Shrek', 'An ogre rescues a princess in a fairy tale world.', '/images/shrek.jpg'),
                                             -> ('Coco', 'A boy discovers his family’s history in the Land of the Dead.', '/images/coco.jpg'),
                                             -> ('The Incredibles', 'A superhero family fights crime together.', '/images/incredibles.jpg'),
                                             -> ('Spider-Man: No Way Home', 'Spider-Man faces villains from multiple universes.', '/images/spiderman_nowayhome.jpg'),
                                             -> ('Doctor Strange', 'A surgeon becomes a master of the mystic arts.', '/images/doctor_strange.jpg'),
                                             -> ('Wonder Woman', 'An Amazonian warrior joins the fight in World War I.', '/images/wonder_woman.jpg'),
                                             -> ('The Hunger Games', 'A girl fights for survival in a dystopian competition.', '/images/hunger_games.jpg'),
                                             -> ('The Batman', 'A detective version of the caped crusader confronts corruption.', '/images/batman.jpg'),
                                             -> ('Avatar', 'A man explores a new world on the alien planet Pandora.', '/images/avatar.jpg');
