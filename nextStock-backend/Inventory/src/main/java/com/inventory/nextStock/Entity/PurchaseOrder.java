package com.inventory.nextStock.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer purchase_order_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private LocalDate order_date;

    private LocalDate expected_date;

    @Enumerated(EnumType.STRING)
    private PurchaseOrderStatus status;

    private BigDecimal total_amount;

    public PurchaseOrder() {
    }

    public PurchaseOrder(Integer purchase_order_id,
                         Supplier supplier,
                         LocalDate order_date,
                         LocalDate expected_date,
                         PurchaseOrderStatus status,
                         BigDecimal total_amount) {
        this.purchase_order_id = purchase_order_id;
        this.supplier = supplier;
        this.order_date = order_date;
        this.expected_date = expected_date;
        this.status = status;
        this.total_amount = total_amount;
    }

    public Integer getPurchase_order_id() {
        return purchase_order_id;
    }

    public void setPurchase_order_id(Integer purchase_order_id) {
        this.purchase_order_id = purchase_order_id;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public LocalDate getOrder_date() {
        return order_date;
    }

    public void setOrder_date(LocalDate order_date) {
        this.order_date = order_date;
    }

    public LocalDate getExpected_date() {
        return expected_date;
    }

    public void setExpected_date(LocalDate expected_date) {
        this.expected_date = expected_date;
    }

    public PurchaseOrderStatus getStatus() {
        return status;
    }

    public void setStatus(PurchaseOrderStatus status) {
        this.status = status;
    }
    public BigDecimal getTotal_amount() {
        return total_amount;
    }

    public void setTotal_amount(BigDecimal total_amount) {
        this.total_amount = total_amount;
    }
}