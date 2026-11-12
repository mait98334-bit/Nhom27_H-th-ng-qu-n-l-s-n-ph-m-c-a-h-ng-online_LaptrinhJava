package com.example.demo1.controller;

import com.example.demo1.model.User;
import com.example.demo1.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User updated) {
        return userService.getUserById(id).map(user -> {
            if (updated.getFullName() != null) user.setFullName(updated.getFullName());
            if (updated.getEmail() != null) user.setEmail(updated.getEmail());
            return org.springframework.http.ResponseEntity.ok(userService.saveUser(user));
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/role")
    public org.springframework.http.ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String role = body.get("role");
        if (role == null) return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", "Thiếu role"));
        return userService.getUserById(id).map(user -> {
            user.setRole(role.toUpperCase());
            return org.springframework.http.ResponseEntity.ok(userService.saveUser(user));
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "Đã xóa user thành công!";
    }
}