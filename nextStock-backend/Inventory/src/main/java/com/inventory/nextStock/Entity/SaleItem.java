package com.inventory.nextStock.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sale_items")
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sale_item_id;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private BigDecimal price;

    public SaleItem() {
    }

    public SaleItem(Integer sale_item_id,
                    Sale sale,
                    Product product,
                    Integer quantity,
                    BigDecimal price) {
        this.sale_item_id = sale_item_id;
        this.sale = sale;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    public Integer getSale_item_id() {
        return sale_item_id;
    }

    public void setSale_item_id(Integer sale_item_id) {
        this.sale_item_id = sale_item_id;
    }

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}