package com.ecommerce.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ref;
    private String description;
    @Min(value = 0, message = "La quantité totale ne peut pas être négative")
    private Integer qteTotal;
    @Min(value = 0, message = "Le prix total ne peut pas être négatif")
    private int priceTotal;
    private boolean state;
    
    @ManyToOne
    private Client client;
    
    @ManyToOne
    private Driver driver;
    
    @ManyToMany
    @JoinTable(
        name = "order_product",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products;
}