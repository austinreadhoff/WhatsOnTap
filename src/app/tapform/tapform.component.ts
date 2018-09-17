import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { TaplistComponent } from '../taplist/taplist.component';

import { TapService } from '../services/tap.service';
import { Global } from '../shared/global';
import { FormComponent } from '../shared/formComponent';

@Component({
  selector: 'app-tapform',
  templateUrl: './tapform.component.html',
  styleUrls: ['./tapform.component.scss']
})
export class TapformComponent implements OnInit, FormComponent {
  itemForm: FormGroup;

  formErrors = {};
  validationMessages = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _tapService: TapService,
    public dialogRef: MatDialogRef<TaplistComponent>) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      id: [''],
      beerId: [''],
      order: ['']
    });

    this.itemForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === "create") {
      this.itemForm.reset();
    } else {
      this.itemForm.setValue(this.data.tap);
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
        const messages = this.validationMessages[field];
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
}
