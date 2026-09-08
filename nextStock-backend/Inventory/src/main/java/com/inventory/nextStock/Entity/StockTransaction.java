package com.inventory.nextStock.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transactions")
public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transaction_id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private TransactionType transaction_type;

    private Integer quantity;

    private LocalDateTime transaction_date;

    private String remarks;

    public StockTransaction() {
    }

    public StockTransaction(Integer transaction_id,
                            Product product,
                            User user,
                            TransactionType transaction_type,
                            Integer quantity,
                            LocalDateTime transaction_date,
                            String remarks) {

        this.transaction_id = transaction_id;
        this.product = product;
        this.user = user;
        this.transaction_type = transaction_type;
        this.quantity = quantity;
        this.transaction_date = transaction_date;
        this.remarks = remarks;
    }

    @PrePersist
    public void prePersist() {
        this.transaction_date = LocalDateTime.now();
    }

    public Integer getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(Integer transaction_id) {
        this.transaction_id = transaction_id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TransactionType getTransaction_type() {
        return transaction_type;
    }

    public void setTransaction_type(TransactionType transaction_type) {
        this.transaction_type = transaction_type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getTransaction_date() {
        return transaction_date;
    }

    public void setTransaction_date(LocalDateTime transaction_date) {
        this.transaction_date = transaction_date;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}