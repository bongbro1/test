import { Routes } from '@angular/router';
import { OrderManagementComponent } from './features/admin/order-management/order-management.component';
import { ProductManagementComponent } from './features/admin/product-management/product-management.component';
import { BrandManagementComponent } from './features/admin/brand-management/brand-management.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';

export const routes: Routes = [
    { path: 'admin', redirectTo: '/admin/user-management', pathMatch: 'full' },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
          { path: 'user-management', component: UserManagementComponent },
          { path: 'brand-management', component: BrandManagementComponent },
          { path: 'product-management', component: ProductManagementComponent },
          { path: 'order-management', component: OrderManagementComponent },
        ]
      }
];

