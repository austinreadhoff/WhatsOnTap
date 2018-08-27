import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeerlistComponent } from './beerlist/beerlist.component';

const appRoutes: Routes = [
  { path: '',  pathMatch: 'full' , component: BeerlistComponent },
  { path: 'beers',  pathMatch: 'full' , component: BeerlistComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);