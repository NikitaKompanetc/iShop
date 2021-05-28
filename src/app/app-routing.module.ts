import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './components/add-item/add-item.component';


import { ItemsComponent } from './components/items/items.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
