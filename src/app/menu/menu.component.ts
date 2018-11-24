import { Component, OnInit } from '@angular/core';

import { Global } from '../shared/global';
import { BeerService } from '../services/beer.service';
import { StyleService } from '../services/style.service';
import { TapService } from '../services/tap.service';
import { ITap } from '../models/tap';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  loadingState: boolean;
  taps: ITap[];
  breweryName: String;

  constructor(private _beerService: BeerService, private _styleService: StyleService, private _tapService: TapService) { }

  ngOnInit() {
    this.loadingState = true;
    this.loadBeers();

    //TODO: pull from data
    this.breweryName = "The Best Fucking Brewery"
  }

  loadBeers(){
    this._tapService.getAllTaps(Global.BASE_TAP_ENDPOINT)
      .subscribe(taps =>{
        this._styleService.getAllStyles(Global.BASE_STYLE_ENDPOINT)
          .subscribe(styles => {
            this._beerService.getAllBeers(Global.BASE_BEER_ENDPOINT)
              .subscribe(beers => {
                this.loadingState = false;
                beers.forEach((b)=>{
                  b.style = styles.find((s)=>{return s.id == b.styleId;});
                  b.labelSrc = `data:image/png;base64,${b.label}`;
                });
                taps.forEach((t)=>{
                  t.beer = beers.find((b) => {return b.id == t.beerId;});
                })
                this.taps = taps;
              });
          });
      });
  }

}
