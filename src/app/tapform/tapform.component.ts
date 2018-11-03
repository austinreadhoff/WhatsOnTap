import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { TaplistComponent } from '../taplist/taplist.component';

import { TapService } from '../services/tap.service';
import { Global } from '../shared/global';
import { FormComponent } from '../shared/formComponent';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IBeer } from '../models/beer';

@Component({
  selector: 'app-tapform',
  templateUrl: './tapform.component.html',
  styleUrls: ['./tapform.component.scss']
})
export class TapformComponent implements OnInit, FormComponent {
  itemForm: FormGroup;
  beerSelector = new FormControl();
  filteredBeers: Observable<IBeer[]>;
  formErrors = {
    'order': ''
  };
  validationMessages = {
    'required': 'Required Field'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _tapService: TapService,
    public dialogRef: MatDialogRef<TaplistComponent>) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      //all properties of the model must be present here, used or not
      id: [''],
      beerId: [''],
      beer: [''],
      order: ['', [Validators.required]]
    });
    this.beerSelector.setValidators(Validators.required);
    
    this.itemForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.filteredBeers = this.beerSelector.valueChanges
    .pipe(
      startWith<string | IBeer>(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._beerFilter(name) : this.data.beers.slice())
      );
    this.onValueChanged();

    if (this.data.dbops === "create") {
      this.itemForm.reset();
    } else {
      this.itemForm.setValue(this.data.tap);
      this.beerSelector.setValue(this.data.tap.beer);
    }
    if (this.data.dbops === "delete"){
      this.SetControlsState(false);
      this.beerSelector.disable();
    }
    else{
      this.SetControlsState(true);
      this.beerSelector.enable();
    }
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
    const tapData = formData.value;
    tapData.beerId = this.beerSelector.value.id;

    switch (this.data.dbops) {
      case "create":
        this._tapService.createTap(Global.BASE_TAP_ENDPOINT, tapData).subscribe(
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
        this._tapService.updateTap(Global.BASE_TAP_ENDPOINT, tapData.id, tapData).subscribe(
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
        this._tapService.deleteTap(Global.BASE_TAP_ENDPOINT, tapData.id).subscribe(
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

  //Stuff for the beer autocomplete
  beerDisplayFn(beer?: IBeer): string | undefined {
    return beer ? beer.name : undefined;
  }

  private _beerFilter(name: string): IBeer[] {
    const filterValue = name.toLowerCase();
    return this.data.beers.filter(beer => beer.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
