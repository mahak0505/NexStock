package com.inventory.nextStock.Services;


import com.inventory.nextStock.Entity.Supplier;
import com.inventory.nextStock.Repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {
    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    public Supplier addSupplier(Supplier supplier){
        return supplierRepository.save(supplier) ;
    }

    public List<Supplier> getAllSupplier(){
        return supplierRepository.findAll();
    }
    public Supplier updateSupplier(Integer id, Supplier newSupplier) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setSupplier_name(newSupplier.getSupplier_name());
        supplier.setEmail(newSupplier.getEmail());
        supplier.setPhone(newSupplier.getPhone());
        supplier.setAddress(newSupplier.getAddress());

        return supplierRepository.save(supplier);
    }
}
