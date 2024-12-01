package ENSF480.uofc.Backend.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import jakarta.servlet.http.HttpSession;

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
    public ResponseEntity<String> loginUser(@RequestBody User loginDetails, HttpSession session) {
        Optional<User> user = userService.findByEmail(loginDetails.getEmail());
        if (user.isPresent() && user.get().getPassword().equals(loginDetails.getPassword())) {
            session.setAttribute("userId", user.get().getUserId());
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
    
    @PostMapping("/guest")
    public ResponseEntity<User> continueAsGuest(@RequestBody Map<String, String> requestBody, HttpSession session) {
        String email = requestBody.get("email");
    
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Handle missing email
        }
    
        User guestUser = new User();
        guestUser.setName("Guest");
        guestUser.setEmail(email);
        guestUser.setPassword("guest");
        guestUser.setGuest(true);
    
        User registeredGuest = userService.registerUser(guestUser);
    
        session.setAttribute("userId", registeredGuest.getUserId());
        return ResponseEntity.ok(registeredGuest);
    }
    
    
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body(null); // No user in session
        }

        User currentUser = userService.findById(userId).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(401).body(null);
        }

        UserDTO userDTO = new UserDTO(currentUser.getUserId(), currentUser.getName(), currentUser.getEmail(), currentUser.isGuest());
        return ResponseEntity.ok(userDTO);
    }
    
    
}
