import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product/product-list.component';
import { OrderListComponent } from './components/order/order-list.component';
import { CategoryListComponent } from './components/category/category-list.component';
import { SubCategoryListComponent } from './components/subcategory/subcategory-list.component';
import { ClientListComponent } from './components/client/client-list.component';
import { ProviderListComponent } from './components/provider/provider-list.component';
import { DriverListComponent } from './components/driver/driver-list.component';
import { UserListComponent } from './components/user/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'subcategories', component: SubCategoryListComponent },
      { path: 'clients', component: ClientListComponent },
      { path: 'providers', component: ProviderListComponent },
      { path: 'drivers', component: DriverListComponent },
      { path: 'users', component: UserListComponent },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
