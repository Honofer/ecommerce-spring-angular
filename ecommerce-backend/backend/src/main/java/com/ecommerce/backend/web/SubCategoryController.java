package com.ecommerce.backend.web;

import com.ecommerce.backend.entities.SubCategory;
import com.ecommerce.backend.services.SubCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
@CrossOrigin("*")
public class SubCategoryController {
    @Autowired
    private SubCategoryService subCategoryService;

    @GetMapping
    public List<SubCategory> getAll() {
        return subCategoryService.getAllSubCategories();
    }

    @GetMapping("/{id}")
    public SubCategory getById(@PathVariable Long id) {
        return subCategoryService.getSubCategoryById(id);
    }

    @PostMapping
    public SubCategory save(@RequestBody SubCategory subCategory) {
        return subCategoryService.saveSubCategory(subCategory);
    }

    @PutMapping("/{id}")
    public SubCategory update(@PathVariable Long id, @RequestBody SubCategory subCategory) {
        subCategory.setId(id);
        return subCategoryService.saveSubCategory(subCategory);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        subCategoryService.deleteSubCategory(id);
    }
}
