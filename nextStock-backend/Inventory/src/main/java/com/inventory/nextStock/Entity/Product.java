package com.inventory.nextStock.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name="products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer product_id;

    private String product_name;
    private String sku;
    private String barcode;

    private BigDecimal cost_price;
    private BigDecimal selling_price;
    private Integer minimum_stock;
    private LocalDate expiry_date;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    public Product(Integer product_id, String product_name, String sku, String barcode,BigDecimal cost_price, BigDecimal selling_price, LocalDate expiry_date, Category category, Supplier supplier, Integer minimum_stock) {

        this.product_id = product_id;
        this.product_name = product_name;
        this.sku = sku;
        this.barcode = barcode;
        this.cost_price = cost_price;
        this.selling_price = selling_price;
        this.expiry_date = expiry_date;
        this.category = category;
        this.supplier = supplier;
        this.minimum_stock = minimum_stock;
    }

    public Product() {

    }

    public Integer getProduct_id() {
        return product_id;
    }

    public void setProduct_id(Integer product_id) {
        this.product_id = product_id;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public BigDecimal getCost_price() {
        return cost_price;
    }

    public void setCost_price(BigDecimal cost_price) {
        this.cost_price = cost_price;
    }

    public  BigDecimal getSelling_price() {
        return selling_price;
    }

    public void setSelling_price(BigDecimal selling_price) {
        this.selling_price = selling_price;
    }

    public Integer getMinimum_stock() {
        return minimum_stock;
    }

    public void setMinimum_stock(Integer minimum_stock) {
        this.minimum_stock = minimum_stock;
    }

    public LocalDate getExpiry_date() {
        return expiry_date;
    }

    public void setExpiry_date(LocalDate expiry_date) {
        this.expiry_date = expiry_date;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    @Override
    public String toString() {
        return "Product{" +
                "product_id=" + product_id +
                ", product_name='" + product_name + '\'' +
                ", sku='" + sku + '\'' +
                ", barcode='" + barcode + '\'' +
                ", cost_price=" + cost_price +
                ", selling_price=" + selling_price +
                ", minimum_stock=" + minimum_stock +
                ", expiry_date=" + expiry_date +
                ", category=" + category +
                ", supplier=" + supplier +
                '}';
    }
}
