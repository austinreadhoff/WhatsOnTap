import { MatTableDataSource } from '@angular/material';

export interface ListComponent {
  listItems: Array<any>;
  listItem: any;
  dbops: string;
  loadingState: boolean;
  modalTitle: string;
  modalBtnTitle: string;
  displayedColumns: Array<string>;
  dataSource: MatTableDataSource<any>;

  loadListItems: () => void

  createListItem: () => void

  updateListItem: (id: number) => void

  deleteListItem: (id: number) => void
  showMessage: (msg: string) => void

  openDialog: () => void
}