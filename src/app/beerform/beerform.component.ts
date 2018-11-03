import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BeerlistComponent } from '../beerlist/beerlist.component';

import { BeerService } from '../services/beer.service';
import { Global } from '../shared/global';
import { FormComponent } from '../shared/formComponent';

@Component({
  selector: 'app-beerform',
  templateUrl: './beerform.component.html',
  styleUrls: ['./beerform.component.scss']
})
export class BeerformComponent implements OnInit, FormComponent {
  itemForm: FormGroup;

  formErrors = {
    'name': '',
    'style': '',
    'abv': '',
    'ibu': '',
    'og': '',
    'fg': '',
    'srm': '',
    'description': ''
  };
  validationMessages = {
    'required': 'Required Field'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _beerService: BeerService,
    public dialogRef: MatDialogRef<BeerlistComponent>) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      //all properties of the model must be present here, used or not
      id: [''],
      name: ['', [Validators.required]],
      style: ['', [Validators.required]],
      abv: ['', [Validators.required]],
      ibu: ['', [Validators.required]],
      og: ['', [Validators.required]],
      fg: ['', [Validators.required]],
      srm: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    this.itemForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === "create") {
      this.itemForm.reset();
    } else {
      this.itemForm.setValue(this.data.beer);
    }
    this.SetControlsState(this.data.dbops === "delete" ? false : true);
  }

  onValueChanged(data?: any) {
    if (!this.itemForm) { return; }
    const form = this.itemForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages;
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  SetControlsState(isEnable: boolean) {
    isEnable ? this.itemForm.enable() : this.itemForm.disable();
  }

  onSubmit(formData: any) {
    const beerData = formData.value;
    switch (this.data.dbops) {
      case "create":
        this._beerService.createBeer(Global.BASE_BEER_ENDPOINT, beerData).subscribe(
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
        this._beerService.updateBeer(Global.BASE_BEER_ENDPOINT, beerData.id, beerData).subscribe(
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
        this._beerService.deleteBeer(Global.BASE_BEER_ENDPOINT, beerData.id).subscribe(
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
