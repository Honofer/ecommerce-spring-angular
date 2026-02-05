package com.ecommerce.backend.web;

import com.ecommerce.backend.entities.Client;
import com.ecommerce.backend.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin("*")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @GetMapping
    public List<Client> getAll() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public Client getById(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    @PostMapping
    public Client save(@RequestBody Client client) {
        return clientService.saveClient(client);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) {
        client.setId(id);
        return clientService.saveClient(client);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
}
