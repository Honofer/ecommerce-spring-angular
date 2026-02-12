package com.ecommerce.backend.services;

import com.ecommerce.backend.entities.Gallery;
import com.ecommerce.backend.repositories.GalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GalleryService {
    @Autowired
    private GalleryRepository galleryRepository;

    public List<Gallery> getAllGalleries() {
        return galleryRepository.findAll();
    }

    public Gallery getGalleryById(Long id) {
        return galleryRepository.findById(id).orElse(null);
    }

    public Gallery saveGallery(Gallery gallery) {
        return galleryRepository.save(gallery);
    }

    public void deleteGallery(Long id) {
        galleryRepository.deleteById(id);
    }
}
