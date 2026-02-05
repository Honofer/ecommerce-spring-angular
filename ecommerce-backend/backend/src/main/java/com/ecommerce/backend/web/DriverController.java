package com.ecommerce.backend.web;

import com.ecommerce.backend.entities.Driver;
import com.ecommerce.backend.services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin("*")
public class DriverController {
    @Autowired
    private DriverService driverService;

    @GetMapping
    public List<Driver> getAll() {
        return driverService.getAllDrivers();
    }

    @GetMapping("/{id}")
    public Driver getById(@PathVariable Long id) {
        return driverService.getDriverById(id);
    }

    @PostMapping
    public Driver save(@RequestBody Driver driver) {
        return driverService.saveDriver(driver);
    }

    @PutMapping("/{id}")
    public Driver update(@PathVariable Long id, @RequestBody Driver driver) {
        driver.setId(id);
        return driverService.saveDriver(driver);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        driverService.deleteDriver(id);
    }
}
