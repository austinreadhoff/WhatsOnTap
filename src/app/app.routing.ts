import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BeerlistComponent } from './beerlist/beerlist.component';
import { BeerformComponent } from './beerform/beerform.component';

const appRoutes: Routes = [
  { path: '',  pathMatch: 'full' , component: BeerlistComponent },
  { path: 'beerform', component: BeerformComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);