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
import { LabelService } from '../services/label.service';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-beerlist',
  templateUrl: './beerlist.component.html',
  styleUrls: ['./beerlist.component.scss']
})
export class BeerlistComponent implements OnInit, ListComponent {
  listItem: IBeer;
  dbops: string;
  loadingState: boolean;
  modalTitle: string;
  modalBtnTitle: string;
  availableStyles: IStyle[];

  displayedColumns = [ 'preview', 'name', 'style', 'abv', 'ibu', 'og', 'fg', 'srm', 'action'];
  dataSource = new MatTableDataSource<IBeer>();

  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

  constructor(public snackBar: MatSnackBar, private _beerService: BeerService, private _styleService: StyleService, private _labelService: LabelService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadingState = true;
    this.loadListItems();

    this.connection.start().catch(err => alert(err));

    this.connection.on("LabelUpdated", (beerId, labelId) => {
      this.updateLabel(beerId, labelId);
    });
  }

  loadListItems(): void {
    this._labelService.getAllLabels(Global.BASE_LABEL_ENDPOINT)
      .subscribe(labels => {
        this._styleService.getAllStyles(Global.BASE_STYLE_ENDPOINT)
          .subscribe(styles => {
            this.availableStyles = styles
              .sort((a, b) => {
                return a.name.localeCompare(b.name)
              });
            this._beerService.getAllBeers(Global.BASE_BEER_ENDPOINT)
              .subscribe(items => {
                this.loadingState = false;
                items.forEach((i)=>{
                  i.style = styles.find((s)=>{return s.id == i.styleId;});
                  i.label = labels.find((l)=>{return l.id == i.labelId;});
                  if (i.label){
                    i.labelSrc = `data:image/${i.label.extension};base64,${i.label.image}`;
                  }
                  else{
                    i.labelSrc = null;
                  }
                });
                this.dataSource.data = items
                  .sort((a, b) => {
                    return a.name.localeCompare(b.name)
                  });
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
      } else if (result === '409') {
        this.showMessage('Cannot delete a beer that is currently on tap.');
      } else if (result === 'styleTxt') {
        this.showMessage('Please select a valid style from the list');
      } else if (result === 'error') {
        this.showMessage('There is some issue in saving records, please complain to system administrator!');
      }
    });
  }

  toggleLabelUpload(id:number): void{
    var container = document.getElementById("upload-container-"+id);
    if (container.classList.contains("upload-container-visible"))
      container.classList.remove("upload-container-visible");
    else{
      container.classList.add("upload-container-visible");
    }
  }

  //signalR functions
  updateLabel(relatedBeerId:number, labelId:number){
    var updatedIndices = [];

    this.dataSource.data
      .map(li => li.id)
      .forEach((beerId, index) => {
        if (beerId == relatedBeerId){
          updatedIndices.push(index);
        }
      });
    
    if (updatedIndices.length){
      this._labelService.getLabelById(Global.BASE_LABEL_ENDPOINT, labelId)
        .subscribe(async(label) => {
          updatedIndices.forEach(i => {
            this.dataSource.data[i].label = label;
            this.dataSource.data[i].labelSrc = `data:image/${label.extension};base64,${label.image}`;
          }, this);
        });
    }
  }
}
