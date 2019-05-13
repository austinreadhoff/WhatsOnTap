import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { MatDialog} from '@angular/material';

import { TapformComponent } from '../tapform/tapform.component';

import { TapService } from '../services/tap.service';
import { BeerService } from '../services/beer.service';
import { ITap } from '../models/tap';
import { IBeer } from '../models/beer';
import { Global } from '../shared/global';
import { ListComponent } from '../shared/listComponent';

@Component({
  selector: 'app-taplist',
  templateUrl: './taplist.component.html',
  styleUrls: ['./taplist.component.scss']
})
export class TaplistComponent implements OnInit,ListComponent {
  listItem: ITap;
  dbops: string;
  loadingState: boolean;
  modalTitle: string;
  modalBtnTitle: string;
  availableBeers: IBeer[];

  displayedColumns = ['beerName', 'action'];
  dataSource = new MatTableDataSource<ITap>();

  constructor(public snackBar: MatSnackBar, private _tapService: TapService, private _beerService: BeerService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadingState = true;
    this.loadListItems();
  }
  loadListItems(): void {
    this._beerService.getAllBeers(Global.BASE_BEER_ENDPOINT)
      .subscribe(beers => {
        this.availableBeers = beers
          .sort((a, b) => {
            return a.name.localeCompare(b.name)
          });
        this._tapService.getAllTaps(Global.BASE_TAP_ENDPOINT)
          .subscribe(items => {
            this.loadingState = false;
            items.forEach((i)=>{
              i.beer = beers.find((b)=>{return b.id == i.beerId;});
            })
            this.dataSource.data = items
              .sort((a, b) => {
                return a.order < b.order ? -1 : 1;
              });
          });
      })
  }

  createListItem() {
    this.dbops = "create"
    this.modalTitle = 'Add New Tap';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  updateListItem(id: number) {
    this.dbops = "update"
    this.modalTitle = 'Edit Tap';
    this.modalBtnTitle = 'Update';
    this.listItem = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  deleteListItem(id: number) {
    this.dbops = "delete"
    this.modalTitle = 'Are you sure you want to delete this tap?';
    this.modalBtnTitle = 'Delete';
    this.listItem = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  showMessage(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TapformComponent, {
      width: '500px',
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, beers: this.availableBeers, tap: this.listItem }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'success') {
        this.loadingState = true;
        this.loadListItems();
        switch (this.dbops) {
          case "create":
            this.showMessage('Data successfully added.');
            break;
          case "update":
            this.showMessage('Data successfully updated.');
            break;
          case "delete":
            this.showMessage('Data successfully deleted.');
            break;
        }
      } else if (result === 'beerTxt') {
        this.showMessage('Please select a valid beer from the list');
      } else if (result === 'error') {
        this.showMessage('There is some issue in saving records, please complain to system administrator!');
      }
    });
  }
}
