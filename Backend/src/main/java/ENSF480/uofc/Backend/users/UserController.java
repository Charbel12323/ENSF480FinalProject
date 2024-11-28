package ENSF480.uofc.Backend.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // Login a user
    @PostMapping("/login")
    public String loginUser(@RequestBody User loginDetails) {
        Optional<User> user = userService.findByEmail(loginDetails.getEmail());
        if (user.isPresent() && user.get().getPassword().equals(loginDetails.getPassword())) {
            return "Login successful";
        }
        return "Invalid email or password";
    }

    // Continue as Guest
    @PostMapping("/guest")
    public User continueAsGuest() {
        User guestUser = new User();
        guestUser.setName("Guest");
        guestUser.setEmail("guest@example.com");
        guestUser.setPassword("guest");
        guestUser.setGuest(true);
        return userService.registerUser(guestUser);
    }
}
