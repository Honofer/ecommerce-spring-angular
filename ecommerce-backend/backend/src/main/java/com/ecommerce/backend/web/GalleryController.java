package com.ecommerce.backend.web;

import com.ecommerce.backend.entities.Gallery;
import com.ecommerce.backend.entities.Product;
import com.ecommerce.backend.services.GalleryService;
import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/galleries")
@CrossOrigin("*")
public class GalleryController {
    @Autowired
    private GalleryService galleryService;
    
    @Autowired
    private ProductService productService;

    private final String uploadDir = "uploads/products/";

    @GetMapping
    public List<Gallery> getAll() {
        return galleryService.getAllGalleries();
    }

    @GetMapping("/{id}")
    public Gallery getById(@PathVariable Long id) {
        return galleryService.getGalleryById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Gallery uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("productId") Long productId) throws IOException {
        Product product = productService.getProductById(productId);
        if (product == null) throw new RuntimeException("Produit non trouvé");

        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = path.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        Gallery gallery = new Gallery();
        gallery.setUrlPhoto(fileName);
        gallery.setProduct(product);
        return galleryService.saveGallery(gallery);
    }

    @GetMapping("/images/{fileName}")
    public byte[] getImage(@PathVariable String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(uploadDir + fileName));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        galleryService.deleteGallery(id);
    }
}
