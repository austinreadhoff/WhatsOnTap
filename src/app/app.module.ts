import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { Routing } from './app.routing';
import { AppMaterialModule } from './app.material.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BeerlistComponent } from './beerlist/beerlist.component';
import { BeerformComponent } from './beerform/beerform.component';
import { TaplistComponent } from './taplist/taplist.component';
import { TapformComponent } from './tapform/tapform.component';
import { StylelistComponent } from './stylelist/stylelist.component';
import { StyleformComponent } from './styleform/styleform.component';

import { BeerService } from './services/beer.service';
import { TapService } from './services/tap.service';
import { StyleService } from './services/style.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BeerlistComponent,
    BeerformComponent,
    TaplistComponent,
    TapformComponent,
    StylelistComponent,
    StyleformComponent
  ],
  entryComponents: [
    BeerformComponent,
    TapformComponent,
    StyleformComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    LayoutModule,
    Routing
  ],
  providers: [BeerService, TapService, StyleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
