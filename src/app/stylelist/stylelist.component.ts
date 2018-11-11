import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { MatDialog} from '@angular/material';

import { StyleformComponent } from '../styleform/styleform.component';

import { StyleService } from '../services/style.service';
import { IStyle } from '../models/style';
import { Global } from '../shared/global';
import { ListComponent } from '../shared/listComponent';

@Component({
  selector: 'app-stylelist',
  templateUrl: './stylelist.component.html',
  styleUrls: ['./stylelist.component.scss']
})
export class StylelistComponent implements OnInit, ListComponent {
  listItems: IStyle[];
  listItem: IStyle;
  dbops: string;
  loadingState: boolean;
  modalTitle: string;
  modalBtnTitle: string;

  displayedColumns = ['name', 'action'];
  dataSource = new MatTableDataSource<IStyle>();

  constructor(public snackBar: MatSnackBar, private _styleService: StyleService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadingState = true;
    this.loadListItems();
  }

  loadListItems(): void {
    this._styleService.getAllStyles(Global.BASE_STYLE_ENDPOINT)
      .subscribe(items => {
        this.loadingState = false;
        this.dataSource.data = items;
      });
  }

  createListItem() {
    this.dbops = "create"
    this.modalTitle = 'Add New Style';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  updateListItem(id: number) {
    this.dbops = "update"
    this.modalTitle = 'Edit Style';
    this.modalBtnTitle = 'Update';
    this.listItem = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  deleteListItem(id: number) {
    this.dbops = "delete"
    this.modalTitle = 'Are you sure you want to delete this style?';
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
    const dialogRef = this.dialog.open(StyleformComponent, {
      width: '500px',
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, style: this.listItem }
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
