package com.example.demo1.config;

import com.example.demo1.model.User;
import com.example.demo1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired(required = false)
    private UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Cấu hình CORS và tắt CSRF cho các API
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            // 2. Phân quyền request
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/login/**", "/oauth2/**", "/error").permitAll()
                .anyRequest().permitAll()
            )

            // 3. Cấu hình Google OAuth2 Login
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2AuthenticationSuccessHandler())
            )

            // 4. Hỗ trợ HTTP Basic Authentication
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    /**
     * Xử lý sau khi người dùng đăng nhập bằng Google thành công:
     * - Tự động đồng bộ thông tin Google User vào database
     * - Chuyển hướng về trang chủ Frontend kèm thông tin đăng nhập
     */
    @Bean
    public AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");

            User finalUser = null;
            if (userRepository != null && email != null) {
                // Tài khoản Đăng nhập nhanh Google tự động là ADMIN và được lưu vào CSDL MySQL
                finalUser = userRepository.findByEmail(email).map(existing -> {
                    existing.setRole("ADMIN");
                    return userRepository.save(existing);
                }).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(email.split("@")[0]);
                    newUser.setFullName(name != null ? name : email);
                    newUser.setRole("ADMIN");
                    newUser.setPassword(passwordEncoder().encode("OAUTH2_USER_" + System.currentTimeMillis()));
                    return userRepository.save(newUser);
                });
            }

            String fullName = name != null ? name : "Google User";
            String userEmail = email != null ? email : "";
            Long userId = finalUser != null ? finalUser.getId() : 1L;
            String userRole = "ADMIN";

            response.setContentType("text/html;charset=UTF-8");
            String html = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <title>Đăng nhập Google thành công</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; }
                    .card { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; max-width: 450px; }
                    h2 { color: #059669; margin: 0.5rem 0 0.5rem; }
                    .role-badge { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 4px 14px; border-radius: 9999px; font-weight: bold; font-size: 0.9rem; margin-bottom: 1rem; }
                    .btn { display: inline-block; padding: 0.8rem 1.6rem; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 1rem; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div style="font-size: 3rem;">🎉</div>
                    <h2>Đăng Nhập Thành Công!</h2>
                    <span class="role-badge">Vai trò: %s</span>
                    <p>Chào mừng <strong>%s</strong> (%s)</p>
                    <p style="color: #64748b; font-size: 0.9rem;">Hệ thống đang chuyển bạn về Cửa hàng...</p>
                    <a href="/frontend/index.html?login_success=true&role=%s" class="btn">Vào Cửa Hàng Ngay ➔</a>
                  </div>
                  <script>
                    const authUser = {
                      id: %d,
                      fullName: '%s',
                      email: '%s',
                      username: '%s',
                      role: '%s',
                      authProvider: 'GOOGLE'
                    };
                    localStorage.setItem('sisi_user', JSON.stringify(authUser));

                    // Tự động chuyển hướng về trang chủ sau 1 giây
                    setTimeout(function() {
                      window.location.href = '/frontend/index.html?login_success=true&role=%s&authProvider=GOOGLE';
                    }, 1000);
                  </script>
                </body>
                </html>
                """, userRole, fullName, userEmail, userRole, userId, fullName, userEmail, userEmail.split("@")[0], userRole, userRole);

            response.getWriter().write(html);
        };
    }

    /**
     * Cấu hình CORS cấp Security Filter
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Hỗ trợ tất cả origin từ localhost (Live Server, Vite, Webpack, v.v.)
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Cache-Control"));
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Cấu hình phục vụ file tĩnh Frontend độc lập và file ảnh Upload từ cổng 8080
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///D:/LTJAVA/demo1/uploads/");
        registry.addResourceHandler("/frontend/**")
                .addResourceLocations("file:///D:/LTJAVA/frontend/", "file:///D:/LTJAVA/demo1/frontend/");
        registry.addResourceHandler("/**")
                .addResourceLocations("file:///D:/LTJAVA/frontend/", "file:///D:/LTJAVA/demo1/frontend/", "classpath:/static/");
    }

    /**
     * Cấu hình CORS cấp Spring Web MVC
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
