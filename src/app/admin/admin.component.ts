import { Component, OnInit } from '@angular/core';

class menuTile{
  imgSrc: string;
  path: string;
  text: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  tiles: menuTile[];

  constructor() { }

  ngOnInit() {
    this.tiles = [
      {
        imgSrc: "assets/img/taps.png",
        path: "/taps",
        text: "My Taps"
      },
      {
        imgSrc: "assets/img/beers.png",
        path: "/beers",
        text: "My Beers"
      },
      {
        imgSrc: "assets/img/styles.png",
        path: "/styles",
        text: "Beer Styles"
      },
      {
        imgSrc: "assets/img/settings.png",
        path: "/settings",
        text: "Brewery Settings"
      }
    ];
  }

}
