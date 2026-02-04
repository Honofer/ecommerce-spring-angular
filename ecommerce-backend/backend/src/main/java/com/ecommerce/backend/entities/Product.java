package com.ecommerce.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String ref;
    @Min(value = 0, message = "Le prix ne peut pas être négatif")
    private int price;
    @Min(value = 0, message = "La quantité ne peut pas être négative")
    private Integer qte;
    private String description;

    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private SubCategory subCategory;

    @ManyToOne
    private Provider provider;

    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER)
    private List<Gallery> galleries;

    @ManyToMany(mappedBy = "products")
    @JsonIgnore
    private List<Order> orders;
}