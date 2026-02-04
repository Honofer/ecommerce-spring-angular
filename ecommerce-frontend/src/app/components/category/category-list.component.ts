import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories = signal<Category[]>([]);
  selectedCategory: Category = { name: '', description: '' };
  isEditMode = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Erreur lors du chargement des catégories', err)
    });
  }

  resetForm(): void {
    this.selectedCategory = { name: '', description: '' };
    this.isEditMode = false;
  }

  editCategory(category: Category): void {
    this.selectedCategory = { ...category };
    this.isEditMode = true;
  }

  saveCategory(): void {
    console.log('Tentative de sauvegarde de la catégorie:', this.selectedCategory);
    if (this.isEditMode && this.selectedCategory.id) {
      this.categoryService.update(this.selectedCategory.id, this.selectedCategory).subscribe({
        next: () => {
          console.log('Catégorie mise à jour avec succès');
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification: ${errorMsg}`);
        }
      });
    } else {
      this.categoryService.create(this.selectedCategory).subscribe({
        next: () => {
          console.log('Catégorie créée avec succès');
          this.loadCategories();
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

  deleteCategory(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          console.log('Catégorie supprimée avec succès');
          this.loadCategories();
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('categoryModal');
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
