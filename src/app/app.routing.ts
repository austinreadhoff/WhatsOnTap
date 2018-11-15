import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MenuComponent} from './menu/menu.component'
import { BeerlistComponent } from './beerlist/beerlist.component';
import {TaplistComponent} from './taplist/taplist.component';
import {StylelistComponent} from './stylelist/stylelist.component';

const appRoutes: Routes = [
  { path: '',  pathMatch: 'full' , component: MenuComponent },
  { path: 'beers',  pathMatch: 'full' , component: BeerlistComponent },
  { path: 'taps',  pathMatch: 'full' , component: TaplistComponent },
  { path: 'styles',  pathMatch: 'full' , component: StylelistComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);