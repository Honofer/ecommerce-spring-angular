import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubCategoryService } from '../../services/subcategory.service';
import { CategoryService } from '../../services/category.service';
import { SubCategory } from '../../models/subcategory.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-subcategory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subcategory-list.component.html',
  styleUrls: ['./subcategory-list.component.scss']
})
export class SubCategoryListComponent implements OnInit {
  subCategories = signal<SubCategory[]>([]);
  categories = signal<Category[]>([]);
  selectedSubCategory: SubCategory = { name: '', description: '', category: undefined };
  isEditMode = false;

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadSubCategories();
    this.loadCategories();
  }

  loadSubCategories(): void {
    this.subCategoryService.getAll().subscribe({
      next: (data) => this.subCategories.set(data),
      error: (err) => console.error('Erreur lors du chargement des sous-catégories', err)
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Erreur lors du chargement des catégories', err)
    });
  }

  resetForm(): void {
    this.selectedSubCategory = { name: '', description: '', category: undefined };
    this.isEditMode = false;
  }

  editSubCategory(subCategory: SubCategory): void {
    this.selectedSubCategory = { ...subCategory };
    this.isEditMode = true;
  }

  saveSubCategory(): void {
    console.log('Tentative de sauvegarde de la sous-catégorie:', this.selectedSubCategory);
    if (this.isEditMode && this.selectedSubCategory.id) {
      this.subCategoryService.update(this.selectedSubCategory.id, this.selectedSubCategory).subscribe({
        next: () => {
          console.log('Sous-catégorie mise à jour avec succès');
          this.loadSubCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification: ${errorMsg}`);
        }
      });
    } else {
      this.subCategoryService.create(this.selectedSubCategory).subscribe({
        next: () => {
          console.log('Sous-catégorie créée avec succès');
          this.loadSubCategories();
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

  deleteSubCategory(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) {
      this.subCategoryService.delete(id).subscribe({
        next: () => {
          console.log('Sous-catégorie supprimée avec succès');
          this.loadSubCategories();
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  compareCategories(c1: Category, c2: Category): boolean {
    if (!c1 || !c2) return c1 === c2;
    return c1.id === c2.id;
  }

  private closeModal(): void {
    const modalElement = document.getElementById('subcategoryModal');
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
