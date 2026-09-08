package com.inventory.nextStock.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sale_id;

    private LocalDateTime sale_date;

    private BigDecimal total_amount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Sale() {
    }

    public Sale(Integer sale_id,
                LocalDateTime sale_date,
                BigDecimal total_amount,
                User user) {
        this.sale_id = sale_id;
        this.sale_date = sale_date;
        this.total_amount = total_amount;
        this.user = user;
    }

    @PrePersist
    public void prePersist() {
        this.sale_date = LocalDateTime.now();
    }

    public Integer getSale_id() {
        return sale_id;
    }

    public void setSale_id(Integer sale_id) {
        this.sale_id = sale_id;
    }

    public LocalDateTime getSale_date() {
        return sale_date;
    }

    public void setSale_date(LocalDateTime sale_date) {
        this.sale_date = sale_date;
    }

    public BigDecimal getTotal_amount() {
        return total_amount;
    }

    public void setTotal_amount(BigDecimal total_amount) {
        this.total_amount = total_amount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}