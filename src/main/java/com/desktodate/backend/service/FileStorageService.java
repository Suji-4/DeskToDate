package com.desktodate.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadPath = Paths.get("uploads");

    public String saveImage(MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new IOException("Image file is empty");
        }

        Files.createDirectories(uploadPath);

        String originalFileName = file.getOriginalFilename();

        String fileName =
                UUID.randomUUID() + "_" + originalFileName;

        Path filePath =
                uploadPath.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/" + fileName;
    }

    public void deleteImage(String imageUrl) throws IOException {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String fileName =
                imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

        Path filePath =
                Paths.get("uploads").resolve(fileName);

        System.out.println(
                "Deleting image: "
                        + filePath.toAbsolutePath()
        );

        Files.deleteIfExists(filePath);
    }
}