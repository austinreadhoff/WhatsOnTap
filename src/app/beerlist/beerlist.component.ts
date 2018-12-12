import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { MatDialog} from '@angular/material';

import { BeerformComponent } from '../beerform/beerform.component';

import { BeerService } from '../services/beer.service';
import { StyleService } from '../services/style.service';
import { IBeer } from '../models/beer';
import { IStyle } from '../models/style';
import { Global } from '../shared/global';
import { ListComponent } from '../shared/listComponent';

@Component({
  selector: 'app-beerlist',
  templateUrl: './beerlist.component.html',
  styleUrls: ['./beerlist.component.scss']
})
export class BeerlistComponent implements OnInit, ListComponent {
  listItems: IBeer[];
  listItem: IBeer;
  dbops: string;
  loadingState: boolean;
  modalTitle: string;
  modalBtnTitle: string;
  availableStyles: IStyle[];

  displayedColumns = ['name', 'style', 'abv', 'ibu', 'og', 'fg', 'srm', 'action'];
  dataSource = new MatTableDataSource<IBeer>();

  constructor(public snackBar: MatSnackBar, private _beerService: BeerService, private _styleService: StyleService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadingState = true;
    this.loadListItems();
  }

  loadListItems(): void {
    this._styleService.getAllStyles(Global.BASE_STYLE_ENDPOINT)
      .subscribe(styles => {
        this.availableStyles = styles
          .sort((a, b) => {
            return a.name < b.name ? -1 : 1;
          });
        this._beerService.getAllBeers(Global.BASE_BEER_ENDPOINT)
          .subscribe(items => {
            this.loadingState = false;
            items.forEach((i)=>{
              i.style = styles.find((b)=>{return b.id == i.styleId;});
            });
            this.dataSource.data = items
              .sort((a, b) => {
                return a.name < b.name ? -1 : 1;
              });
          });
      });
  }

  createListItem() {
    this.dbops = "create"
    this.modalTitle = 'Add New Beer';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  updateListItem(id: number) {
    this.dbops = "update"
    this.modalTitle = 'Edit Beer';
    this.modalBtnTitle = 'Update';
    this.listItem = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  deleteListItem(id: number) {
    this.dbops = "delete"
    this.modalTitle = 'Are you sure you want to delete this beer?';
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
    const dialogRef = this.dialog.open(BeerformComponent, {
      width: '500px',
      height: '80%',
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, styles:this.availableStyles, beer: this.listItem }
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
      } else if (result === 'error') {
        this.showMessage('There is some issue in saving records, please complain to system administrator!');
      } else {
       // this.showMessage('Please try again, something went wrong');
      }
    });
  }
}
