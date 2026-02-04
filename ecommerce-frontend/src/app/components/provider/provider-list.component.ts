import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../models/provider.model';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-list.component.html'
})
export class ProviderListComponent implements OnInit {
  providers = signal<Provider[]>([]);
  selectedProvider: Provider = this.getEmptyProvider();
  isEditMode = false;

  constructor(
    private providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  getEmptyProvider(): Provider {
    return { firstName: '', lastName: '', email: '', phone: '', username: '', company: '' };
  }

  loadProviders(): void {
    this.providerService.getAll().subscribe({
      next: (data) => this.providers.set(data),
      error: (err) => console.error('Erreur lors du chargement des fournisseurs', err)
    });
  }

  resetForm(): void {
    this.selectedProvider = this.getEmptyProvider();
    this.isEditMode = false;
  }

  editProvider(provider: Provider): void {
    this.selectedProvider = { ...provider };
    this.isEditMode = true;
  }

  saveProvider(): void {
    console.log('Tentative de sauvegarde du fournisseur:', this.selectedProvider);
    if (this.isEditMode && this.selectedProvider.id) {
      this.providerService.update(this.selectedProvider.id, this.selectedProvider).subscribe({
        next: () => {
          console.log('Fournisseur mis à jour avec succès');
          this.loadProviders();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification: ${errorMsg}`);
        }
      });
    } else {
      this.providerService.create(this.selectedProvider).subscribe({
        next: () => {
          console.log('Fournisseur créé avec succès');
          this.loadProviders();
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

  deleteProvider(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      this.providerService.delete(id).subscribe({
        next: () => {
          console.log('Fournisseur supprimé');
          this.loadProviders();
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('providerModal');
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
