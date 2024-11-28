package ENSF480.uofc.Backend.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.io.InputStream;
import java.io.IOException;

public class DBConnection {

    // Static variable to hold the single instance
    private static DBConnection instance;

    // Connection object
    private Connection connection;

    // Private constructor to prevent external instantiation
    private DBConnection() {
        try {
            // Load properties file
            InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties");
            Properties properties = new Properties();

            if (input == null) {
                throw new RuntimeException("Unable to find application.properties");
            }
            properties.load(input);

            // Retrieve properties
            String url = properties.getProperty("db.url");
            String username = properties.getProperty("db.username");
            String password = properties.getProperty("db.password");
            String driver = properties.getProperty("db.driver");

            // Load JDBC driver
            Class.forName(driver);

            // Establish the connection
            this.connection = DriverManager.getConnection(url, username, password);

        } catch (IOException | ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to establish database connection", e);
        }
    }

    // Public static method to get the single instance
    public static DBConnection getInstance() {
        if (instance == null) {
            synchronized (DBConnection.class) {
                if (instance == null) {
                    instance = new DBConnection();
                }
            }
        }
        return instance;
    }

    // Getter for the connection object
    public Connection getConnection() {
        return connection;
    }
}
