import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { ClientService } from '../../services/client.service';
import { ProviderService } from '../../services/provider.service';
import { DriverService } from '../../services/driver.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  productsCount = signal(0);
  ordersCount = signal(0);
  clientsCount = signal(0);
  providersCount = signal(0);
  driversCount = signal(0);
  totalRevenue = signal(0);

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private clientService: ClientService,
    private providerService: ProviderService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    forkJoin({
      products: this.productService.getAll(),
      orders: this.orderService.getAll(),
      clients: this.clientService.getAll(),
      providers: this.providerService.getAll(),
      drivers: this.driverService.getAll()
    }).subscribe({
      next: (data) => {
        this.productsCount.set(data.products.length);
        this.ordersCount.set(data.orders.length);
        this.clientsCount.set(data.clients.length);
        this.providersCount.set(data.providers.length);
        this.driversCount.set(data.drivers.length);

        const revenue = data.orders
          .filter(o => o.state)
          .reduce((acc, curr) => acc + (curr.priceTotal || 0), 0);
        this.totalRevenue.set(revenue);
      },
      error: (err) => {
        console.error('Erreur chargement stats dashboard', err);
      }
    });
  }
}
