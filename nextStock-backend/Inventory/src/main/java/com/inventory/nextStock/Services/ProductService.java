package com.inventory.nextStock.Services;


import com.inventory.nextStock.Entity.Product;
import com.inventory.nextStock.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    public Product addProduct(Product product){
        return productRepository.save(product);
    }

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }
    public Product updateProduct(Integer id, Product newProduct) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setProduct_name(newProduct.getProduct_name());
        product.setSku(newProduct.getSku());
        product.setBarcode(newProduct.getBarcode());
        product.setCost_price(newProduct.getCost_price());
        product.setSelling_price(newProduct.getSelling_price());
        product.setMinimum_stock(newProduct.getMinimum_stock());
        product.setExpiry_date(newProduct.getExpiry_date());
        product.setCategory(newProduct.getCategory());
        product.setSupplier(newProduct.getSupplier());

        return productRepository.save(product);
    }
}
