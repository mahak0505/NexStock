package com.inventory.nextStock.Entity;

import jakarta.persistence.*;

@Entity
@Table(name="suppliers")
public class Supplier {
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Integer supplier_id;

  private String supplier_name;
  private String email;
  private String phone;
  private String address;

    public Supplier(Integer supplier_id, String supplier_name, String email, String phone, String address) {
        this.supplier_id = supplier_id;
        this.supplier_name = supplier_name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    public Supplier() {

    }

    public Integer getSupplier_id() {
        return supplier_id;
    }

    public void setSupplier_id(Integer supplier_id) {
        this.supplier_id = supplier_id;
    }

    public String getSupplier_name() {
        return supplier_name;
    }

    public void setSupplier_name(String supplier_name) {
        this.supplier_name = supplier_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String supplier_email) {
        this.email = supplier_email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Supplier{" +
                "supplier_id=" + supplier_id +
                ", supplier_name='" + supplier_name + '\'' +
                ", email='" + email + '\'' +
                ", phone=" + phone + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}
