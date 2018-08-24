import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, AUTOCOMPLETE_PANEL_HEIGHT } from '@angular/material';

import { BeerlistComponent } from '../beerlist/beerlist.component';

import { IBeer } from '../models/beer';
import { BeerService } from '../services/beer.service';
import { Global } from '../shared/global';

@Component({
  selector: 'app-beerform',
  templateUrl: './beerform.component.html',
  styleUrls: ['./beerform.component.scss']
})
export class BeerformComponent implements OnInit {
  msg: string;
  indLoading = false;
  beerFrm: FormGroup;

  formErrors = {
    'name': ''
  };
  validationMessages = {
    'name': {
      'maxlength': 'Name cannot be more than 255 characters long.',
      'required': 'Name is required.'
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _beerService: BeerService,
    public dialogRef: MatDialogRef<BeerlistComponent>) { }

  ngOnInit() {
    this.beerFrm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]]
    });

    this.beerFrm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === "create") {
      this.beerFrm.reset();
    } else {
      this.beerFrm.setValue(this.data.beer);
    }
    this.SetControlsState(this.data.dbops === "delete" ? false : true);
  }

  onValueChanged(data?: any) {
    if (!this.beerFrm) { return; }
    const form = this.beerFrm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  SetControlsState(isEnable: boolean) {
    isEnable ? this.beerFrm.enable() : this.beerFrm.disable();
  }

  onSubmit(formData: any) {
    const beerData = formData.value;
    switch (this.data.dbops) {
      case "create":
        this._beerService.createBeer(Global.BASE_USER_ENDPOINT, beerData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case "update":
        this._beerService.updateBeer(Global.BASE_USER_ENDPOINT, beerData.id, beerData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case "delete":
        this._beerService.deleteBeer(Global.BASE_USER_ENDPOINT, beerData.id).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
    }
  }
}
