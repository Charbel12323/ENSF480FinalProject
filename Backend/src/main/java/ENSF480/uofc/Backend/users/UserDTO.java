package ENSF480.uofc.Backend.users;

public class UserDTO {
    private int id;
    private String name;
    private String email;
    private boolean isGuest;

    // Constructor
    public UserDTO(int id, String name, String email, boolean isGuest) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isGuest = isGuest;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isGuest() {
        return isGuest;
    }

    public void setGuest(boolean guest) {
        isGuest = guest;
    }
}
