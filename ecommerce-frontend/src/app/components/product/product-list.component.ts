import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SubCategoryService } from '../../services/subcategory.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { SubCategory } from '../../models/subcategory.model';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SafeImagePipe } from '../../pipes/safe-image.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeImagePipe],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  subCategories = signal<SubCategory[]>([]);
  selectedProduct: Product = this.getEmptyProduct();
  isEditMode = false;

  private sanitizer = inject(DomSanitizer);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSubCategories();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        console.log('Produits chargés avec succès:', data);
        const productWithImage = data.find(p => p.gallery?.url_photo);
        if (productWithImage) {
          console.log('Exemple d\'URL photo reçue:', productWithImage.gallery?.url_photo.substring(0, 100) + '...');
        }
        this.products.set(data);
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  loadSubCategories(): void {
    this.subCategoryService.getAll().subscribe({
      next: (data) => this.subCategories.set(data),
      error: (err) => console.error('Erreur chargement sous-catégories', err)
    });
  }

  getEmptyProduct(): Product {
    return {
      ref: '',
      price: 0,
      qte: 0,
      description: '',
      subCategory: undefined,
      gallery: { url_photo: '' }
    };
  }

  editProduct(product: Product): void {
    this.selectedProduct = {
      ...product,
      gallery: product.gallery ? { ...product.gallery } : { url_photo: '' }
    };
    this.isEditMode = true;
  }

  deleteProduct(id: number | undefined): void {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          console.log('Produit supprimé avec succès');
          this.loadProducts();
        },
        error: (err) => console.error('Erreur lors de la suppression du produit:', err)
      });
    }
  }

  saveProduct(): void {
    console.log('Tentative de sauvegarde du produit:', this.selectedProduct);
    if (this.isEditMode && this.selectedProduct.id) {
      this.productService.update(this.selectedProduct.id, this.selectedProduct).subscribe({
        next: () => {
          console.log('Produit mis à jour avec succès');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification du produit:', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la modification du produit: ${errorMsg}`);
        }
      });
    } else {
      this.productService.create(this.selectedProduct).subscribe({
        next: () => {
          console.log('Produit créé avec succès');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la création du produit:', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          alert(`Erreur lors de la création du produit: ${errorMsg}`);
        }
      });
    }
  }

  resetForm(): void {
    this.selectedProduct = this.getEmptyProduct();
    this.isEditMode = false;
  }

  compareSubCategories(s1: SubCategory, s2: SubCategory): boolean {
    if (!s1 || !s2) return s1 === s2;
    return s1.id === s2.id;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.selectedProduct.gallery) {
          this.selectedProduct.gallery.url_photo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('productModal');
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
