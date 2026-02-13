package com.ecommerce.backend.repositories;

import com.ecommerce.backend.entities.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
}
