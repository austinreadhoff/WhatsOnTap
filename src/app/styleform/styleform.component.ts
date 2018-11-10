import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { StylelistComponent } from '../stylelist/stylelist.component';

import { StyleService } from '../services/style.service';
import { Global } from '../shared/global';
import { FormComponent } from '../shared/formComponent';

@Component({
  selector: 'app-styleform',
  templateUrl: './styleform.component.html',
  styleUrls: ['./styleform.component.scss']
})
export class StyleformComponent implements OnInit, FormComponent {
  itemForm: FormGroup;

  formErrors = {
    'name': ''
  };
  validationMessages = {
    'required': 'Required Field'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _styleService: StyleService,
    public dialogRef: MatDialogRef<StylelistComponent>) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      //all properties of the model must be present here, used or not
      id: [''],
      name: ['', [Validators.required]]
    });

    this.itemForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === "create") {
      this.itemForm.reset();
    } else {
      this.itemForm.setValue(this.data.style);
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
    const styleData = formData.value;
    switch (this.data.dbops) {
      case "create":
        this._styleService.createStyle(Global.BASE_STYLE_ENDPOINT, styleData).subscribe(
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
        this._styleService.updateStyle(Global.BASE_STYLE_ENDPOINT, styleData.id, styleData).subscribe(
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
        this._styleService.deleteStyle(Global.BASE_STYLE_ENDPOINT, styleData.id).subscribe(
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
