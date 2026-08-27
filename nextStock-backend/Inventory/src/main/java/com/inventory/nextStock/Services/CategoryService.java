package com.inventory.nextStock.Services;


import com.inventory.nextStock.Entity.Category;
import com.inventory.nextStock.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.antlr.v4.runtime.tree.xpath.XPath.findAll;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository catgoryRepository) {

        this.categoryRepository = catgoryRepository;
    }
    public Category addCategory(Category category){
         return categoryRepository.save(category);
    }
    public List<Category> getAllCategories(){
         return categoryRepository.findAll();
    }
}
