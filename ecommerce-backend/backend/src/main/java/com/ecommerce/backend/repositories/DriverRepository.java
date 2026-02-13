package com.ecommerce.backend.repositories;

import com.ecommerce.backend.entities.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {
}
