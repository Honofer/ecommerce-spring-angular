package com.ecommerce.backend.services;

import com.ecommerce.backend.entities.Order;
import com.ecommerce.backend.entities.Product;
import com.ecommerce.backend.repositories.OrderRepository;
import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order saveOrder(Order order) {
        if (order.getProducts() != null && !order.getProducts().isEmpty()) {
            int total = 0;
            int qte = 0;
            for (Product p : order.getProducts()) {
                Product dbProduct = productRepository.findById(p.getId()).orElse(null);
                if (dbProduct != null) {
                    total += dbProduct.getPrice();
                    qte += 1; 
                }
            }
            order.setPriceTotal(total);
            order.setQteTotal(qte);
        }
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
