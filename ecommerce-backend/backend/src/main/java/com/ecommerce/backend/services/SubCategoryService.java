package com.ecommerce.backend.services;

import com.ecommerce.backend.entities.SubCategory;
import com.ecommerce.backend.repositories.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubCategoryService {
    @Autowired
    private SubCategoryRepository subCategoryRepository;

    public List<SubCategory> getAllSubCategories() {
        return subCategoryRepository.findAll();
    }

    public SubCategory getSubCategoryById(Long id) {
        return subCategoryRepository.findById(id).orElse(null);
    }

    public SubCategory saveSubCategory(SubCategory subCategory) {
        return subCategoryRepository.save(subCategory);
    }

    public void deleteSubCategory(Long id) {
        subCategoryRepository.deleteById(id);
    }
}
