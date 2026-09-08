package com.inventory.nextStock.Controller;


import com.inventory.nextStock.Entity.Supplier;
import com.inventory.nextStock.Services.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier){
        return supplierService.addSupplier(supplier);
    }

    @GetMapping
    public List<Supplier> getAllSupplier(){
        return supplierService.getAllSupplier();
    }
    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Integer id,
                                   @RequestBody Supplier supplier) {
        return supplierService.updateSupplier(id, supplier);
    }
}
