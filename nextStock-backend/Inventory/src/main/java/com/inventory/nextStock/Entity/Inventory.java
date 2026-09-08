package com.inventory.nextStock.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer inventory_id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    @Column(name = "last_updated")
    private LocalDateTime last_updated;

    public Inventory() {
    }

    public Inventory(Integer inventory_id, Product product,
                     Integer quantity, LocalDateTime last_updated) {
        this.inventory_id = inventory_id;
        this.product = product;
        this.quantity = quantity;
        this.last_updated = last_updated;
    }

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.last_updated = LocalDateTime.now();
    }

    public Integer getInventory_id() {
        return inventory_id;
    }

    public void setInventory_id(Integer inventory_id) {
        this.inventory_id = inventory_id;
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

    public LocalDateTime getLast_updated() {
        return last_updated;
    }

    public void setLast_updated(LocalDateTime last_updated) {
        this.last_updated = last_updated;
    }
}