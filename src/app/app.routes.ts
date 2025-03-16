import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { QrComponent } from './pages/qr/qr.component';

export const routes: Routes = [
  {
    component: HomeComponent,
    path: ""
  },
  {
    component: QrComponent,
    path: "qr",
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
];
