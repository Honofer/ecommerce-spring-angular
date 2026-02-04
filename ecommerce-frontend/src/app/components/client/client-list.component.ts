import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {
  clients = signal<Client[]>([]);
  selectedClient: Client = this.getEmptyClient();
  isEditMode = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  getEmptyClient(): Client {
    return { firstName: '', lastName: '', email: '', phone: '', username: '', localization: '' };
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => this.clients.set(data),
      error: (err) => console.error('Erreur lors du chargement des clients', err)
    });
  }

  resetForm(): void {
    this.selectedClient = this.getEmptyClient();
    this.isEditMode = false;
  }

  editClient(client: Client): void {
    this.selectedClient = { ...client };
    this.isEditMode = true;
  }

  saveClient(): void {
    console.log('Tentative de sauvegarde du client:', this.selectedClient);
    if (this.isEditMode && this.selectedClient.id) {
      this.clientService.update(this.selectedClient.id, this.selectedClient).subscribe({
        next: () => {
          console.log('Client mis à jour avec succès');
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification: ${errorMsg}`);
        }
      });
    } else {
      this.clientService.create(this.selectedClient).subscribe({
        next: () => {
          console.log('Client créé avec succès');
          this.loadClients();
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

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          console.log('Client supprimé avec succès');
          this.loadClients();
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('clientModal');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
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
