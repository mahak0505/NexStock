package com.inventory.nextStock.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notification_id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private String notification_type;

    private String message;

    private Boolean is_read;

    private LocalDateTime created_at;

    public Notification() {
    }

    public Notification(Integer notification_id,
                        Product product,
                        String notification_type,
                        String message,
                        Boolean is_read,
                        LocalDateTime created_at) {
        this.notification_id = notification_id;
        this.product = product;
        this.notification_type = notification_type;
        this.message = message;
        this.is_read = is_read;
        this.created_at = created_at;
    }

    @PrePersist
    public void prePersist() {
        this.created_at = LocalDateTime.now();

        if (this.is_read == null) {
            this.is_read = false;
        }
    }

    public Integer getNotification_id() {
        return notification_id;
    }

    public void setNotification_id(Integer notification_id) {
        this.notification_id = notification_id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getNotification_type() {
        return notification_type;
    }

    public void setNotification_type(String notification_type) {
        this.notification_type = notification_type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIs_read() {
        return is_read;
    }

    public void setIs_read(Boolean is_read) {
        this.is_read = is_read;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
}