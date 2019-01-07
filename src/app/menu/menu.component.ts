import { Component, OnInit } from '@angular/core';

import { Global } from '../shared/global';
import { BeerService } from '../services/beer.service';
import { StyleService } from '../services/style.service';
import { TapService } from '../services/tap.service';
import { SettingService } from '../services/setting.service';
import { ITap } from '../models/tap';
import { ISetting } from '../models/setting';
import { IStyle } from '../models/style';
import { IBeer } from '../models/beer';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  loadingState: boolean;
  taps: ITap[];
  brewerySettings: object;
  background: string;
  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

  constructor(private _beerService: BeerService, private _styleService: StyleService, private _tapService: TapService, private _settingService: SettingService) { }

  ngOnInit() {
    this.brewerySettings = {};
    this.loadingState = true;
    this.loadData();

    this.connection.start().catch(err => alert(err));
    this.connection.on("TapCreated", (tap) => {
      this.createTap(tap)
    });
    this.connection.on("TapDeleted", (id) => {
      this.deleteTap(id);
    });
    this.connection.on("TapUpdated", (tap) => {
      this.updateTap(tap);
    });
    this.connection.on("BeerUpdated", (id) => {
      this.updateBeer(id);
    });
    this.connection.on("LabelUpdated", (id, label) => {
      this.updateLabel(id, label);
    });
    this.connection.on("StyleUpdated", (id) => {
      this.updateStyle(id);
    });
    this.connection.on("SettingUpdated", (setting) => {
      this.updateSetting(setting);
    });
  }

  loadData(){
    this.loadingState = true;
    this._settingService.getAllSettings(Global.BASE_SETTING_ENDPOINT)
      .subscribe(settings =>{
        this._tapService.getAllTaps(Global.BASE_TAP_ENDPOINT)
          .subscribe(taps =>{
            var beerIds = taps.map(t => t.beerId);
            this._beerService.getBeersByIds(Global.BASE_BEER_ENDPOINT, beerIds)
              .subscribe(beers => {
                var styleIds = beers.map(b => b.styleId);
                this._styleService.getStylesByIds(Global.BASE_STYLE_ENDPOINT, styleIds)
                  .subscribe(styles => {
                    this.setupMenu(settings, taps, styles, beers);
                  });
              });
          });
      });
  }

  setupMenu(settings: ISetting[], taps: ITap[], styles: IStyle[], beers: IBeer[]){
    this.loadingState = false;

    settings.forEach(setting => {
      this.brewerySettings[setting.key] = setting;
    });

    var backgroundByteArr = this.brewerySettings["MenuBackground"]["byteArrValue"];
    var backgroundSolidColor = this.brewerySettings["MenuSolidBackground"]["stringValue"];
    if (this.brewerySettings["MenuType"]["stringValue"] == "image" && backgroundByteArr != null){
      this.background = "url(data:image/jpg;base64,"+backgroundByteArr+")";
    }
    else{
      this.background = backgroundSolidColor != null ? backgroundSolidColor : "black";
    }

    beers.forEach((b)=>{
      b.style = styles.find((s)=>{return s.id == b.styleId;});
      b.labelSrc = `data:image/png;base64,${b.label}`;
    });

    taps.forEach((t)=>{
      t.beer = beers.find((b) => {return b.id == t.beerId;});
    })

    this.taps = taps
      .sort((a, b) => {
        return a.order < b.order ? -1 : 1;
      });
  }

  //signalR-related functions
  async createTap(tap: ITap){
    tap = await this.fillTapData(tap);
    this.taps.push(tap);
    this.taps = this.taps
      .sort((a, b) => {
        return a.order < b.order ? -1 : 1;
      });
  }

  deleteTap(id:number){
    var deletedIndex = this.taps.map(t => t.id).indexOf(id);
    if (deletedIndex > -1){
      this.taps.splice(deletedIndex,1);
    }
  }

  async updateTap(tap:ITap){
    tap = await this.fillTapData(tap);
    var updatedIndex = this.taps.map(t => t.id).indexOf(tap.id);
    this.taps[updatedIndex] = tap;
  }

  async updateBeer(id:number){
    var updatedIndex = this.taps
    .map(t => t.beerId)
    .indexOf(id);
    
    if (updatedIndex != -1){
      this._beerService.getBeerById(Global.BASE_BEER_ENDPOINT, id)
        .subscribe(async(beer) => {
          beer = await this.fillBeerData(beer);
          this.taps[updatedIndex].beer = beer;
        });
    }
  }

  updateLabel(id:number, label:string){
    var updatedIndex = this.taps
      .map(t => t.beerId)
      .indexOf(id);

    if (updatedIndex != -1){
      this.taps[updatedIndex].beer.label = label;
      this.taps[updatedIndex].beer.labelSrc = `data:image/png;base64,${label}`;
    }
  }

  updateStyle(id:number){
    var updatedIndex = this.taps
      .map(t => t.beer)
      .map(b => b.styleId)
      .indexOf(id);

    if (updatedIndex != -1)
    {
      this._styleService.getStyleById(Global.BASE_STYLE_ENDPOINT, id)
        .subscribe(style => {
          this.taps[updatedIndex].beer.style = style;
        })
    }
  }

  updateSetting(setting:ISetting){
    this.brewerySettings[setting.key] = setting;
  }

  //helpers
  fillTapData(tap): Promise<ITap>{
    return new Promise(resolve => {
    this._beerService.getBeerById(Global.BASE_BEER_ENDPOINT, tap.beerId)
      .subscribe(beer => {
        tap.beer = beer;
        
        this._styleService.getStyleById(Global.BASE_STYLE_ENDPOINT, beer.styleId)
        .subscribe(style => {
          tap.beer.style = style;

          resolve(tap);
        });
      });
    });
  }

  fillBeerData(beer): Promise<IBeer>{
    return new Promise(resolve => {
      this._styleService.getStyleById(Global.BASE_STYLE_ENDPOINT, beer.styleId)
      .subscribe(style => {
        beer.style = style;

        resolve(beer);
      });
    });
  }
}
