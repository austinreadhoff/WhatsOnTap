import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BeerlistComponent } from '../beerlist/beerlist.component';

import { BeerService } from '../services/beer.service';
import { Global } from '../shared/global';
import { FormComponent } from '../shared/formComponent';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IStyle } from '../models/style';

@Component({
  selector: 'app-beerform',
  templateUrl: './beerform.component.html',
  styleUrls: ['./beerform.component.scss']
})
export class BeerformComponent implements OnInit, FormComponent {
  itemForm: FormGroup;
  styleSelector = new FormControl();
  filteredStyles: Observable<IStyle[]>;

  formErrors = {
    'name': '',
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
      //all properties of the .cs model must be present here, used or not
      id: [''],
      name: ['', [Validators.required]],
      styleId: [''],
      style: [''],
      abv: ['', [Validators.required]],
      ibu: ['', [Validators.required]],
      og: ['', [Validators.required]],
      fg: ['', [Validators.required]],
      srm: ['', [Validators.required]],
      description: ['', [Validators.required]],
      labelId: ['']
    });
    this.styleSelector.setValidators(Validators.required);

    this.itemForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.filteredStyles = this.styleSelector.valueChanges
    .pipe(
      startWith<string | IStyle>(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._styleFilter(name) : this.data.styles.slice())
      );
    this.onValueChanged();

    if (this.data.dbops === "create") {
      this.itemForm.reset();
    } else {
      this.itemForm.setValue(this.data.beer);
      this.styleSelector.setValue(this.data.beer.style);
    }
    this.SetControlsState(!(this.data.dbops === "delete"));
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
    if (isEnable){
      this.itemForm.enable();
      this.styleSelector.enable();
    }
    else{
      this.itemForm.disable();
      this.styleSelector.disable();
    }
  }

  onSubmit(formData: any) {
    const beerData = formData.value;
    beerData.styleId = this.styleSelector.value.id;

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
            this.dialogRef.close(error);
          }
        );
        break;
    }
  }

  //Stuff for the style autocomplete
  styleDisplayFn(style?: IStyle): string | undefined {
    return style ? style.name : undefined;
  }

  private _styleFilter(name: string): IStyle[] {
    const filterValue = name.toLowerCase();
    return this.data.styles.filter(style => style.name.toLowerCase().indexOf(filterValue) != -1);
  }
}
