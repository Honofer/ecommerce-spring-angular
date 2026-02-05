package com.ecommerce.backend.web;

import com.ecommerce.backend.entities.Order;
import com.ecommerce.backend.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAll() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    public Order save(@Valid @RequestBody Order order) {
        return orderService.saveOrder(order);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id, @Valid @RequestBody Order order) {
        order.setId(id);
        return orderService.saveOrder(order);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}
