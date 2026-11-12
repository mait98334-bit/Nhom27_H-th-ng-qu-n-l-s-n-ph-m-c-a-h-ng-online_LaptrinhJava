package com.example.demo1.controller;

import com.example.demo1.model.User;
import com.example.demo1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ username và mật khẩu!"));
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Tài khoản không tồn tại!"));
        }

        // Kiểm tra mật khẩu (hỗ trợ cả mật khẩu băm BCrypt lẫn so sánh trực tiếp khi khởi tạo test)
        boolean matches = passwordEncoder.matches(password, user.getPassword()) || password.equals(user.getPassword());
        if (!matches) {
            return ResponseEntity.status(401).body(Map.of("message", "Mật khẩu không chính xác!"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("authProvider", "LOCAL");
        response.put("message", "Đăng nhập thành công!");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String fullName = request.get("fullName");
        String email = request.get("email");

        if (username == null || password == null || email == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng điền đầy đủ các thông tin bắt buộc!"));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã được sử dụng!"));
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setFullName(fullName != null ? fullName : username);
        newUser.setEmail(email);
        // Tài khoản đăng ký công khai mặc định luôn là CUSTOMER (Bảo mật chuẩn thực tế)
        newUser.setRole("CUSTOMER");

        User saved = userRepository.save(newUser);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("username", saved.getUsername());
        response.put("fullName", saved.getFullName());
        response.put("email", saved.getEmail());
        response.put("role", saved.getRole());
        response.put("authProvider", "LOCAL");
        response.put("message", "Đăng ký tài khoản thành công!");

        return ResponseEntity.ok(response);
    }
}
