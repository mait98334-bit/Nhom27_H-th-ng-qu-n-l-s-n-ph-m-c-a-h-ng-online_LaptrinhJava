package com.example.demo1.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final String UPLOAD_DIR = "D:/LTJAVA/demo1/uploads";

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn file hình ảnh!"));
        }

        try {
            File uploadFolder = new File(UPLOAD_DIR);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            // Lấy tên gốc và đuôi mở rộng
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
            }

            // Kiểm tra định dạng hợp lệ
            if (!extension.matches("\\.(jpg|jpeg|png|gif|webp|svg)")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Chỉ hỗ trợ file ảnh: JPG, PNG, GIF, WEBP, SVG!"));
            }

            // Tạo tên file ngẫu nhiên tránh trùng lặp
            String uniqueFileName = UUID.randomUUID().toString() + "_" + (originalFileName != null ? originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_") : "image.jpg");
            Path targetPath = Paths.get(UPLOAD_DIR).resolve(uniqueFileName);

            // Lưu file vào ổ đĩa
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Đường dẫn URL để truy cập ảnh
            String fileDownloadUri = "/uploads/" + uniqueFileName;

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("url", fileDownloadUri);
            response.put("fileName", uniqueFileName);
            response.put("size", file.getSize());
            response.put("message", "Tải ảnh lên máy chủ thành công!");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi lưu file: " + e.getMessage()));
        }
    }

    @PostMapping("/multiple")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn ít nhất 1 file hình ảnh!"));
        }

        List<Map<String, Object>> uploadedList = new ArrayList<>();
        File uploadFolder = new File(UPLOAD_DIR);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                String originalFileName = file.getOriginalFilename();
                String extension = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    extension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
                }
                if (!extension.matches("\\.(jpg|jpeg|png|gif|webp|svg)")) {
                    continue;
                }
                String uniqueFileName = UUID.randomUUID().toString() + "_" + (originalFileName != null ? originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_") : "image.jpg");
                Path targetPath = Paths.get(UPLOAD_DIR).resolve(uniqueFileName);
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

                String fileDownloadUri = "/uploads/" + uniqueFileName;
                Map<String, Object> item = new HashMap<>();
                item.put("url", fileDownloadUri);
                item.put("fileName", uniqueFileName);
                item.put("size", file.getSize());
                uploadedList.add(item);
            } catch (IOException e) {
                // Tiếp tục với các file khác
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("files", uploadedList);
        response.put("count", uploadedList.size());
        response.put("message", "Đã tải lên thành công " + uploadedList.size() + " ảnh!");
        return ResponseEntity.ok(response);
    }
}
