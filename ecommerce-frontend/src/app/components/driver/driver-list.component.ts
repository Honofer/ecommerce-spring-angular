import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver.model';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-list.component.html'
})
export class DriverListComponent implements OnInit {
  drivers = signal<Driver[]>([]);
  selectedDriver: Driver = this.getEmptyDriver();
  isEditMode = false;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  getEmptyDriver(): Driver {
    return { firstName: '', lastName: '', email: '', phone: '', username: '', address: '' };
  }

  loadDrivers(): void {
    this.driverService.getAll().subscribe({
      next: (data) => this.drivers.set(data),
      error: (err) => console.error('Erreur lors du chargement des chauffeurs', err)
    });
  }

  resetForm(): void {
    this.selectedDriver = this.getEmptyDriver();
    this.isEditMode = false;
  }

  editDriver(driver: Driver): void {
    this.selectedDriver = { ...driver };
    this.isEditMode = true;
  }

  saveDriver(): void {
    console.log('Tentative de sauvegarde du chauffeur:', this.selectedDriver);
    if (this.isEditMode && this.selectedDriver.id) {
      this.driverService.update(this.selectedDriver.id, this.selectedDriver).subscribe({
        next: () => {
          console.log('Chauffeur mis à jour avec succès');
          this.loadDrivers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification: ${errorMsg}`);
        }
      });
    } else {
      this.driverService.create(this.selectedDriver).subscribe({
        next: () => {
          console.log('Chauffeur créé avec succès');
          this.loadDrivers();
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

  deleteDriver(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      this.driverService.delete(id).subscribe({
        next: () => {
          console.log('Chauffeur supprimé');
          this.loadDrivers();
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('driverModal');
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
