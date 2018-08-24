import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BeerformComponent } from '../beerform/beerform.component';

import { BeerService } from '../services/beer.service';
import { IBeer } from '../models/beer';
import { Global } from '../shared/global';

@Component({
  selector: 'app-beerlist',
  templateUrl: './beerlist.component.html',
  styleUrls: ['./beerlist.component.scss']
})
export class BeerlistComponent implements OnInit {
  beers: IBeer[];
  beer: IBeer;
  dbops: string;
  loadingState: boolean;
  modalTitle: string;
  modalBtnTitle: string;

  displayedColumns = ['name', 'action'];
  dataSource = new MatTableDataSource<IBeer>();

  constructor(public snackBar: MatSnackBar, private _beerService: BeerService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadingState = true;
    this.loadBeers();
  }

  loadBeers(): void {
    this._beerService.getAllBeers(Global.BASE_USER_ENDPOINT)
      .subscribe(beers => {
        this.loadingState = false;
        this.dataSource.data = beers;
      });
  }

  createBeer() {
    this.dbops = "create"
    this.modalTitle = 'Add New Beer';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  updateBeer(id: number) {
    this.dbops = "update"
    this.modalTitle = 'Edit Beer';
    this.modalBtnTitle = 'Update';
    this.beer = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  deleteBeer(id: number) {
    this.dbops = "delete"
    this.modalTitle = 'Are you sure you want to delete this beer?';
    this.modalBtnTitle = 'Delete';
    this.beer = this.dataSource.data.filter(x => x.id === id)[0];
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
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, beer: this.beer }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'success') {
        this.loadingState = true;
        this.loadBeers();
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
