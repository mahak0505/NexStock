package com.inventory.nextStock.Services;

import com.inventory.nextStock.Entity.Sale;
import com.inventory.nextStock.Repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    public Sale addSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale updateSale(Integer id, Sale newSale) {

        Sale sale = saleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Sale not found"));

        sale.setTotal_amount(newSale.getTotal_amount());
        sale.setUser(newSale.getUser());

        return saleRepository.save(sale);
    }
}