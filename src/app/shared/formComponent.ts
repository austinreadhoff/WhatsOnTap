import { FormGroup } from '@angular/forms';

export interface FormComponent {
  itemForm: FormGroup;

  formErrors: Object;
  validationMessages: Object;

  onValueChanged: (data?: any) => void

  SetControlsState: (isEnable: boolean) => void

  onSubmit: (formData: any) => void
}
