import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client/client.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientComponent
  },
  {
    path: 'admin',
    component: DashboardComponent
  }
];
