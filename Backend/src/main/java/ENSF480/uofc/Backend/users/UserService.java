package ENSF480.uofc.Backend.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import jakarta.servlet.http.HttpSession;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HttpSession httpSession;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getCurrentUser() {
        // Retrieve userId from session
        Integer userId = (Integer) httpSession.getAttribute("userId");

        if (userId == null) {
            return null; // No user is logged in
        }

        return userRepository.findById(userId).orElse(null);
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }
}
