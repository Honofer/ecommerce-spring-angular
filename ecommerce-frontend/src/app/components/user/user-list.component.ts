import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);
  selectedUser: User = this.getEmptyUser();
  isEditMode = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  getEmptyUser(): User {
    return { firstName: '', lastName: '', email: '', phone: '', username: '', password: '' };
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data: User[]) => this.users.set(data),
      error: (err: any) => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }

  resetForm(): void {
    this.selectedUser = this.getEmptyUser();
    this.isEditMode = false;
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditMode = true;
  }

  saveUser(): void {
    console.log('Tentative de sauvegarde de l\'utilisateur:', this.selectedUser);
    if (this.isEditMode && this.selectedUser.id) {
      this.userService.update(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => {
          console.log('Utilisateur mis à jour avec succès');
          this.loadUsers();
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Erreur modification', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification: ${errorMsg}`);
        }
      });
    } else {
      this.userService.create(this.selectedUser).subscribe({
        next: () => {
          console.log('Utilisateur créé avec succès');
          this.loadUsers();
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Erreur ajout', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de l'ajout: ${errorMsg}`);
        }
      });
    }
  }

  deleteUser(id: number | undefined): void {
    if (id && confirm('Supprimer cet utilisateur ?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          console.log('Utilisateur supprimé');
          this.loadUsers();
        },
        error: (err: any) => console.error('Erreur suppression', err)
      });
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('userModal');
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
