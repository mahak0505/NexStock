package com.inventory.nextStock.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer purchase_order_item_id;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private BigDecimal cost_price;

    public PurchaseOrderItem() {
    }

    public PurchaseOrderItem(Integer purchase_order_item_id,
                             PurchaseOrder purchaseOrder,
                             Product product,
                             Integer quantity,
                             BigDecimal cost_price) {
        this.purchase_order_item_id = purchase_order_item_id;
        this.purchaseOrder = purchaseOrder;
        this.product = product;
        this.quantity = quantity;
        this.cost_price = cost_price;
    }

    public Integer getPurchase_order_item_id() {
        return purchase_order_item_id;
    }

    public void setPurchase_order_item_id(Integer purchase_order_item_id) {
        this.purchase_order_item_id = purchase_order_item_id;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
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

    public BigDecimal getCost_price() {
        return cost_price;
    }

    public void setCost_price(BigDecimal cost_price) {
        this.cost_price = cost_price;
    }
}