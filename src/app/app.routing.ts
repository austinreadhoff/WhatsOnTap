import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MenuComponent} from './menu/menu.component'
import { BeerlistComponent } from './beerlist/beerlist.component';
import {TaplistComponent} from './taplist/taplist.component';
import {StylelistComponent} from './stylelist/stylelist.component';
import { AdminComponent } from './admin/admin.component';
import { SettingsComponent } from './settings/settings.component';

const appRoutes: Routes = [
  { path: '',  pathMatch: 'full' , component: MenuComponent },
  { path: 'admin',  pathMatch: 'full' , component: AdminComponent },
  { path: 'beers',  pathMatch: 'full' , component: BeerlistComponent },
  { path: 'taps',  pathMatch: 'full' , component: TaplistComponent },
  { path: 'styles',  pathMatch: 'full' , component: StylelistComponent },
  { path: 'settings',  pathMatch: 'full' , component: SettingsComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);