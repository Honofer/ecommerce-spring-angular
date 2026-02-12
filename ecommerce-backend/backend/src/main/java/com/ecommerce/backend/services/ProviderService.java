package com.ecommerce.backend.services;

import com.ecommerce.backend.entities.Provider;
import com.ecommerce.backend.repositories.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {
    @Autowired
    private ProviderRepository providerRepository;

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    public Provider getProviderById(Long id) {
        return providerRepository.findById(id).orElse(null);
    }

    public Provider saveProvider(Provider provider) {
        return providerRepository.save(provider);
    }

    public void deleteProvider(Long id) {
        providerRepository.deleteById(id);
    }
}
