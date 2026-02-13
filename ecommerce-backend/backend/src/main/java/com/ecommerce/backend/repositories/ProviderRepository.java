package com.ecommerce.backend.repositories;

import com.ecommerce.backend.entities.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
}
