import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeerlistComponent } from './beerlist/beerlist.component';
import {TaplistComponent} from './taplist/taplist.component';

const appRoutes: Routes = [
  { path: '',  pathMatch: 'full' , component: BeerlistComponent },
  { path: 'beers',  pathMatch: 'full' , component: BeerlistComponent },
  { path: 'taps',  pathMatch: 'full' , component: TaplistComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);