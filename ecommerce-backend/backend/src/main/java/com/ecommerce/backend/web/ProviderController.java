package com.ecommerce.backend.web;

import com.ecommerce.backend.entities.Provider;
import com.ecommerce.backend.services.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin("*")
public class ProviderController {
    @Autowired
    private ProviderService providerService;

    @GetMapping
    public List<Provider> getAll() {
        return providerService.getAllProviders();
    }

    @GetMapping("/{id}")
    public Provider getById(@PathVariable Long id) {
        return providerService.getProviderById(id);
    }

    @PostMapping
    public Provider save(@RequestBody Provider provider) {
        return providerService.saveProvider(provider);
    }

    @PutMapping("/{id}")
    public Provider update(@PathVariable Long id, @RequestBody Provider provider) {
        provider.setId(id);
        return providerService.saveProvider(provider);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        providerService.deleteProvider(id);
    }
}
