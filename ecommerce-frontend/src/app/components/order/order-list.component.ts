import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ClientService } from '../../services/client.service';
import { DriverService } from '../../services/driver.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { Driver } from '../../models/driver.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  orders = signal<Order[]>([]);
  clients = signal<Client[]>([]);
  drivers = signal<Driver[]>([]);
  allProducts = signal<Product[]>([]);
  selectedOrder: Order = this.getEmptyOrder();
  isEditMode = false;

  constructor(
    private orderService: OrderService,
    private clientService: ClientService,
    private driverService: DriverService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadClients();
    this.loadDrivers();
    this.loadProducts();
  }

  getEmptyOrder(): Order {
    return {
      ref: '',
      description: '',
      qteTotal: 0,
      priceTotal: 0,
      state: false,
      client: undefined,
      driver: undefined,
      products: []
    };
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error('Erreur chargement commandes', err)
    });
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => this.clients.set(data),
      error: (err) => console.error('Erreur chargement clients', err)
    });
  }

  loadDrivers(): void {
    this.driverService.getAll().subscribe({
      next: (data) => this.drivers.set(data),
      error: (err) => console.error('Erreur chargement chauffeurs', err)
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => this.allProducts.set(data),
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  resetForm(): void {
    this.selectedOrder = this.getEmptyOrder();
    this.isEditMode = false;
  }

  editOrder(order: Order): void {
    this.selectedOrder = { ...order };
    this.isEditMode = true;
  }

  saveOrder(): void {
    console.log('Tentative de sauvegarde de la commande:', this.selectedOrder);
    if (this.isEditMode && this.selectedOrder.id) {
      this.orderService.update(this.selectedOrder.id, this.selectedOrder).subscribe({
        next: () => {
          console.log('Commande mise à jour avec succès');
          this.loadOrders();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification: ${errorMsg}`);
        }
      });
    } else {
      this.orderService.create(this.selectedOrder).subscribe({
        next: () => {
          console.log('Commande créée avec succès');
          this.loadOrders();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de l'ajout: ${errorMsg}`);
        }
      });
    }
  }

  updateState(order: Order): void {
    if (order.id) {
      order.state = !order.state;
      this.orderService.update(order.id, order).subscribe({
        next: () => {
          console.log('Statut mis à jour');
          this.loadOrders();
        },
        error: (err) => console.error('Erreur statut', err)
      });
    }
  }

  deleteOrder(id: number | undefined): void {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.orderService.delete(id).subscribe({
        next: () => {
          console.log('Commande supprimée');
          this.loadOrders();
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  compareClients(c1: Client, c2: Client): boolean {
    if (!c1 || !c2) return c1 === c2;
    return c1.id === c2.id;
  }

  compareDrivers(d1: Driver, d2: Driver): boolean {
    if (!d1 || !d2) return d1 === d2;
    return d1.id === d2.id;
  }

  compareProducts(p1: Product, p2: Product): boolean {
    if (!p1 || !p2) return p1 === p2;
    return p1.id === p2.id;
  }

  toggleProduct(product: Product): void {
    if (!this.selectedOrder.products) {
      this.selectedOrder.products = [];
    }

    const index = this.selectedOrder.products.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.selectedOrder.products.splice(index, 1);
    } else {
      this.selectedOrder.products.push(product);
    }

    // Recalculer le prix total et la quantité si nécessaire
    this.updateTotals();
  }

  isProductSelected(product: Product): boolean {
    return !!this.selectedOrder.products?.some(p => p.id === product.id);
  }

  private updateTotals(): void {
    if (this.selectedOrder.products) {
      this.selectedOrder.qteTotal = this.selectedOrder.products.length;
      this.selectedOrder.priceTotal = this.selectedOrder.products.reduce((sum, p) => sum + (p.price || 0), 0);
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('orderModal');
    if (modalElement) {
      // @ts-ignore
      const bootstrap = window.bootstrap;
      if (bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
      }
    }
  }
}
