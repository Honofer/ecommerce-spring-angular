package com.ecommerce.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class SubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description; 

    @ManyToOne
    private Category category;

    @OneToMany(mappedBy = "subCategory")
    @JsonIgnore
    private List<Product> products;
}