import { Component, OnInit } from '@angular/core';

import { Global } from '../shared/global';
import { BeerService } from '../services/beer.service';
import { StyleService } from '../services/style.service';
import { IBeer } from '../models/beer';
import { IStyle } from '../models/style';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  loadingState: boolean;
  beers: IBeer[];
  breweryName: String;

  constructor(private _beerService: BeerService, private _styleService: StyleService) { }

  ngOnInit() {
    this.loadingState = true;
    this.loadBeers();

    //TODO: pull from data
    this.breweryName = "The Best Fucking Brewery"
  }

  loadBeers(){
    this._styleService.getAllStyles(Global.BASE_STYLE_ENDPOINT)
      .subscribe(styles => {
        this._beerService.getAllBeers(Global.BASE_BEER_ENDPOINT)
          .subscribe(beers => {
            this.loadingState = false;
            beers.forEach((i)=>{
              i.style = styles.find((b)=>{return b.id == i.styleId;});
            });
            this.beers = beers;
          });
      });
  }

}
