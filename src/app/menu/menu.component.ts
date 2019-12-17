import { Component, OnInit } from '@angular/core';

import { Global } from '../shared/global';
import { TapService } from '../services/tap.service';
import { SettingService } from '../services/setting.service';
import { ITap } from '../models/tap';
import { IBeer } from '../models/beer';
import { ILabel } from '../models/label';
import { IStyle } from '../models/style';
import { ISetting } from '../models/setting';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  loadingState: boolean;
  taps: ITap[];

  //for paging purposes
  visibleTaps: ITap[];
  pagingActive: boolean;
  pagingIncices: number[];  //represents the first tap on each page
  firstTap: number;
  maxTaps: number;
  pagingInterval: number;
  currentPage: number;

  brewerySettings: object;
  background: string;
  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

  constructor(
    private _tapService: TapService,
    private _settingService: SettingService
    ) { }

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
    this.connection.on("BeerUpdated", (beer) => {
      this.updateBeer(beer);
    });
    this.connection.on("LabelUpdated", (label, beerId) => {
      this.updateLabel(label, beerId);
    });
    this.connection.on("StyleUpdated", (style) => {
      this.updateStyle(style);
    });
    this.connection.on("SettingUpdated", (setting) => {
      this.updateSetting(setting);
    });

    this.currentPage = 0;
  }

  loadData(){
    this.loadingState = true;
    this._settingService.getAllSettings(Global.BASE_SETTING_ENDPOINT)
      .subscribe(settings =>{
        this._tapService.getAllTaps(Global.BASE_TAP_ENDPOINT)
          .subscribe(taps =>{
            this.setupMenu(settings, taps);
          });
      });
  }

  setupMenu(settings: ISetting[], taps: ITap[]){
    this.loadingState = false;

    settings.forEach(setting => {
      this.brewerySettings[setting.key] = setting;
    });

    this.setupBackground();

    taps.forEach((t)=>{
      t.beer.labelSrc = Global.getLabelSrc(t.beer.label);
    })

    this.taps = taps
      .sort((a, b) => {
        return a.order < b.order ? -1 : 1;
      });

    this.initializePaging();
  }

  //#region signalR functions

  async createTap(tap: ITap){
    tap.beer.labelSrc = Global.getLabelSrc(tap.beer.label);
    this.taps.splice(tap.order-1, 0, tap);
    
    this.updateTapOrderProp();
    this.initializePaging();
  }

  deleteTap(id:number){
    var deletedIndex = this.taps.map(t => t.id).indexOf(id);
    if (deletedIndex > -1){
      this.taps.splice(deletedIndex,1);
    }
    
    this.updateTapOrderProp();
    this.initializePaging();
  }

  async updateTap(tap:ITap){
    tap.beer.labelSrc = Global.getLabelSrc(tap.beer.label);
    var updatedIndex = this.taps.map(t => t.id).indexOf(tap.id);

    this.taps.splice(updatedIndex,1);
    this.taps.splice(tap.order-1, 0, tap);

    this.updateTapOrderProp();
    this.initializePaging();
  }

  async updateBeer(beer:IBeer){
    beer.labelSrc = Global.getLabelSrc(beer.label);

    this.taps.forEach((t) => {
        if (t.beerId == beer.id){
          t.beer = beer;
        }
    });
  }

  updateLabel(label:ILabel, beerId:number){
    this.taps.forEach((t) => {
      if (t.beer.id == beerId){
        t.beer.label = label;
        t.beer.labelSrc = Global.getLabelSrc(t.beer.label);
      }
    });
  }

  updateStyle(style:IStyle){
    this.taps.forEach((t) => {
      if (t.beer.styleId = style.id){
        t.beer.style = style;
      }
    });
  }

  updateSetting(setting:ISetting){
    this.brewerySettings[setting.key] = setting;
    if (setting.key == "BackgroundType" ||
        setting.key == "MenuBackground" ||
        setting.key == "MenuSolidBackground"){
      this.setupBackground();  
    }

    this.initializePaging();
  }

  //#endregion

  //#region helpers

  setupBackground(){
    var backgroundByteArr = this.brewerySettings["MenuBackground"]["byteArrValue"];
    var backgroundExtension = this.brewerySettings["MenuBackground"]["stringValue"];
    var backgroundSolidColor = this.brewerySettings["MenuSolidBackground"]["stringValue"];
    if (this.brewerySettings["BackgroundType"]["stringValue"] == "image" && backgroundByteArr != null){
      this.background = "url(data:image/"+backgroundExtension+";base64,"+backgroundByteArr+")";
    }
    else{
      this.background = backgroundSolidColor != null ? backgroundSolidColor : "black";
    } 
  }

  initializePaging(){
    this.maxTaps = this.brewerySettings["MaxTapsPerPage"]["intValue"];
    this.pagingInterval = this.brewerySettings["PagingInterval"]["intValue"] * 1000; //seconds -> milliseconds

    if (this.taps.length <= this.maxTaps){
      this.pagingActive = false;
      this.visibleTaps = this.taps;
      this.firstTap = 0;
    }
    else{
      this.pagingIncices = [];
      for(var t = 0; t < this.taps.length; t += this.maxTaps){
        this.pagingIncices.push(t);
      }

      //if it's already active, the loop is already looping, don't start multiple loops!
      if (!this.pagingActive){
        this.pagingActive = true;
        this.pagingLoop();
      }
    }
  }

  pagingLoop(){
    this.visibleTaps = [];

    this.firstTap = this.pagingIncices[this.currentPage];
    for(var t = 0; t < this.maxTaps; t++){
      this.visibleTaps.push(this.taps[this.firstTap + t]);
    }

    this.currentPage = (this.currentPage >= this.pagingIncices.length - 1) ? 0 : this.currentPage + 1;

    setTimeout(() => {
      if (this.pagingActive){
        this.pagingLoop();
      }
    }, (this.pagingInterval));
  }

  updateTapOrderProp(){
    for(var i = 0; i < this.taps.length; i++){
      this.taps[i].order = i+1;
    }
  }

  //#endregion
}
